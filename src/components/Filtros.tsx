import { Search, Filter, Calendar, Tag } from 'lucide-react';
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
    <div className="no-print glass-card rounded-2xl p-5 sm:p-6 mb-6 shadow-xl border border-base-200/60 transition-all">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-base-200/60">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
          <Filter size={16} />
        </div>
        <h3 className="font-bold text-sm tracking-tight text-base-content">
          Filtros & Búsqueda Avanzada
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fecha Inicio */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-base-content/80 mb-1.5 flex items-center gap-1.5">
            <Calendar size={13} className="text-indigo-500" />
            <span>Fecha Inicio</span>
          </label>
          <input
            type="date"
            className="w-full px-3.5 py-2.5 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
            value={filtros.fechaInicio}
            onChange={(e) => handleChange('fechaInicio', e.target.value)}
          />
        </div>

        {/* Fecha Fin */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-base-content/80 mb-1.5 flex items-center gap-1.5">
            <Calendar size={13} className="text-indigo-500" />
            <span>Fecha Fin</span>
          </label>
          <input
            type="date"
            className="w-full px-3.5 py-2.5 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
            value={filtros.fechaFin}
            onChange={(e) => handleChange('fechaFin', e.target.value)}
          />
        </div>

        {/* Tipo de Novedad */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-base-content/80 mb-1.5 flex items-center gap-1.5">
            <Tag size={13} className="text-indigo-500" />
            <span>Tipo de Novedad</span>
          </label>
          <select
            className="w-full px-3.5 py-2.5 rounded-xl bg-base-100 border border-base-300 text-base-content text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            value={filtros.tipoNovedad}
            onChange={(e) => handleChange('tipoNovedad', e.target.value)}
          >
            <option value="todas">Todas las Novedades</option>
            <option value="normal">✅ Normal</option>
            <option value="tardanza">⚠️ Tardanza</option>
            <option value="ausente">❌ Ausente</option>
            <option value="enfermo">🏥 Enfermo</option>
          </select>
        </div>

        {/* Buscar Empleado */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-base-content/80 mb-1.5 flex items-center gap-1.5">
            <Search size={13} className="text-indigo-500" />
            <span>Buscar Empleado</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Escribe nombre o legajo..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-base-100 border border-base-300 text-base-content placeholder-base-content/40 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
              value={filtros.busqueda}
              onChange={(e) => handleChange('busqueda', e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/70 pointer-events-none" size={15} />
          </div>
        </div>
      </div>
    </div>
  );
};
