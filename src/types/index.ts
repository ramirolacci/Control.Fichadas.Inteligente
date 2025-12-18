export interface FichadaRaw {
  legajo: string;
  nombre: string;
  fecha: string;
  hora: string;
  tipo: 'entrada' | 'salida';
  turno?: 'mañana' | 'tarde';
}

export interface FichadaProcesada {
  legajo: string;
  nombre: string;
  fecha: string;
  ingresoMañana: string | null;
  egresoMañana: string | null;
  totalMañana: string;
  ingresoTarde: string | null;
  egresoTarde: string | null;
  totalTarde: string;
  novedad: string;
  motivoNovedad?: string;
  colorNovedad: 'success' | 'warning' | 'error' | 'info';
}

export interface Turno {
  ingreso: string;
  egreso: string;
}

export interface ConfigTurnos {
  mañana: Turno;
  tarde: Turno;
}

export interface EstadisticasDiarias {
  totalEmpleados: number;
  presentes: number;
  tardanzas: number;
  ausentes: number;
  totalHoras: number;
}

export type TipoNovedad = 'todas' | 'normal' | 'tardanza' | 'ausente' | 'enfermo';

export interface Filtros {
  fechaInicio: string;
  fechaFin: string;
  busqueda: string;
  tipoNovedad: TipoNovedad;
}
