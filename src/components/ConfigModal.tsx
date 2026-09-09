import { Settings, X, Info } from 'lucide-react';
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
    setTurnosEdit(turnos);
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
    <div className="modal modal-open backdrop-blur-sm bg-black/40">
      <div className="modal-box max-w-xl glass-card border border-base-200/60 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-200/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Settings size={20} />
            </div>
            <h3 className="font-extrabold text-lg tracking-tight text-base-content">
              Configuración de Turnos
            </h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-base-100/60 border border-base-200/60">
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-500 mb-3">Turno Mañana</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs text-base-content/70">Hora de Ingreso</span>
                </label>
                <input
                  type="time"
                  className="input input-sm input-bordered bg-base-100 rounded-xl focus:border-indigo-500 text-xs font-mono"
                  value={turnosEdit.mañana.ingreso}
                  onChange={(e) => handleChange('mañana', 'ingreso', e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs text-base-content/70">Hora de Egreso</span>
                </label>
                <input
                  type="time"
                  className="input input-sm input-bordered bg-base-100 rounded-xl focus:border-indigo-500 text-xs font-mono"
                  value={turnosEdit.mañana.egreso}
                  onChange={(e) => handleChange('mañana', 'egreso', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-base-100/60 border border-base-200/60">
            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-500 mb-3">Turno Tarde</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs text-base-content/70">Hora de Ingreso</span>
                </label>
                <input
                  type="time"
                  className="input input-sm input-bordered bg-base-100 rounded-xl focus:border-indigo-500 text-xs font-mono"
                  value={turnosEdit.tarde.ingreso}
                  onChange={(e) => handleChange('tarde', 'ingreso', e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs text-base-content/70">Hora de Egreso</span>
                </label>
                <input
                  type="time"
                  className="input input-sm input-bordered bg-base-100 rounded-xl focus:border-indigo-500 text-xs font-mono"
                  value={turnosEdit.tarde.egreso}
                  onChange={(e) => handleChange('tarde', 'egreso', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-start gap-2.5">
            <Info size={16} className="shrink-0 mt-0.5" />
            <div className="text-xs space-y-0.5">
              <p className="font-semibold">Información del Cómputo</p>
              <p className="text-base-content/70">Los cambios se aplicarán automáticamente a todas las fichadas procesadas. Tolerancia de tardanza: ±15 minutos.</p>
            </div>
          </div>
        </div>

        <div className="modal-action mt-6 pt-4 border-t border-base-200/60 flex items-center justify-end gap-2">
          <button onClick={onClose} className="btn btn-sm btn-ghost rounded-xl">
            Cancelar
          </button>
          <button onClick={handleGuardar} className="btn btn-sm btn-primary bg-indigo-600 hover:bg-indigo-700 border-none text-white rounded-xl shadow-md">
            Guardar Cambios
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};
