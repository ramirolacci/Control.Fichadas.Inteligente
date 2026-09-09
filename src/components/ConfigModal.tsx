import { Settings, X, Info, Sun, Moon, Check, ShieldAlert } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConfigTurnos } from '../types';
import toast from 'react-hot-toast';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  turnos: ConfigTurnos;
  onGuardar: (turnos: ConfigTurnos) => void;
}

export const ConfigModal = ({ isOpen, onClose, turnos, onGuardar }: ConfigModalProps) => {
  const [turnosEdit, setTurnosEdit] = useState<ConfigTurnos>(turnos);

  useEffect(() => {
    setTurnosEdit({
      ...turnos,
      toleranciaMinutos: turnos.toleranciaMinutos ?? 15,
      jornadaDiariaHoras: turnos.jornadaDiariaHoras ?? 8,
    });
  }, [turnos, isOpen]);

  const handleChange = (turno: 'mañana' | 'tarde', campo: 'ingreso' | 'egreso', valor: string) => {
    setTurnosEdit({
      ...turnosEdit,
      [turno]: {
        ...turnosEdit[turno],
        [campo]: valor,
      },
    });
  };

  const handleGuardar = () => {
    if (!turnosEdit.mañana.ingreso || !turnosEdit.mañana.egreso ||
        !turnosEdit.tarde.ingreso || !turnosEdit.tarde.egreso) {
      toast.error('Todos los horarios son obligatorios');
      return;
    }

    onGuardar(turnosEdit);
    toast.success('Configuración guardada exitosamente');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-card bg-base-100/95 border border-base-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-base-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-base-content">
                Configuración de Turnos y Reglas
              </h3>
              <p className="text-xs text-base-content/60">
                Horarios normativos, tolerancias y cálculo de horas extras.
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

        {/* Turnos Form */}
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          {/* Turno Mañana */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
              <Sun size={15} />
              <span>Turno Mañana</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                  Hora de Ingreso
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                  value={turnosEdit.mañana.ingreso}
                  onChange={(e) => handleChange('mañana', 'ingreso', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                  Hora de Egreso
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                  value={turnosEdit.mañana.egreso}
                  onChange={(e) => handleChange('mañana', 'egreso', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Turno Tarde */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
              <Moon size={15} />
              <span>Turno Tarde</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                  Hora de Ingreso
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                  value={turnosEdit.tarde.ingreso}
                  onChange={(e) => handleChange('tarde', 'ingreso', e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                  Hora de Egreso
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                  value={turnosEdit.tarde.egreso}
                  onChange={(e) => handleChange('tarde', 'egreso', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Reglas de Asistencia & Horas Extras */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
              <ShieldAlert size={15} />
              <span>Tolerancia & Jornada Legal</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                  Tolerancia Tardanza (min)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                  value={turnosEdit.toleranciaMinutos ?? 15}
                  onChange={(e) =>
                    setTurnosEdit({
                      ...turnosEdit,
                      toleranciaMinutos: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-base-content/70 mb-1 block">
                  Jornada Legal Diaria (hs)
                </label>
                <input
                  type="number"
                  min="4"
                  max="12"
                  step="0.5"
                  className="w-full px-3 py-2 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                  value={turnosEdit.jornadaDiariaHoras ?? 8}
                  onChange={(e) =>
                    setTurnosEdit({
                      ...turnosEdit,
                      jornadaDiariaHoras: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-start gap-2.5 text-xs">
            <Info size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Cómputo Automático de Extras</p>
              <p className="text-base-content/70 text-[11px]">
                Exceso sobre la jornada diaria ({turnosEdit.jornadaDiariaHoras ?? 8}h) se calcula al <strong>50%</strong>. Domingos y feriados computan al <strong>100%</strong>. Horas entre 21:00 y 06:00 hs se marcan como <strong>Nocturnas</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
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
