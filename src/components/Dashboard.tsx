import { Users, UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { EstadisticasDiarias } from '../types';

interface DashboardProps {
  estadisticas: EstadisticasDiarias;
}

export const Dashboard = ({ estadisticas }: DashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <Users size={32} />
          </div>
          <div className="stat-title">Total Empleados</div>
          <div className="stat-value text-primary">{estadisticas.totalEmpleados}</div>
        </div>
      </div>

      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-figure text-success">
            <UserCheck size={32} />
          </div>
          <div className="stat-title">Presentes</div>
          <div className="stat-value text-success">{estadisticas.presentes}</div>
        </div>
      </div>

      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-figure text-warning">
            <AlertTriangle size={32} />
          </div>
          <div className="stat-title">Tardanzas</div>
          <div className="stat-value text-warning">{estadisticas.tardanzas}</div>
        </div>
      </div>

      <div className="stats shadow bg-base-100">
        <div className="stat">
          <div className="stat-figure text-info">
            <Clock size={32} />
          </div>
          <div className="stat-title">Total Horas</div>
          <div className="stat-value text-info">{estadisticas.totalHoras.toFixed(0)}h</div>
        </div>
      </div>
    </div>
  );
};
