import { useState, useEffect } from 'react';
import { Sliders, X, Check, Table, Cpu, Info } from 'lucide-react';
import { ColumnMappingConfig } from '../types';

interface ColumnMapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  headers: string[];
  sampleRows: Record<string, any>[];
  fileName: string;
  onConfirm: (mapping: ColumnMappingConfig) => void;
}

export const ColumnMapperModal = ({
  isOpen,
  onClose,
  headers,
  sampleRows,
  fileName,
  onConfirm,
}: ColumnMapperModalProps) => {
  const [selectedMapping, setSelectedMapping] = useState<ColumnMappingConfig>({
    legajo: '',
    nombre: '',
    fecha: '',
    hora: '',
    tipo: '',
    turno: '',
  });

  const [selectedPreset, setSelectedPreset] = useState<string>('auto');

  useEffect(() => {
    if (headers && headers.length > 0) {
      // Auto-detect columns
      const autoLegajo = headers.find(h => /legajo|id|cod|code|user/i.test(h)) || headers[0] || '';
      const autoNombre = headers.find(h => /nombre|empleado|name|persona/i.test(h)) || headers[1] || '';
      const autoFecha = headers.find(h => /fecha|date/i.test(h)) || headers[2] || '';
      const autoHora = headers.find(h => /hora|time|marca/i.test(h)) || headers[3] || '';
      const autoTipo = headers.find(h => /tipo|event|movimiento|status/i.test(h)) || '';
      const autoTurno = headers.find(h => /turno|shift/i.test(h)) || '';

      setSelectedMapping({
        legajo: autoLegajo,
        nombre: autoNombre,
        fecha: autoFecha,
        hora: autoHora,
        tipo: autoTipo,
        turno: autoTurno,
      });
    }
  }, [headers, isOpen]);

  const handleApplyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);

    if (presetKey === 'zkteco') {
      setSelectedMapping({
        legajo: headers.find(h => /cod|id|legajo/i.test(h)) || headers[0] || '',
        nombre: headers.find(h => /nombre|name/i.test(h)) || headers[1] || '',
        fecha: headers.find(h => /fecha|date/i.test(h)) || headers[2] || '',
        hora: headers.find(h => /hora|time/i.test(h)) || headers[3] || '',
        tipo: headers.find(h => /estado|status|tipo/i.test(h)) || '',
      });
    } else if (presetKey === 'anviz') {
      setSelectedMapping({
        legajo: headers.find(h => /userid|id/i.test(h)) || headers[0] || '',
        nombre: headers.find(h => /name|nombre/i.test(h)) || headers[1] || '',
        fecha: headers.find(h => /datetime|date|fecha/i.test(h)) || headers[2] || '',
        hora: headers.find(h => /datetime|time|hora/i.test(h)) || headers[2] || '',
      });
    } else if (presetKey === 'auto') {
      const autoLegajo = headers.find(h => /legajo|id|cod|code|user/i.test(h)) || headers[0] || '';
      const autoNombre = headers.find(h => /nombre|empleado|name|persona/i.test(h)) || headers[1] || '';
      const autoFecha = headers.find(h => /fecha|date/i.test(h)) || headers[2] || '';
      const autoHora = headers.find(h => /hora|time|marca/i.test(h)) || headers[3] || '';

      setSelectedMapping({
        legajo: autoLegajo,
        nombre: autoNombre,
        fecha: autoFecha,
        hora: autoHora,
      });
    }
  };

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedMapping);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-card bg-base-100/95 border border-base-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-base-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Sliders size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-base-content flex items-center gap-2">
                <span>Asistente Mapeador de Columnas</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono">
                  {fileName}
                </span>
              </h3>
              <p className="text-xs text-base-content/60">
                Asocia los encabezados del archivo con los campos del sistema de asistencia.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-base-200/80 hover:bg-base-200 text-base-content/70 hover:text-base-content flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Presets Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 shrink-0 flex items-center gap-1">
            <Cpu size={13} />
            <span>Preset Reloj:</span>
          </span>
          <button
            onClick={() => handleApplyPreset('auto')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
              selectedPreset === 'auto'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-base-200/60 text-base-content/70 border-base-300/50 hover:bg-base-200'
            }`}
          >
            🎯 Auto-Detectar
          </button>
          <button
            onClick={() => handleApplyPreset('zkteco')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
              selectedPreset === 'zkteco'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-base-200/60 text-base-content/70 border-base-300/50 hover:bg-base-200'
            }`}
          >
            📟 ZK-Teco / Hikvision
          </button>
          <button
            onClick={() => handleApplyPreset('anviz')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border shrink-0 cursor-pointer ${
              selectedPreset === 'anviz'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-base-200/60 text-base-content/70 border-base-300/50 hover:bg-base-200'
            }`}
          >
            📟 Anviz / Dahua
          </button>
        </div>

        {/* Form Mapping Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Legajo */}
          <div>
            <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
              Columna <strong className="text-indigo-400">Legajo / ID</strong> *
            </label>
            <select
              value={selectedMapping.legajo}
              onChange={(e) => setSelectedMapping({ ...selectedMapping, legajo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">-- Seleccionar Columna --</option>
              {headers.map(h => (
                <option key={`legajo-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
              Columna <strong className="text-indigo-400">Nombre Empleado</strong> *
            </label>
            <select
              value={selectedMapping.nombre}
              onChange={(e) => setSelectedMapping({ ...selectedMapping, nombre: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">-- Seleccionar Columna --</option>
              {headers.map(h => (
                <option key={`nombre-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
              Columna <strong className="text-indigo-400">Fecha</strong> *
            </label>
            <select
              value={selectedMapping.fecha}
              onChange={(e) => setSelectedMapping({ ...selectedMapping, fecha: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">-- Seleccionar Columna --</option>
              {headers.map(h => (
                <option key={`fecha-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Hora */}
          <div>
            <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
              Columna <strong className="text-indigo-400">Hora</strong> *
            </label>
            <select
              value={selectedMapping.hora}
              onChange={(e) => setSelectedMapping({ ...selectedMapping, hora: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">-- Seleccionar Columna --</option>
              {headers.map(h => (
                <option key={`hora-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
              Columna <strong>Tipo (Entrada/Salida)</strong> (Opcional)
            </label>
            <select
              value={selectedMapping.tipo || ''}
              onChange={(e) => setSelectedMapping({ ...selectedMapping, tipo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">-- Ninguna (Determinar por horario) --</option>
              {headers.map(h => (
                <option key={`tipo-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Turno */}
          <div>
            <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
              Columna <strong>Turno (Mañana/Tarde)</strong> (Opcional)
            </label>
            <select
              value={selectedMapping.turno || ''}
              onChange={(e) => setSelectedMapping({ ...selectedMapping, turno: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="">-- Ninguna (Determinar por horario) --</option>
              {headers.map(h => (
                <option key={`turno-${h}`} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Sample Preview */}
        {sampleRows && sampleRows.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 flex items-center gap-1">
              <Table size={13} />
              <span>Previsualización de Primeras Filas (Vista Previa Raw)</span>
            </span>
            <div className="overflow-x-auto rounded-xl border border-base-300/50 bg-base-200/40 p-2 max-h-36">
              <table className="table table-xs w-full font-mono text-[10px]">
                <thead>
                  <tr className="text-base-content/70">
                    {headers.slice(0, 6).map(h => (
                      <th key={`th-${h}`} className="py-1 px-2">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleRows.slice(0, 3).map((row, idx) => (
                    <tr key={`sr-${idx}`}>
                      {headers.slice(0, 6).map(h => (
                        <td key={`td-${h}-${idx}`} className="py-1 px-2 text-base-content/80 truncate max-w-[100px]">
                          {String(row[h] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info notice */}
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center gap-2 text-xs">
          <Info size={15} className="shrink-0" />
          <span>El mapeador inteligente procesará automáticamente las filas según las columnas seleccionadas.</span>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-base-200/60 flex items-center justify-end gap-3">
          <button
            onClick={handleConfirm}
            disabled={!selectedMapping.legajo || !selectedMapping.nombre || !selectedMapping.fecha || !selectedMapping.hora}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-950/40 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Check size={15} />
            <span>Confirmar y Procesar</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content font-semibold text-xs transition-all shadow-sm cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
