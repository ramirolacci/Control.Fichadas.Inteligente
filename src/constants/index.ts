import { ConfigTurnos } from '../types';

export const FERIADOS_2025 = [
  '2025-01-01',
  '2025-02-24',
  '2025-02-25',
  '2025-03-24',
  '2025-04-02',
  '2025-04-18',
  '2025-05-01',
  '2025-05-25',
  '2025-06-16',
  '2025-06-20',
  '2025-07-09',
  '2025-08-17',
  '2025-10-12',
  '2025-11-24',
  '2025-12-08',
  '2025-12-25',
];

export const DEFAULT_TURNOS: ConfigTurnos = {
  mañana: {
    ingreso: '08:00',
    egreso: '16:30',
  },
  tarde: {
    ingreso: '14:00',
    egreso: '22:15',
  },
};

export const TOLERANCIA_MINUTOS = 15;

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const REGISTROS_POR_PAGINA = 25;

export const FORMATO_FECHA = 'yyyy-MM-dd';
export const FORMATO_HORA = 'HH:mm';
