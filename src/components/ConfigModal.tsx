import { Settings, X } from 'lucide-react';
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
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Settings />
            Configuración de Turnos
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-md">Turno Mañana</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hora de Ingreso</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered"
                    value={turnosEdit.mañana.ingreso}
                    onChange={(e) => handleChange('mañana', 'ingreso', e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hora de Egreso</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered"
                    value={turnosEdit.mañana.egreso}
                    onChange={(e) => handleChange('mañana', 'egreso', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h4 className="card-title text-md">Turno Tarde</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hora de Ingreso</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered"
                    value={turnosEdit.tarde.ingreso}
                    onChange={(e) => handleChange('tarde', 'ingreso', e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Hora de Egreso</span>
                  </label>
                  <input
                    type="time"
                    className="input input-bordered"
                    value={turnosEdit.tarde.egreso}
                    onChange={(e) => handleChange('tarde', 'egreso', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info">
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
              <p>Los cambios se aplicarán a todos los registros procesados.</p>
              <p>Tolerancia de tardanza: ±15 minutos</p>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button onClick={handleGuardar} className="btn btn-primary">
            Guardar Cambios
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};
