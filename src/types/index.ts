export interface FichadaRaw {
  legajo: string;
  nombre: string;
  fecha: string;
  hora: string;
  tipo: 'entrada' | 'salida';
  turno?: 'mañana' | 'tarde';
}

export interface FichadaProcesada {
  id?: string;
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
  editadoManualmente?: boolean;
  justificado?: boolean;
  observaciones?: string;
  incompleto?: boolean;
  horasNormales?: number;
  horasExtras50?: number;
  horasExtras100?: number;
  horasNocturnas?: number;
}

export interface Turno {
  ingreso: string;
  egreso: string;
}

export interface ConfigTurnos {
  mañana: Turno;
  tarde: Turno;
  toleranciaMinutos?: number;
  jornadaDiariaHoras?: number;
  feriadosAdicionales?: string[];
}

export interface EstadisticasDiarias {
  totalEmpleados: number;
  presentes: number;
  tardanzas: number;
  ausentes: number;
  totalHoras: number;
  totalHorasExtras50?: number;
  totalHorasExtras100?: number;
  totalHorasNocturnas?: number;
}

export type TipoNovedad = 'todas' | 'normal' | 'tardanza' | 'ausente' | 'enfermo';

export interface Filtros {
  fechaInicio: string;
  fechaFin: string;
  busqueda: string;
  tipoNovedad: TipoNovedad;
}
