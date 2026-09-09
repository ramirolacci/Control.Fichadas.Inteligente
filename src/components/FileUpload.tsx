import { Upload, FileSpreadsheet, Sparkles, ShieldCheck, FileCode, Clock, User, Calendar } from 'lucide-react';
import { useRef, useState } from 'react';
import { MAX_FILE_SIZE } from '../constants';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  progress: number;
}

export const FileUpload = ({ onFileSelect, loading, progress }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.csv', '.xls', '.xlsx'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(extension)) {
      toast.error('Formato no válido. Solo CSV, XLS o XLSX');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Archivo muy grande. Máximo 50MB');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-auto py-2 flex flex-col justify-center">
      {/* Hero Section */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 text-xs font-semibold tracking-wide mb-1">
          <Sparkles size={13} />
          <span>Gestión Automática de Asistencia</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
          Procesamiento Inteligente de Fichadas
        </h2>
        <p className="text-sm sm:text-base text-base-content/70 max-w-2xl mx-auto font-normal">
          Importa la planilla de marcaciones en formato CSV o Excel para liquidar horas y novedades en segundos.
        </p>
      </div>

      {/* Main Dropzone Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-base-200/60 relative overflow-hidden transition-all">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 group ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-base-300/80 hover:border-indigo-500/60 hover:bg-base-200/50'
          } ${loading ? 'pointer-events-none opacity-60' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
            disabled={loading}
          />

          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
            <Upload className="text-indigo-500 group-hover:text-indigo-600 transition-colors" size={28} />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-base-content mb-1.5">
            {loading ? 'Procesando archivo...' : 'Arrastra tu archivo aquí'}
          </h3>
          <p className="text-xs sm:text-sm text-base-content/60 mb-4">
            o haz clic para explorar en tu computadora
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="badge badge-outline border-base-300 font-mono text-xs px-2.5 py-1.5">.CSV</span>
            <span className="badge badge-outline border-base-300 font-mono text-xs px-2.5 py-1.5">.XLS</span>
            <span className="badge badge-outline border-base-300 font-mono text-xs px-2.5 py-1.5">.XLSX</span>
            <span className="text-xs text-base-content/40 ml-1">(Hasta 50MB)</span>
          </div>
        </div>

        {/* Loading Progress */}
        {loading && (
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-base-content/70">
              <span>Analizando fichadas y turnos...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <progress
              className="progress progress-primary w-full h-2 rounded-full"
              value={progress}
              max="100"
            ></progress>
          </div>
        )}
      </div>

      {/* Expected Format Cards */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-2.5 px-1 flex items-center gap-1.5">
          <FileCode size={14} />
          Estructura Recomendada del Archivo
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-base-100/60 border border-base-200/60 shadow-sm flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 shrink-0">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate">Legajo & Nombre</p>
              <p className="text-[11px] text-base-content/50 truncate">Cod. y Nombre</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-base-100/60 border border-base-200/60 shadow-sm flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
              <Calendar size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate">Fecha</p>
              <p className="text-[11px] text-base-content/50 truncate">YYYY-MM-DD / DD/MM/YYYY</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-base-100/60 border border-base-200/60 shadow-sm flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
              <Clock size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate">Hora</p>
              <p className="text-[11px] text-base-content/50 truncate">Formato HH:MM</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-base-100/60 border border-base-200/60 shadow-sm flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-500 shrink-0">
              <FileSpreadsheet size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-base-content truncate">Tipo / Turno</p>
              <p className="text-[11px] text-base-content/50 truncate">Entrada/Salida (opcional)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-xs text-base-content/40">
        <ShieldCheck size={15} className="text-emerald-500/80 shrink-0" />
        <span>Procesamiento 100% privado en tu navegador. Los archivos no se suben a servidores externos.</span>
      </div>
    </div>
  );
};
