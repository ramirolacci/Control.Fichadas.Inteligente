import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, XCircle, Stethoscope } from 'lucide-react';
import { FichadaProcesada } from '../types';
import { REGISTROS_POR_PAGINA } from '../constants';

interface TablaFichadasProps {
  fichadas: FichadaProcesada[];
}

type SortField = 'empleado' | 'fecha' | 'novedad';
type SortOrder = 'asc' | 'desc';

export const TablaFichadas = ({ fichadas }: TablaFichadasProps) => {
  const [sortField, setSortField] = useState<SortField>('fecha');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [paginaActual, setPaginaActual] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const fichadasOrdenadas = useMemo(() => {
    const sorted = [...fichadas].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case 'empleado':
          compareValue = String(a.nombre || '').localeCompare(String(b.nombre || ''));
          break;
        case 'fecha':
          compareValue = String(a.fecha || '').localeCompare(String(b.fecha || ''));
          break;
        case 'novedad':
          compareValue = String(a.novedad || '').localeCompare(String(b.novedad || ''));
          break;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  }, [fichadas, sortField, sortOrder]);

  const totalPaginas = Math.ceil(fichadasOrdenadas.length / REGISTROS_POR_PAGINA);
  const fichadasPaginadas = fichadasOrdenadas.slice(
    (paginaActual - 1) * REGISTROS_POR_PAGINA,
    paginaActual * REGISTROS_POR_PAGINA
  );

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const renderBadgeNovedad = (fichada: FichadaProcesada) => {
    const novLower = fichada.novedad.toLowerCase();
    
    if (novLower.includes('normal') || novLower.includes('ok')) {
      return (
        <span className="badge badge-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 gap-1 font-semibold px-2.5 py-1">
          <CheckCircle2 size={12} />
          {fichada.novedad}
        </span>
      );
    }
    if (novLower.includes('tarde') || novLower.includes('tardanza')) {
      return (
        <span className="badge badge-sm bg-amber-500/10 text-amber-500 border border-amber-500/20 gap-1 font-semibold px-2.5 py-1">
          <AlertTriangle size={12} />
          {fichada.novedad}
        </span>
      );
    }
    if (novLower.includes('ausente')) {
      return (
        <span className="badge badge-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 gap-1 font-semibold px-2.5 py-1">
          <XCircle size={12} />
          {fichada.novedad}
        </span>
      );
    }
    return (
      <span className="badge badge-sm bg-sky-500/10 text-sky-500 border border-sky-500/20 gap-1 font-semibold px-2.5 py-1">
        <Stethoscope size={12} />
        {fichada.novedad}
      </span>
    );
  };

  if (fichadas.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-2xl shadow-xl overflow-hidden border border-base-200/60 transition-all">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-xs">
          <thead className="bg-base-200/80 backdrop-blur-md sticky top-0 z-10 border-b border-base-300/60">
            <tr className="text-base-content/70">
              <th
                className="cursor-pointer hover:bg-base-300/50 transition-colors py-3.5"
                onClick={() => handleSort('empleado')}
              >
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Empleado
                  <SortIcon field="empleado" />
                </div>
              </th>
              <th
                className="cursor-pointer hover:bg-base-300/50 transition-colors py-3.5"
                onClick={() => handleSort('fecha')}
              >
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Fecha
                  <SortIcon field="fecha" />
                </div>
              </th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Ingreso Mañana</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Egreso Mañana</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Total Mañana</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Ingreso Tarde</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Egreso Tarde</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Total Tarde</th>
              <th
                className="cursor-pointer hover:bg-base-300/50 transition-colors py-3.5"
                onClick={() => handleSort('novedad')}
              >
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                  Novedad
                  <SortIcon field="novedad" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/50">
            {fichadasPaginadas.map((fichada, index) => (
              <tr key={`${fichada.legajo}-${fichada.fecha}-${index}`} className="hover:bg-indigo-500/5 transition-colors">
                <td className="py-3">
                  <div>
                    <div className="font-bold text-base-content text-xs">{fichada.nombre}</div>
                    <span className="font-mono text-[10px] text-base-content/50 bg-base-200/80 px-1.5 py-0.5 rounded">
                      Cod: {fichada.legajo}
                    </span>
                  </div>
                </td>
                <td className="font-mono text-xs text-base-content/80">{fichada.fecha}</td>
                <td className="font-mono text-xs">{fichada.ingresoMañana || '-'}</td>
                <td className="font-mono text-xs">{fichada.egresoMañana || '-'}</td>
                <td className="font-semibold font-mono text-xs text-indigo-500">{fichada.totalMañana}</td>
                <td className="font-mono text-xs">{fichada.ingresoTarde || '-'}</td>
                <td className="font-mono text-xs">{fichada.egresoTarde || '-'}</td>
                <td className="font-semibold font-mono text-xs text-indigo-500">{fichada.totalTarde}</td>
                <td>{renderBadgeNovedad(fichada)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between p-4 bg-base-100/40 border-t border-base-200/60">
          <span className="text-xs text-base-content/50">
            Mostrando {fichadasPaginadas.length} de {fichadasOrdenadas.length} registros
          </span>

          <div className="join">
            <button
              className="join-item btn btn-xs btn-ghost border border-base-300"
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
            >
              «
            </button>
            <button className="join-item btn btn-xs btn-ghost border border-base-300 font-mono text-xs">
              Página {paginaActual} de {totalPaginas}
            </button>
            <button
              className="join-item btn btn-xs btn-ghost border border-base-300"
              onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
              disabled={paginaActual === totalPaginas}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
