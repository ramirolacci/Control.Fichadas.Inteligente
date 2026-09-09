import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FichadaRaw, FichadaProcesada, ConfigTurnos } from '../types';
import { useCalculos } from './useCalculos';

export const useFileParser = (turnos: ConfigTurnos) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rawData, setRawData] = useState<FichadaRaw[]>([]);
  const { diffHoras, calcularNovedad, desglosarHoras } = useCalculos(turnos);

  const normalizarColumna = (nombre: string): string => {
    const normalizado = nombre.toLowerCase().trim();

    if (normalizado.includes('legajo') || normalizado.includes('id')) return 'legajo';
    if (normalizado.includes('nombre') || normalizado.includes('nom') || normalizado.includes('empleado')) return 'nombre';
    if (normalizado.includes('fecha')) return 'fecha';
    if (normalizado.includes('hora')) return 'hora';
    if (normalizado.includes('tipo') || normalizado.includes('movimiento')) return 'tipo';
    if (normalizado.includes('turno')) return 'turno';

    return nombre;
  };

  const mapearColumnas = (row: any): FichadaRaw | null => {
    const mapped: any = {};

    Object.keys(row).forEach(key => {
      const keyNormalizada = normalizarColumna(key);
      mapped[keyNormalizada] = row[key];
    });

    if (mapped.legajo === undefined || mapped.legajo === null ||
        mapped.nombre === undefined || mapped.nombre === null ||
        mapped.fecha === undefined || mapped.fecha === null ||
        mapped.hora === undefined || mapped.hora === null) {
      return null;
    }

    const legajo = String(mapped.legajo).trim();
    const nombre = String(mapped.nombre).trim();

    let fechaStr = '';
    if (mapped.fecha instanceof Date) {
      const d = mapped.fecha;
      const yr = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      fechaStr = `${yr}-${mo}-${da}`;
    } else {
      fechaStr = normalizarFecha(String(mapped.fecha).trim());
    }

    const horaStr = String(mapped.hora).trim();

    if (!legajo || !nombre || !fechaStr || !horaStr) {
      return null;
    }

    if (!mapped.tipo) {
      mapped.tipo = 'entrada';
    }

    const tipoLower = String(mapped.tipo).toLowerCase();
    const tipo = tipoLower.includes('entrada') || tipoLower.includes('in') ? 'entrada' : 'salida';
    const turno = mapped.turno ? (String(mapped.turno).trim() as 'mañana' | 'tarde') : undefined;

    return {
      legajo,
      nombre,
      fecha: fechaStr,
      hora: horaStr,
      tipo,
      turno,
    };
  };

  const limpiarHTML = (texto: string): string => {
    if (!texto) return '';
    // Remover tags HTML y espacios extra
    return String(texto)
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const normalizarFecha = (fechaVal: any): string => {
    if (!fechaVal) return '';
    if (fechaVal instanceof Date) {
      const yr = fechaVal.getFullYear();
      const mo = String(fechaVal.getMonth() + 1).padStart(2, '0');
      const da = String(fechaVal.getDate()).padStart(2, '0');
      return `${da}/${mo}/${yr}`;
    }

    // Convert Excel date serial numbers (e.g., 46006.8744)
    const num = Number(fechaVal);
    if (!isNaN(num) && num > 10000 && num < 100000) {
      const dateObj = new Date((num - 25569) * 86400 * 1000);
      const yr = dateObj.getUTCFullYear();
      const mo = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const da = String(dateObj.getUTCDate()).padStart(2, '0');
      return `${da}/${mo}/${yr}`;
    }
    
    // Limpiar HTML primero
    let fechaLimpia = limpiarHTML(String(fechaVal));
    
    // Extraer solo la parte de la fecha (DD/MM/YYYY)
    const matchFecha = fechaLimpia.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (matchFecha) {
      return matchFecha[1];
    }

    // Extraer solo la parte de la fecha (YYYY-MM-DD -> DD/MM/YYYY)
    const matchISO = fechaLimpia.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (matchISO) {
      const [, yr, mo, da] = matchISO;
      return `${da}/${mo}/${yr}`;
    }
    
    return fechaLimpia;
  };

  const limpiarHora = (horaStr: string): string | null => {
    if (!horaStr) return null;
    
    // Limpiar HTML primero
    let horaLimpia = limpiarHTML(horaStr);
    
    // Si contiene "Ingreso no fichado" o "Egreso no fichado", retornar null (no considerar)
    if (horaLimpia.toLowerCase().includes('no fichado')) {
      return null;
    }
    
    // Si es "00:00" y contiene "no fichado" en el HTML original, también ignorar
    if (horaStr.toLowerCase().includes('no fichado')) {
      return null;
    }
    
    // Extraer solo la hora en formato HH:MM
    const matchHora = horaLimpia.match(/(\d{2}:\d{2})/);
    if (matchHora) {
      const hora = matchHora[1];
      // Si la hora es 00:00 y el texto original contiene "no fichado", ignorar
      if (hora === '00:00' && horaStr.toLowerCase().includes('no fichado')) {
        return null;
      }
      return hora;
    }
    
    // Si no coincide con formato HH:MM, retornar null (no considerar)
    return null;
  };

  const parsearHTMLExcel = (htmlContent: string): FichadaRaw[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Buscar la tabla de fichadas
    const tablaFichadas = doc.querySelector('table');
    if (!tablaFichadas) {
      throw new Error('No se encontró la tabla de fichadas en el archivo HTML');
    }

    const tbody = tablaFichadas.querySelector('tbody') || tablaFichadas;
    const filas = tbody.querySelectorAll('tr');
    
    const fichadasRaw: FichadaRaw[] = [];
    
    // Obtener encabezados
    const thead = tablaFichadas.querySelector('thead');
    const headerRow = thead?.querySelector('tr');
    const headers: string[] = [];
    if (headerRow) {
      headerRow.querySelectorAll('th').forEach(th => {
        headers.push(limpiarHTML(th.textContent || ''));
      });
    }

    filas.forEach((fila) => {
      // Saltar filas de totales o encabezados
      if (fila.classList.contains('danger') || fila.querySelector('th')) return;
      
      const celdas = fila.querySelectorAll('td');
      if (celdas.length < 8) return; // Mínimo de columnas necesarias

      const datos: { [key: string]: string } = {};
      celdas.forEach((celda, idx) => {
        const header = headers[idx] || `col${idx}`;
        // Usar innerHTML para preservar el HTML original que luego limpiaremos
        datos[header] = celda.innerHTML || celda.textContent || '';
      });

      // Extraer datos básicos
      const codEmpleado = limpiarHTML(datos['Cod. empleado'] || datos[headers[0] || ''] || '');
      const fechaCompleta = normalizarFecha(datos['Fecha'] || datos[headers[1] || ''] || '');
      const nombre = limpiarHTML(datos['Nombre'] || datos[headers[2] || ''] || '');
      const apellido = limpiarHTML(datos['Apellido'] || datos[headers[3] || ''] || '');
      const nombreCompleto = `${nombre} ${apellido}`.trim();

      if (!codEmpleado || !fechaCompleta || !nombreCompleto || codEmpleado.toLowerCase().includes('total')) {
        return;
      }

      // Procesar las múltiples columnas de horas
      // El formato tiene hasta 3 pares de "Hora Desde" y "Hora Hasta"
      const paresHoras: Array<{ desde: string | null; hasta: string | null }> = [];
      
      // Buscar índices de las columnas de horas
      const indicesDesde: number[] = [];
      const indicesHasta: number[] = [];
      
      headers.forEach((header, idx) => {
        const headerLower = header.toLowerCase();
        if (headerLower.includes('hora desde')) {
          indicesDesde.push(idx);
        }
        if (headerLower.includes('hora hasta')) {
          indicesHasta.push(idx);
        }
      });

      // Emparejar las horas
      indicesDesde.forEach((idxDesde, i) => {
        const contenidoDesde = celdas[idxDesde]?.innerHTML || celdas[idxDesde]?.textContent || '';
        const horaDesde = limpiarHora(contenidoDesde);
        const idxHasta = indicesHasta[i];
        const contenidoHasta = idxHasta !== undefined ? (celdas[idxHasta]?.innerHTML || celdas[idxHasta]?.textContent || '') : '';
        const horaHasta = contenidoHasta ? limpiarHora(contenidoHasta) : null;
        
        // Solo agregar el par si al menos una hora es válida (no null)
        if (horaDesde !== null || horaHasta !== null) {
          paresHoras.push({ desde: horaDesde, hasta: horaHasta });
        }
      });

      // Crear fichadas para cada par de horas
      paresHoras.forEach((par, idx) => {
        // El primer par es generalmente mañana, los siguientes tarde
        const turno = idx === 0 ? 'mañana' : 'tarde';
        
        // Solo agregar entrada si hay una hora válida (no null ni vacía)
        // Ignorar completamente si es "Ingreso no fichado"
        if (par.desde && typeof par.desde === 'string') {
          fichadasRaw.push({
            legajo: codEmpleado,
            nombre: nombreCompleto,
            fecha: fechaCompleta,
            hora: par.desde,
            tipo: 'entrada',
            turno: paresHoras.length > 1 ? turno : undefined,
          });
        }
        
        // Solo agregar salida si hay una hora válida (no null ni vacía)
        // Ignorar completamente si es "Egreso no fichado"
        if (par.hasta && typeof par.hasta === 'string') {
          fichadasRaw.push({
            legajo: codEmpleado,
            nombre: nombreCompleto,
            fecha: fechaCompleta,
            hora: par.hasta,
            tipo: 'salida',
            turno: paresHoras.length > 1 ? turno : undefined,
          });
        }
      });
    });

    return fichadasRaw;
  };

  const parseFile = async (file: File): Promise<FichadaRaw[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress((e.loaded / e.total) * 50);
        }
      };

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          
          // Verificar si es un archivo HTML (archivos .xls guardados como HTML)
          if (file.name.endsWith('.xls') || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
            const text = typeof data === 'string' ? data : new TextDecoder().decode(data as ArrayBuffer);
            
            // Si contiene HTML, parsearlo como HTML
            if (text.includes('<html') || text.includes('<table') || text.includes('</table>')) {
              setProgress(50);
              const fichadasRaw = parsearHTMLExcel(text);
              setProgress(100);
              setRawData(fichadasRaw);
              resolve(fichadasRaw);
              return;
            }
          }

          let workbook: XLSX.WorkBook;

          if (file.name.endsWith('.csv')) {
            const text = typeof data === 'string' ? data : new TextDecoder().decode(data as ArrayBuffer);
            workbook = XLSX.read(text, { type: 'string' });
          } else {
            workbook = XLSX.read(data, { type: 'array' });
          }

          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          setProgress(75);

          const fichadasRaw = jsonData
            .map(row => mapearColumnas(row))
            .filter((f): f is FichadaRaw => f !== null);

          setProgress(100);
          setRawData(fichadasRaw);
          resolve(fichadasRaw);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file, 'UTF-8');
      } else if (file.name.endsWith('.xls') || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        reader.readAsText(file, 'UTF-8');
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const procesarFichadas = (fichadas: FichadaRaw[]): FichadaProcesada[] => {
    const agrupadas = new Map<string, Map<string, FichadaRaw[]>>();

    fichadas.forEach(fichada => {
      const key = `${fichada.legajo}-${fichada.nombre}`;
      if (!agrupadas.has(key)) {
        agrupadas.set(key, new Map());
      }

      const fichadasEmpleado = agrupadas.get(key)!;
      if (!fichadasEmpleado.has(fichada.fecha)) {
        fichadasEmpleado.set(fichada.fecha, []);
      }

      fichadasEmpleado.get(fichada.fecha)!.push(fichada);
    });

    const resultado: FichadaProcesada[] = [];

    agrupadas.forEach((fichadasPorFecha, empleadoKey) => {
      const [legajo, nombre] = empleadoKey.split('-');

      fichadasPorFecha.forEach((fichadasDia, fecha) => {
        fichadasDia.sort((a, b) => String(a.hora || '').localeCompare(String(b.hora || '')));
        
        let ingresoMañana: string | null = null;
        let egresoMañana: string | null = null;
        let ingresoTarde: string | null = null;
        let egresoTarde: string | null = null;

        fichadasDia.forEach((f, idx) => {
          const esMañana = f.turno === 'mañana' || (!f.turno && idx < 2);

          if (esMañana) {
            if (f.tipo === 'entrada' && !ingresoMañana) {
              ingresoMañana = f.hora;
            } else if (f.tipo === 'salida' && !egresoMañana) {
              egresoMañana = f.hora;
            }
          } else {
            if (f.tipo === 'entrada' && !ingresoTarde) {
              ingresoTarde = f.hora;
            } else if (f.tipo === 'salida' && !egresoTarde) {
              egresoTarde = f.hora;
            }
          }
        });

        const totalMañana = diffHoras(ingresoMañana, egresoMañana);
        const totalTarde = diffHoras(ingresoTarde, egresoTarde);

        const { novedad, color } = calcularNovedad(
          { ingresoMañana, egresoMañana, ingresoTarde, egresoTarde },
          fecha
        );

        const desglose = desglosarHoras(
          { ingresoMañana, egresoMañana, ingresoTarde, egresoTarde },
          fecha
        );

        const estaIncompleto =
          (ingresoMañana && !egresoMañana) ||
          (!ingresoMañana && egresoMañana) ||
          (ingresoTarde && !egresoTarde) ||
          (!ingresoTarde && egresoTarde);

        resultado.push({
          id: `${legajo}_${fecha}`,
          legajo,
          nombre,
          fecha,
          ingresoMañana,
          egresoMañana,
          totalMañana,
          ingresoTarde,
          egresoTarde,
          totalTarde,
          novedad,
          colorNovedad: color,
          horasNormales: desglose.horasNormales,
          horasExtras50: desglose.horasExtras50,
          horasExtras100: desglose.horasExtras100,
          horasNocturnas: desglose.horasNocturnas,
          incompleto: Boolean(estaIncompleto),
        });
      });
    });

    return resultado.sort((a, b) => {
      const fechaA = String(a.fecha || '');
      const fechaB = String(b.fecha || '');
      const fechaCompare = fechaB.localeCompare(fechaA);
      if (fechaCompare !== 0) return fechaCompare;
      return String(a.nombre || '').localeCompare(String(b.nombre || ''));
    });
  };

  const procesarArchivo = async (file: File): Promise<FichadaProcesada[]> => {
    setLoading(true);
    setProgress(0);

    try {
      const fichadasRaw = await parseFile(file);
      const fichadasProcesadas = procesarFichadas(fichadasRaw);
      return fichadasProcesadas;
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    procesarArchivo,
    loading,
    progress,
    rawData,
  };
};
