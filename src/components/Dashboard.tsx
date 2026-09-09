import { Users, UserCheck, Clock, AlertTriangle, Zap, Moon } from 'lucide-react';
import { EstadisticasDiarias } from '../types';

interface DashboardProps {
  estadisticas: EstadisticasDiarias;
}

export const Dashboard = ({ estadisticas }: DashboardProps) => {
  return (
    <div className="no-print space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Empleados */}
        <div className="glass-card p-5 rounded-2xl border border-base-200/60 shadow-xl flex items-center justify-between transition-all duration-300 hover:scale-[1.01]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-1">
              Total Empleados
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
              {estadisticas.totalEmpleados}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
        </div>

        {/* Presentes */}
        <div className="glass-card p-5 rounded-2xl border border-base-200/60 shadow-xl flex items-center justify-between transition-all duration-300 hover:scale-[1.01]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-1">
              Presentes
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500 tracking-tight">
              {estadisticas.presentes}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <UserCheck size={24} />
          </div>
        </div>

        {/* Tardanzas */}
        <div className="glass-card p-5 rounded-2xl border border-base-200/60 shadow-xl flex items-center justify-between transition-all duration-300 hover:scale-[1.01]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-1">
              Tardanzas
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 tracking-tight">
              {estadisticas.tardanzas}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
        </div>

        {/* Total Horas */}
        <div className="glass-card p-5 rounded-2xl border border-base-200/60 shadow-xl flex items-center justify-between transition-all duration-300 hover:scale-[1.01]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-1">
              Total Horas
            </p>
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-500 tracking-tight">
              {estadisticas.totalHoras.toFixed(1)}h
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Summary Chips for Extras & Night Hours */}
      {((estadisticas.totalHorasExtras50 || 0) > 0 ||
        (estadisticas.totalHorasExtras100 || 0) > 0 ||
        (estadisticas.totalHorasNocturnas || 0) > 0) && (
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {(estadisticas.totalHorasExtras50 || 0) > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Zap size={14} className="text-violet-400" />
              <span>Horas Extras 50%: <strong>{(estadisticas.totalHorasExtras50 || 0).toFixed(1)}h</strong></span>
            </div>
          )}
          {(estadisticas.totalHorasExtras100 || 0) > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Zap size={14} className="text-purple-400" />
              <span>Horas Extras 100%: <strong>{(estadisticas.totalHorasExtras100 || 0).toFixed(1)}h</strong></span>
            </div>
          )}
          {(estadisticas.totalHorasNocturnas || 0) > 0 && (
            <div className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <Moon size={14} className="text-indigo-400" />
              <span>Horas Nocturnas: <strong>{(estadisticas.totalHorasNocturnas || 0).toFixed(1)}h</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
