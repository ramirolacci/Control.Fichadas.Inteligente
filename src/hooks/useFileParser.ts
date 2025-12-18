import { useState } from 'react';
import * as XLSX from 'xlsx';
import { FichadaRaw, FichadaProcesada, ConfigTurnos } from '../types';
import { useCalculos } from './useCalculos';

export const useFileParser = (turnos: ConfigTurnos) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rawData, setRawData] = useState<FichadaRaw[]>([]);
  const { diffHoras, calcularNovedad } = useCalculos(turnos);

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

    if (!mapped.legajo || !mapped.nombre || !mapped.fecha || !mapped.hora) {
      return null;
    }

    if (!mapped.tipo) {
      mapped.tipo = 'entrada';
    }

    const tipoLower = String(mapped.tipo).toLowerCase();
    mapped.tipo = tipoLower.includes('entrada') || tipoLower.includes('in') ? 'entrada' : 'salida';

    return mapped as FichadaRaw;
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
          let workbook: XLSX.WorkBook;

          if (file.name.endsWith('.csv')) {
            const text = new TextDecoder().decode(data as ArrayBuffer);
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
        reader.readAsArrayBuffer(file);
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
        fichadasDia.sort((a, b) => a.hora.localeCompare(b.hora));

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

        resultado.push({
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
        });
      });
    });

    return resultado.sort((a, b) => {
      const fechaCompare = b.fecha.localeCompare(a.fecha);
      if (fechaCompare !== 0) return fechaCompare;
      return a.nombre.localeCompare(b.nombre);
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
