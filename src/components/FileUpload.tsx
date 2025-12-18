import { Upload, FileSpreadsheet } from 'lucide-react';
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
      toast.error('Formato no válido. Solo CSV, XLS, XLSX');
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
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">
          <FileSpreadsheet />
          Cargar Archivo de Fichadas
        </h2>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-base-300 hover:border-primary hover:bg-base-200'
          } ${loading ? 'pointer-events-none opacity-50' : ''}`}
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

          <Upload className="mx-auto mb-4 text-primary" size={48} />

          <p className="text-lg font-semibold mb-2">
            {loading ? 'Procesando archivo...' : 'Arrastra tu archivo aquí'}
          </p>
          <p className="text-sm text-base-content/60 mb-4">
            o haz click para seleccionar
          </p>
          <p className="text-xs text-base-content/40">
            Formatos: CSV, XLS, XLSX (máx. 50MB)
          </p>
        </div>

        {loading && progress > 0 && (
          <div className="mt-4">
            <progress
              className="progress progress-primary w-full"
              value={progress}
              max="100"
            ></progress>
            <p className="text-center text-sm mt-2">{Math.round(progress)}%</p>
          </div>
        )}

        <div className="alert alert-info mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div className="text-sm">
            <p className="font-semibold">Estructura esperada del archivo:</p>
            <p>legajo, nombre, fecha (YYYY-MM-DD), hora (HH:MM), tipo (entrada/salida), turno (opcional)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
