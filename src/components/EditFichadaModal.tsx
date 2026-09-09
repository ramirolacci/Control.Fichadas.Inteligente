import { useState, useEffect } from 'react';
import { UserCheck, X, Check, Clock, FileText, AlertCircle } from 'lucide-react';
import { FichadaProcesada } from '../types';

interface EditFichadaModalProps {
  isOpen: boolean;
  onClose: () => void;
  fichada: FichadaProcesada | null;
  onGuardar: (fichadaActualizada: FichadaProcesada) => void;
}

export const EditFichadaModal = ({
  isOpen,
  onClose,
  fichada,
  onGuardar,
}: EditFichadaModalProps) => {
  const [ingresoMañana, setIngresoMañana] = useState('');
  const [egresoMañana, setEgresoMañana] = useState('');
  const [ingresoTarde, setIngresoTarde] = useState('');
  const [egresoTarde, setEgresoTarde] = useState('');
  const [novedadPreset, setNovedadPreset] = useState('Normal');
  const [novedadCustom, setNovedadCustom] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [justificado, setJustificado] = useState(false);

  useEffect(() => {
    if (fichada) {
      setIngresoMañana(fichada.ingresoMañana || '');
      setEgresoMañana(fichada.egresoMañana || '');
      setIngresoTarde(fichada.ingresoTarde || '');
      setEgresoTarde(fichada.egresoTarde || '');
      setObservaciones(fichada.observaciones || '');
      setJustificado(fichada.justificado || false);

      const nov = fichada.novedad || '';
      if (nov.includes('Normal')) setNovedadPreset('Normal');
      else if (nov.includes('tarde')) setNovedadPreset('Atraso Justificado');
      else if (nov.includes('AUSENTE')) setNovedadPreset('Ausente');
      else if (nov.includes('Licencia')) setNovedadPreset('Licencia Médica');
      else if (nov.includes('Vacaciones')) setNovedadPreset('Vacaciones');
      else {
        setNovedadPreset('Personalizado');
        setNovedadCustom(nov);
      }
    }
  }, [fichada, isOpen]);

  if (!isOpen || !fichada) return null;

  const handleGuardar = () => {
    let finalNovedad = fichada.novedad;
    let colorNovedad: 'success' | 'warning' | 'error' | 'info' = fichada.colorNovedad;

    switch (novedadPreset) {
      case 'Normal':
        finalNovedad = '✅ Normal';
        colorNovedad = 'success';
        break;
      case 'Atraso Justificado':
        finalNovedad = '⚠️ Atraso Justificado';
        colorNovedad = 'warning';
        break;
      case 'Licencia Médica':
        finalNovedad = '🏥 Licencia Médica';
        colorNovedad = 'info';
        break;
      case 'Vacaciones':
        finalNovedad = '🏖️ Vacaciones';
        colorNovedad = 'info';
        break;
      case 'Ausente':
        finalNovedad = '❌ AUSENTE';
        colorNovedad = 'error';
        break;
      case 'Personalizado':
        finalNovedad = novedadCustom.trim() || '✅ Normal';
        break;
    }

    const estaIncompleto =
      (ingresoMañana && !egresoMañana) ||
      (!ingresoMañana && egresoMañana) ||
      (ingresoTarde && !egresoTarde) ||
      (!ingresoTarde && egresoTarde);

    const fichadaActualizada: FichadaProcesada = {
      ...fichada,
      ingresoMañana: ingresoMañana.trim() || null,
      egresoMañana: egresoMañana.trim() || null,
      ingresoTarde: ingresoTarde.trim() || null,
      egresoTarde: egresoTarde.trim() || null,
      novedad: finalNovedad,
      colorNovedad,
      observaciones: observaciones.trim(),
      justificado,
      editadoManualmente: true,
      incompleto: Boolean(estaIncompleto),
    };

    onGuardar(fichadaActualizada);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card bg-base-100/95 border border-base-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-base-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-base-content flex items-center gap-2">
                <span>{fichada.nombre}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  {fichada.legajo}
                </span>
              </h3>
              <p className="text-xs text-base-content/60 flex items-center gap-1.5 mt-0.5">
                <Clock size={13} />
                <span>Fecha: <strong className="text-base-content">{fichada.fecha}</strong></span>
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

        {/* Body Form */}
        <div className="space-y-4 text-xs">
          {/* Turno Mañana */}
          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300/50 space-y-2">
            <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">
              Horarios Turno Mañana
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-base-content/70 block mb-1">Ingreso Mañana</label>
                <input
                  type="time"
                  value={ingresoMañana}
                  onChange={(e) => setIngresoMañana(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-base-100 border border-base-300 font-mono text-xs font-bold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-[11px] text-base-content/70 block mb-1">Egreso Mañana</label>
                <input
                  type="time"
                  value={egresoMañana}
                  onChange={(e) => setEgresoMañana(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-base-100 border border-base-300 font-mono text-xs font-bold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Turno Tarde */}
          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-300/50 space-y-2">
            <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">
              Horarios Turno Tarde
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-base-content/70 block mb-1">Ingreso Tarde</label>
                <input
                  type="time"
                  value={ingresoTarde}
                  onChange={(e) => setIngresoTarde(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-base-100 border border-base-300 font-mono text-xs font-bold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="text-[11px] text-base-content/70 block mb-1">Egreso Tarde</label>
                <input
                  type="time"
                  value={egresoTarde}
                  onChange={(e) => setEgresoTarde(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-base-100 border border-base-300 font-mono text-xs font-bold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Novedad / Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-base-content/70 block mb-1">
                Estado / Novedad
              </label>
              <select
                value={novedadPreset}
                onChange={(e) => setNovedadPreset(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs font-semibold text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="Normal">✅ Normal</option>
                <option value="Atraso Justificado">⚠️ Atraso Justificado</option>
                <option value="Licencia Médica">🏥 Licencia Médica</option>
                <option value="Vacaciones">🏖️ Vacaciones</option>
                <option value="Ausente">❌ Ausente</option>
                <option value="Personalizado">✏️ Personalizado...</option>
              </select>
            </div>

            {novedadPreset === 'Personalizado' && (
              <div>
                <label className="text-[11px] font-semibold text-base-content/70 block mb-1">
                  Texto Novedad
                </label>
                <input
                  type="text"
                  placeholder="Ej: Licencia por Matrimonio"
                  value={novedadCustom}
                  onChange={(e) => setNovedadCustom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-base-content/80">
                <input
                  type="checkbox"
                  checked={justificado}
                  onChange={(e) => setJustificado(e.target.checked)}
                  className="w-4 h-4 rounded border-base-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Marcar como Justificado</span>
              </label>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <label className="text-[11px] font-semibold text-base-content/70 block mb-1 flex items-center gap-1">
              <FileText size={13} />
              <span>Observaciones / Certificado</span>
            </label>
            <textarea
              rows={2}
              placeholder="Escribe un motivo u observación (ej: Presentó certificado médico N° 458)..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-xs text-base-content focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          {((ingresoMañana && !egresoMañana) ||
            (!ingresoMañana && egresoMañana) ||
            (ingresoTarde && !egresoTarde) ||
            (!ingresoTarde && egresoTarde)) && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-2 text-[11px]">
              <AlertCircle size={15} className="shrink-0" />
              <span>Advertencia: La fichada quedará registrada como <strong>Incompleta</strong>.</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-base-200/60 flex items-center justify-end gap-3">
          <button
            onClick={handleGuardar}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-950/40 active:scale-95 cursor-pointer"
          >
            <Check size={15} />
            <span>Guardar Cambios</span>
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
