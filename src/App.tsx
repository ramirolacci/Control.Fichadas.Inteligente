import { useState, useEffect, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Settings } from 'lucide-react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { FileUpload } from './components/FileUpload';
import { Filtros } from './components/Filtros';
import { TablaFichadas } from './components/TablaFichadas';
import { ConfigModal } from './components/ConfigModal';
import { ExportButtons } from './components/ExportButtons';
import { useFileParser } from './hooks/useFileParser';
import { useCalculos } from './hooks/useCalculos';
import { FichadaProcesada, ConfigTurnos, Filtros as FiltrosType, EstadisticasDiarias } from './types';
import { DEFAULT_TURNOS } from './constants';


function App() {
  const [turnos, setTurnos] = useState<ConfigTurnos>(DEFAULT_TURNOS);
  const [fichadas, setFichadas] = useState<FichadaProcesada[]>([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosType>({
    fechaInicio: '',
    fechaFin: '',
    busqueda: '',
    tipoNovedad: 'todas',
  });

  const { procesarArchivo, loading, progress } = useFileParser(turnos);
  const { calcularTotalHoras } = useCalculos(turnos);

  useEffect(() => {
    const turnosGuardados = localStorage.getItem('turnos');
    if (turnosGuardados) {
      setTurnos(JSON.parse(turnosGuardados));
    }
  }, []);



  const handleFileSelect = async (file: File) => {
    try {
      const fichadasProcesadas = await procesarArchivo(file);
      setFichadas(fichadasProcesadas);
      toast.success(`${fichadasProcesadas.length} registros procesados`);
    } catch (error) {
      toast.error('Error al procesar el archivo');
      console.error(error);
    }
  };

  const handleGuardarTurnos = (nuevosTurnos: ConfigTurnos) => {
    setTurnos(nuevosTurnos);
    localStorage.setItem('turnos', JSON.stringify(nuevosTurnos));
  };

  const handleLimpiar = () => {
    setFichadas([]);
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      busqueda: '',
      tipoNovedad: 'todas',
    });
    toast.success('Datos eliminados');
  };

  const fichadasFiltradas = useMemo(() => {
    return fichadas.filter(f => {
      if (filtros.fechaInicio && f.fecha < filtros.fechaInicio) return false;
      if (filtros.fechaFin && f.fecha > filtros.fechaFin) return false;

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
            if (!novedadLower.includes('enfermo')) return false;
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

    return {
      totalEmpleados: empleadosUnicos.size,
      presentes,
      tardanzas,
      ausentes,
      totalHoras,
    };
  }, [fichadas, calcularTotalHoras]);

  return (
    <div className="min-h-screen flex flex-col bg-base-200/50 bg-mesh-pattern transition-colors duration-300">
      <Toaster position="top-right" />

      <Header onLimpiar={handleLimpiar} tieneDatos={fichadas.length > 0} />

      <main className={`container mx-auto px-4 ${fichadas.length === 0 ? 'flex-1 flex flex-col justify-center py-2' : 'py-6'}`}>
        {fichadas.length > 0 && (
          <>
            <Dashboard estadisticas={estadisticas} />

            <div className="flex justify-between items-center mb-4">
              <ExportButtons fichadas={fichadasFiltradas} />
              <button
                onClick={() => setConfigModalOpen(true)}
                className="btn btn-outline gap-2"
              >
                <Settings size={20} />
                Configurar Turnos
              </button>
            </div>

            <Filtros filtros={filtros} onFiltrosChange={setFiltros} />

            <TablaFichadas fichadas={fichadasFiltradas} />
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
    </div>
  );
}

export default App;
