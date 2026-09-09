import { useRef } from 'react';
import { UserCheck, X, Printer } from 'lucide-react';
import { FichadaProcesada } from '../types';

interface FichaEmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  fichadasEmpleado: FichadaProcesada[];
  legajo: string;
  nombre: string;
}

export const FichaEmpleadoModal = ({
  isOpen,
  onClose,
  fichadasEmpleado,
  legajo,
  nombre,
}: FichaEmpleadoModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !fichadasEmpleado || fichadasEmpleado.length === 0) return null;

  const totalHorasNorm = fichadasEmpleado.reduce((acc, f) => acc + (f.horasNormales || 0), 0);
  const totalHorasEx50 = fichadasEmpleado.reduce((acc, f) => acc + (f.horasExtras50 || 0), 0);
  const totalHorasEx100 = fichadasEmpleado.reduce((acc, f) => acc + (f.horasExtras100 || 0), 0);
  const totalHorasNoct = fichadasEmpleado.reduce((acc, f) => acc + (f.horasNocturnas || 0), 0);

  const diasTrabajados = fichadasEmpleado.filter(f => !f.novedad.includes('AUSENTE')).length;
  const tardanzasCount = fichadasEmpleado.filter(f => f.novedad.includes('tarde')).length;
  const ausentesCount = fichadasEmpleado.filter(f => f.novedad.includes('AUSENTE')).length;

  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handlePrintIndividual = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all overflow-y-auto">
      <div className="absolute inset-0 no-print" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative w-full max-w-3xl glass-card bg-base-100/95 border border-base-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 my-auto print-ficha-container"
      >
        {/* Header (Screen only action bar) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-base-200/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <UserCheck size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-base-content">
                Ficha Individual de Asistencia y Liquidación
              </h3>
              <p className="text-xs text-base-content/60">
                Resumen de jornadas, horas normales, extras y tardanzas para firma de conformidad.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintIndividual}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Printer size={15} />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-base-200 hover:bg-base-300 text-base-content flex items-center justify-center transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* PRINTABLE SLIP CONTENT */}
        <div className="space-y-6 text-base-content">
          {/* Slip Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-300">
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-indigo-500 print:text-black">
                CONTROL DE FICHADAS & ASISTENCIA
              </h1>
              <p className="text-xs font-semibold text-base-content/60 print:text-slate-600">
                PLANILLA INDIVIDUAL DE CONFORMIDAD DE HORAS
              </p>
            </div>
            <div className="text-right text-xs font-mono text-base-content/70 print:text-slate-600">
              <p>Fecha Emisión: <strong>{fechaHoy}</strong></p>
              <p>Total Registros: <strong>{fichadasEmpleado.length} días</strong></p>
            </div>
          </div>

          {/* Employee & Company Info Grid */}
          <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs print:bg-slate-100 print:border-slate-300">
            <div>
              <span className="text-[11px] font-bold uppercase text-base-content/50 print:text-slate-500 block">
                Empleado
              </span>
              <span className="font-extrabold text-sm text-base-content print:text-black block truncate">
                {nombre}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-base-content/50 print:text-slate-500 block">
                Legajo / Código
              </span>
              <span className="font-mono font-bold text-sm text-indigo-500 print:text-black block">
                {legajo}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-base-content/50 print:text-slate-500 block">
                Días Trab. / Presencia
              </span>
              <span className="font-mono font-bold text-sm text-emerald-500 print:text-black block">
                {diasTrabajados} días
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-base-content/50 print:text-slate-500 block">
                Novedades / Tardanzas
              </span>
              <span className="font-mono font-bold text-sm text-amber-500 print:text-black block">
                {tardanzasCount} tardanzas | {ausentesCount} aus.
              </span>
            </div>
          </div>

          {/* Total KPI Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center print:bg-slate-50 print:border-slate-300">
              <span className="text-[10px] uppercase font-bold text-indigo-400 print:text-slate-600 block">Horas Normales</span>
              <span className="text-lg font-black text-indigo-500 print:text-black font-mono">{totalHorasNorm.toFixed(1)}h</span>
            </div>

            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center print:bg-slate-50 print:border-slate-300">
              <span className="text-[10px] uppercase font-bold text-violet-400 print:text-slate-600 block">Extras 50%</span>
              <span className="text-lg font-black text-violet-400 print:text-black font-mono">+{totalHorasEx50.toFixed(1)}h</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center print:bg-slate-50 print:border-slate-300">
              <span className="text-[10px] uppercase font-bold text-purple-400 print:text-slate-600 block">Extras 100%</span>
              <span className="text-lg font-black text-purple-400 print:text-black font-mono">+{totalHorasEx100.toFixed(1)}h</span>
            </div>

            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-center print:bg-slate-50 print:border-slate-300">
              <span className="text-[10px] uppercase font-bold text-sky-400 print:text-slate-600 block">Nocturnas</span>
              <span className="text-lg font-black text-sky-400 print:text-black font-mono">🌙 {totalHorasNoct.toFixed(1)}h</span>
            </div>
          </div>

          {/* Detail Table */}
          <div className="overflow-hidden rounded-xl border border-base-300/60 print:border-slate-300">
            <table className="w-full text-[11px] font-mono text-left">
              <thead className="bg-base-200/80 print:bg-slate-200 text-base-content/70 print:text-black font-bold uppercase">
                <tr>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Ing. Mañana</th>
                  <th className="p-2">Egr. Mañana</th>
                  <th className="p-2">Ing. Tarde</th>
                  <th className="p-2">Egr. Tarde</th>
                  <th className="p-2 text-right">Extras</th>
                  <th className="p-2">Novedad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200/60 print:divide-slate-300">
                {fichadasEmpleado.map((f, idx) => (
                  <tr key={`ficha-row-${idx}`} className="hover:bg-base-200/30">
                    <td className="p-2 font-bold">{f.fecha}</td>
                    <td className="p-2">{f.ingresoMañana || '-'}</td>
                    <td className="p-2">{f.egresoMañana || '-'}</td>
                    <td className="p-2">{f.ingresoTarde || '-'}</td>
                    <td className="p-2">{f.egresoTarde || '-'}</td>
                    <td className="p-2 text-right font-bold text-indigo-400 print:text-black">
                      {(f.horasExtras50 || 0) > 0 ? `+${f.horasExtras50}h(50%)` : ''}
                      {(f.horasExtras100 || 0) > 0 ? ` +${f.horasExtras100}h(100%)` : ''}
                      {!(f.horasExtras50 || 0) && !(f.horasExtras100 || 0) ? '-' : ''}
                    </td>
                    <td className="p-2">{f.novedad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures Area for PDF/Print */}
          <div className="pt-8 grid grid-cols-2 gap-12 text-center text-xs print:pt-12">
            <div className="space-y-1">
              <div className="border-b border-base-content/30 print:border-black w-3/4 mx-auto pb-1 min-h-[30px]" />
              <p className="font-bold text-base-content print:text-black">Firma del Empleado</p>
              <p className="text-[10px] text-base-content/50 print:text-slate-500">Conformidad de horas computadas</p>
            </div>

            <div className="space-y-1">
              <div className="border-b border-base-content/30 print:border-black w-3/4 mx-auto pb-1 min-h-[30px]" />
              <p className="font-bold text-base-content print:text-black">Firma Resp. Recursos Humanos</p>
              <p className="text-[10px] text-base-content/50 print:text-slate-500">Aprobación y Liquidación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
