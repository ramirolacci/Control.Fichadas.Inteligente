import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, CheckCircle2, AlertTriangle, XCircle, Stethoscope } from 'lucide-react';
import { FichadaProcesada } from '../types';
import { REGISTROS_POR_PAGINA } from '../constants';

interface TablaFichadasProps {
  fichadas: FichadaProcesada[];
  onEditFichada?: (fichada: FichadaProcesada) => void;
  onVerFicha?: (legajo: string, nombre: string) => void;
}

type SortField = 'empleado' | 'fecha' | 'novedad';
type SortOrder = 'asc' | 'desc';

const formatFechaDisplay = (fechaStr: string): string => {
  if (!fechaStr) return '';
  const str = String(fechaStr).trim();

  // If already DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return str;
  }

  // If YYYY-MM-DD -> DD/MM/YYYY
  const matchISO = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (matchISO) {
    const [, yr, mo, da] = matchISO;
    return `${da}/${mo}/${yr}`;
  }

  // If Excel serial number
  const num = Number(str);
  if (!isNaN(num) && num > 10000 && num < 100000) {
    const dateObj = new Date((num - 25569) * 86400 * 1000);
    const yr = dateObj.getUTCFullYear();
    const mo = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const da = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${da}/${mo}/${yr}`;
  }

  return str;
};

export const TablaFichadas = ({ fichadas, onEditFichada, onVerFicha }: TablaFichadasProps) => {
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
          <CheckCircle2 size={12} className="no-print" />
          {fichada.novedad}
        </span>
      );
    }
    if (novLower.includes('tarde') || novLower.includes('tardanza')) {
      return (
        <span className="badge badge-sm bg-amber-500/10 text-amber-500 border border-amber-500/20 gap-1 font-semibold px-2.5 py-1">
          <AlertTriangle size={12} className="no-print" />
          {fichada.novedad}
        </span>
      );
    }
    if (novLower.includes('ausente')) {
      return (
        <span className="badge badge-sm bg-rose-500/10 text-rose-500 border border-rose-500/20 gap-1 font-semibold px-2.5 py-1">
          <XCircle size={12} className="no-print" />
          {fichada.novedad}
        </span>
      );
    }
    return (
      <span className="badge badge-sm bg-sky-500/10 text-sky-500 border border-sky-500/20 gap-1 font-semibold px-2.5 py-1">
        <Stethoscope size={12} className="no-print" />
        {fichada.novedad}
      </span>
    );
  };

  if (fichadas.length === 0) {
    return null;
  }

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="glass-card print-table-card rounded-2xl shadow-xl overflow-hidden border border-base-200/60 transition-all">
      {/* Print-Only Header Banner */}
      <div className="print-header-banner print-only">
        <div className="flex justify-between items-end pb-2">
          <div>
            <h1 className="text-base font-bold text-black uppercase tracking-wider">
              Control de Fichadas - Reporte de Asistencia
            </h1>
            <p className="text-xs text-slate-600 font-mono">
              Fecha de Emisión: {fechaHoy}
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 font-mono">
            Total de Registros: {fichadasOrdenadas.length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-xs">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>

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
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Ing. Mañana</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Egr. Mañana</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Total Mañana</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Ing. Tarde</th>
              <th className="font-bold uppercase tracking-wider text-[11px] py-3.5">Egr. Tarde</th>
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

          {/* Screen-Only Paginated Body */}
          <tbody className="divide-y divide-base-200/50 screen-only">
            {fichadasPaginadas.map((fichada, index) => (
              <tr
                key={`screen-${fichada.legajo}-${fichada.fecha}-${index}`}
                onClick={() => onEditFichada && onEditFichada(fichada)}
                className="hover:bg-indigo-500/10 cursor-pointer transition-colors group"
                title="Haz clic para editar esta fichada u agregar observaciones"
              >
                <td className="py-3">
                  <div>
                    <div className="font-bold text-base-content text-xs group-hover:text-indigo-400 transition-colors flex items-center justify-between gap-1.5 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span>{fichada.nombre}</span>
                        {fichada.editadoManualmente && (
                          <span className="text-[10px] text-indigo-400 font-semibold" title="Editado manualmente">✍️</span>
                        )}
                      </div>
                      {onVerFicha && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onVerFicha(fichada.legajo, fichada.nombre);
                          }}
                          className="no-print opacity-0 group-hover:opacity-100 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[10px] font-semibold transition-all"
                          title="Ver e imprimir Ficha Individual de Conformidad"
                        >
                          📄 Ficha
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-base-content/50 bg-base-200/80 px-1.5 py-0.5 rounded">
                        Cod: {fichada.legajo}
                      </span>
                      {fichada.observaciones && (
                        <span className="text-[10px] text-amber-400 font-medium truncate max-w-[120px]" title={fichada.observaciones}>
                          💬 {fichada.observaciones}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="font-mono text-xs text-base-content/80">{formatFechaDisplay(fichada.fecha)}</td>
                <td className="font-mono text-xs">{fichada.ingresoMañana || '-'}</td>
                <td className="font-mono text-xs">{fichada.egresoMañana || '-'}</td>
                <td className="font-semibold font-mono text-xs text-indigo-500">{fichada.totalMañana}</td>
                <td className="font-mono text-xs">{fichada.ingresoTarde || '-'}</td>
                <td className="font-mono text-xs">{fichada.egresoTarde || '-'}</td>
                <td className="font-semibold font-mono text-xs text-indigo-500">{fichada.totalTarde}</td>
                <td>
                  <div className="flex flex-wrap items-center gap-1">
                    {renderBadgeNovedad(fichada)}
                    {fichada.incompleto && (
                      <span className="badge badge-sm bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]" title="Fichada incompleta">
                        Incompleta
                      </span>
                    )}
                    {(fichada.horasExtras50 || 0) > 0 && (
                      <span className="badge badge-sm bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[10px] font-bold" title="Horas Extras al 50%">
                        +{fichada.horasExtras50}h (50%)
                      </span>
                    )}
                    {(fichada.horasExtras100 || 0) > 0 && (
                      <span className="badge badge-sm bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold" title="Horas Extras al 100%">
                        +{fichada.horasExtras100}h (100%)
                      </span>
                    )}
                    {(fichada.horasNocturnas || 0) > 0 && (
                      <span className="badge badge-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px]" title="Horas Nocturnas">
                        🌙 {fichada.horasNocturnas}h
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Print-Only Body (All Records) */}
          <tbody className="divide-y divide-slate-300 print-only">
            {fichadasOrdenadas.map((fichada, index) => (
              <tr key={`print-${fichada.legajo}-${fichada.fecha}-${index}`}>
                <td>
                  <div className="font-bold text-black text-xs">{fichada.nombre}</div>
                  <div className="text-[10px] text-slate-600 font-mono">Cod: {fichada.legajo}</div>
                </td>
                <td className="font-mono text-xs">{formatFechaDisplay(fichada.fecha)}</td>
                <td className="font-mono text-xs">{fichada.ingresoMañana || '-'}</td>
                <td className="font-mono text-xs">{fichada.egresoMañana || '-'}</td>
                <td className="font-semibold font-mono text-xs">{fichada.totalMañana}</td>
                <td className="font-mono text-xs">{fichada.ingresoTarde || '-'}</td>
                <td className="font-mono text-xs">{fichada.egresoTarde || '-'}</td>
                <td className="font-semibold font-mono text-xs">{fichada.totalTarde}</td>
                <td>{renderBadgeNovedad(fichada)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between p-4 bg-base-100/40 border-t border-base-200/60 screen-only">
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
