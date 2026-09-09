import { useState, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Settings, Trash2 } from 'lucide-react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FileUpload } from './components/FileUpload';
import { Filtros } from './components/Filtros';
import { TablaFichadas } from './components/TablaFichadas';
import { ConfigModal } from './components/ConfigModal';
import { EditFichadaModal } from './components/EditFichadaModal';
import { ExportButtons } from './components/ExportButtons';
import { useFileParser } from './hooks/useFileParser';
import { useCalculos } from './hooks/useCalculos';
import { FichadaProcesada, ConfigTurnos, Filtros as FiltrosType, EstadisticasDiarias } from './types';
import { DEFAULT_TURNOS } from './constants';
import {
  guardarFichadasLocal,
  obtenerFichadasLocal,
  actualizarFichadaLocal,
  limpiarFichadasLocal,
} from './services/db';

function App() {
  const [turnos, setTurnos] = useState<ConfigTurnos>(DEFAULT_TURNOS);
  const [fichadas, setFichadas] = useState<FichadaProcesada[]>([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [fichadaEditando, setFichadaEditando] = useState<FichadaProcesada | null>(null);
  const [filtros, setFiltros] = useState<FiltrosType>({
    fechaInicio: '',
    fechaFin: '',
    busqueda: '',
    tipoNovedad: 'todas',
  });

  const { procesarArchivo, loading, progress } = useFileParser(turnos);
  const { calcularTotalHoras, diffHoras, desglosarHoras } = useCalculos(turnos);

  useEffect(() => {
    const turnosGuardados = localStorage.getItem('turnos');
    if (turnosGuardados) {
      setTurnos(JSON.parse(turnosGuardados));
    }

    const cargarHistorialLocal = async () => {
      try {
        const recuperadas = await obtenerFichadasLocal();
        if (recuperadas && recuperadas.length > 0) {
          setFichadas(recuperadas);
          toast.success(`${recuperadas.length} fichadas recuperadas de la sesión guardada`, {
            id: 'indexeddb-load-toast',
          });
        }
      } catch (err) {
        console.error('Error al recuperar IndexedDB:', err);
      }
    };

    cargarHistorialLocal();
  }, []);

  const handleFileSelect = async (file: File) => {
    try {
      const fichadasProcesadas = await procesarArchivo(file);
      setFichadas(fichadasProcesadas);
      await guardarFichadasLocal(fichadasProcesadas);
      toast.success(`${fichadasProcesadas.length} registros procesados y guardados`);
    } catch (error) {
      toast.error('Error al procesar el archivo');
      console.error(error);
    }
  };

  const handleGuardarTurnos = (nuevosTurnos: ConfigTurnos) => {
    setTurnos(nuevosTurnos);
    localStorage.setItem('turnos', JSON.stringify(nuevosTurnos));
  };

  const handleLimpiar = async () => {
    setFichadas([]);
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      busqueda: '',
      tipoNovedad: 'todas',
    });
    await limpiarFichadasLocal();
    toast.success('Datos eliminados');
  };

  const handleGuardarFichadaEditada = async (actualizada: FichadaProcesada) => {
    const totMañana = diffHoras(actualizada.ingresoMañana, actualizada.egresoMañana);
    const totTarde = diffHoras(actualizada.ingresoTarde, actualizada.egresoTarde);

    const desglose = desglosarHoras(
      {
        ingresoMañana: actualizada.ingresoMañana,
        egresoMañana: actualizada.egresoMañana,
        ingresoTarde: actualizada.ingresoTarde,
        egresoTarde: actualizada.egresoTarde,
      },
      actualizada.fecha
    );

    const completa: FichadaProcesada = {
      ...actualizada,
      totalMañana: totMañana,
      totalTarde: totTarde,
      horasNormales: desglose.horasNormales,
      horasExtras50: desglose.horasExtras50,
      horasExtras100: desglose.horasExtras100,
      horasNocturnas: desglose.horasNocturnas,
    };

    setFichadas(prev =>
      prev.map(f => {
        const idMatch = (f.id && f.id === completa.id) || (f.legajo === completa.legajo && f.fecha === completa.fecha);
        return idMatch ? completa : f;
      })
    );

    await actualizarFichadaLocal(completa);
    toast.success('Fichada actualizada correctamente');
  };

  const toISODate = (fechaStr: string): string => {
    if (!fechaStr) return '';
    const str = String(fechaStr).trim();
    const matchDDMM = str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
    if (matchDDMM) {
      const [, da, mo, yr] = matchDDMM;
      return `${yr}-${mo}-${da}`;
    }
    return str;
  };

  const fichadasFiltradas = useMemo(() => {
    return fichadas.filter(f => {
      const fechaISO = toISODate(f.fecha);
      if (filtros.fechaInicio && fechaISO < filtros.fechaInicio) return false;
      if (filtros.fechaFin && fechaISO > filtros.fechaFin) return false;

      if (filtros.busqueda) {
        const busquedaLower = filtros.busqueda.toLowerCase();
        if (
          !f.nombre.toLowerCase().includes(busquedaLower) &&
          !f.legajo.toLowerCase().includes(busquedaLower)
        ) {
          return false;
        }
      }

      if (filtros.tipoNovedad !== 'todas') {
        const novedadLower = f.novedad.toLowerCase();
        switch (filtros.tipoNovedad) {
          case 'normal':
            if (!novedadLower.includes('normal')) return false;
            break;
          case 'tardanza':
            if (!novedadLower.includes('tarde')) return false;
            break;
          case 'ausente':
            if (!novedadLower.includes('ausente')) return false;
            break;
          case 'enfermo':
            if (!novedadLower.includes('enfermo') && !novedadLower.includes('médica')) return false;
            break;
        }
      }

      return true;
    });
  }, [fichadas, filtros]);

  const estadisticas = useMemo((): EstadisticasDiarias => {
    const empleadosUnicos = new Set(fichadas.map(f => f.legajo));
    const presentes = fichadas.filter(f => !f.novedad.includes('AUSENTE')).length;
    const tardanzas = fichadas.filter(f => f.novedad.includes('tarde')).length;
    const ausentes = fichadas.filter(f => f.novedad.includes('AUSENTE')).length;

    const totalHoras = fichadas.reduce((acc, f) => {
      return acc + calcularTotalHoras(f.totalMañana, f.totalTarde);
    }, 0);

    const totalHorasExtras50 = fichadas.reduce((acc, f) => acc + (f.horasExtras50 || 0), 0);
    const totalHorasExtras100 = fichadas.reduce((acc, f) => acc + (f.horasExtras100 || 0), 0);
    const totalHorasNocturnas = fichadas.reduce((acc, f) => acc + (f.horasNocturnas || 0), 0);

    return {
      totalEmpleados: empleadosUnicos.size,
      presentes,
      tardanzas,
      ausentes,
      totalHoras,
      totalHorasExtras50,
      totalHorasExtras100,
      totalHorasNocturnas,
    };
  }, [fichadas, calcularTotalHoras]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200/50 bg-mesh-pattern transition-colors duration-300">
      <Toaster position="top-right" />

      <Header />

      <main className={`container mx-auto px-4 ${fichadas.length === 0 ? 'flex-1 flex flex-col justify-center py-2' : 'py-6'}`}>
        {fichadas.length > 0 && (
          <>
            <Dashboard estadisticas={estadisticas} />

            <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <ExportButtons fichadas={fichadasFiltradas} />

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setConfigModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-950/20 active:scale-95 cursor-pointer"
                >
                  <Settings size={16} />
                  <span>Configurar Turnos</span>
                </button>

                <button
                  onClick={handleLimpiar}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-rose-950/20 active:scale-95 cursor-pointer"
                  title="Limpiar fichadas cargadas"
                >
                  <Trash2 size={16} />
                  <span>Limpiar Fichadas</span>
                </button>
              </div>
            </div>

            <Filtros filtros={filtros} onFiltrosChange={setFiltros} />

            <TablaFichadas
              fichadas={fichadasFiltradas}
              onEditFichada={(fichada) => setFichadaEditando(fichada)}
            />
          </>
        )}

        {fichadas.length === 0 && !loading && (
          <FileUpload
            onFileSelect={handleFileSelect}
            loading={loading}
            progress={progress}
          />
        )}
      </main>

      <ConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        turnos={turnos}
        onGuardar={handleGuardarTurnos}
      />

      <EditFichadaModal
        isOpen={Boolean(fichadaEditando)}
        onClose={() => setFichadaEditando(null)}
        fichada={fichadaEditando}
        onGuardar={handleGuardarFichadaEditada}
      />
    </div>
  );
}

export default App;

