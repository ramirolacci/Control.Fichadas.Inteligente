import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
    return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'error':
        return 'badge-error';
      case 'info':
        return 'badge-info';
      default:
        return '';
    }
  };

  if (fichadas.length === 0) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="table table-zebra table-pin-rows">
            <thead className="bg-base-200 sticky top-0 z-10">
              <tr>
                <th
                  className="cursor-pointer hover:bg-base-300"
                  onClick={() => handleSort('empleado')}
                >
                  <div className="flex items-center gap-2">
                    Empleado
                    <SortIcon field="empleado" />
                  </div>
                </th>
                <th
                  className="cursor-pointer hover:bg-base-300"
                  onClick={() => handleSort('fecha')}
                >
                  <div className="flex items-center gap-2">
                    Fecha
                    <SortIcon field="fecha" />
                  </div>
                </th>
                <th>Ingreso Mañana</th>
                <th>Egreso Mañana</th>
                <th>Total Mañana</th>
                <th>Ingreso Tarde</th>
                <th>Egreso Tarde</th>
                <th>Total Tarde</th>
                <th
                  className="cursor-pointer hover:bg-base-300"
                  onClick={() => handleSort('novedad')}
                >
                  <div className="flex items-center gap-2">
                    Novedad
                    <SortIcon field="novedad" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {fichadasPaginadas.map((fichada, index) => (
                <tr key={`${fichada.legajo}-${fichada.fecha}-${index}`} className="hover">
                  <td>
                    <div>
                      <div className="font-semibold">{fichada.nombre}</div>
                      <div className="text-sm opacity-50">Cod: {fichada.legajo}</div>
                    </div>
                  </td>
                  <td>{fichada.fecha}</td>
                  <td>{fichada.ingresoMañana || '-'}</td>
                  <td>{fichada.egresoMañana || '-'}</td>
                  <td className="font-semibold">{fichada.totalMañana}</td>
                  <td>{fichada.ingresoTarde || '-'}</td>
                  <td>{fichada.egresoTarde || '-'}</td>
                  <td className="font-semibold">{fichada.totalTarde}</td>
                  <td>
                    <span className={`badge ${getColorClass(fichada.colorNovedad)}`}>
                      {fichada.novedad}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 p-4">
            <div className="join">
              <button
                className="join-item btn btn-sm"
                onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                disabled={paginaActual === 1}
              >
                «
              </button>
              <button className="join-item btn btn-sm">
                Página {paginaActual} de {totalPaginas}
              </button>
              <button
                className="join-item btn btn-sm"
                onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                disabled={paginaActual === totalPaginas}
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
