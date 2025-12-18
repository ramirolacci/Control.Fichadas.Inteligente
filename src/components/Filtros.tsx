import { Search, Filter } from 'lucide-react';
import { Filtros as FiltrosType } from '../types';

interface FiltrosProps {
  filtros: FiltrosType;
  onFiltrosChange: (filtros: FiltrosType) => void;
}

export const Filtros = ({ filtros, onFiltrosChange }: FiltrosProps) => {
  const handleChange = (campo: keyof FiltrosType, valor: string) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor,
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">
          <Filter />
          Filtros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Fecha Inicio</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filtros.fechaInicio}
              onChange={(e) => handleChange('fechaInicio', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Fecha Fin</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filtros.fechaFin}
              onChange={(e) => handleChange('fechaFin', e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Tipo de Novedad</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filtros.tipoNovedad}
              onChange={(e) => handleChange('tipoNovedad', e.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="normal">✅ Normal</option>
              <option value="tardanza">⚠️ Tardanza</option>
              <option value="ausente">❌ Ausente</option>
              <option value="enfermo">🏥 Enfermo</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Buscar Empleado</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o legajo..."
                className="input input-bordered w-full pr-10"
                value={filtros.busqueda}
                onChange={(e) => handleChange('busqueda', e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40" size={20} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
