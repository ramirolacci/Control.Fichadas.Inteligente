import { Users, UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { EstadisticasDiarias } from '../types';

interface DashboardProps {
  estadisticas: EstadisticasDiarias;
}

export const Dashboard = ({ estadisticas }: DashboardProps) => {
  return (
    <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            {estadisticas.totalHoras.toFixed(0)}h
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center shrink-0">
          <Clock size={24} />
        </div>
      </div>
    </div>
  );
};
