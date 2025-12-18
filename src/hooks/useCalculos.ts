import { parse, differenceInMinutes } from 'date-fns';
import { ConfigTurnos, FichadaProcesada } from '../types';
import { FERIADOS_2025, TOLERANCIA_MINUTOS } from '../constants';

export const useCalculos = (turnos: ConfigTurnos) => {
  const diffHoras = (inicio: string | null, fin: string | null): string => {
    if (!inicio || !fin) return '0h';

    try {
      const inicioDate = parse(inicio, 'HH:mm', new Date());
      let finDate = parse(fin, 'HH:mm', new Date());

      if (finDate < inicioDate) {
        finDate.setDate(finDate.getDate() + 1);
      }

      const minutos = differenceInMinutes(finDate, inicioDate);
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;

      return `${horas}h${mins > 0 ? mins + 'm' : ''}`;
    } catch (error) {
      return '0h';
    }
  };

  const diffMinutos = (horaReal: string | null, horaEsperada: string): number => {
    if (!horaReal) return 0;

    try {
      const realDate = parse(horaReal, 'HH:mm', new Date());
      const esperadaDate = parse(horaEsperada, 'HH:mm', new Date());

      return differenceInMinutes(realDate, esperadaDate);
    } catch (error) {
      return 0;
    }
  };

  const calcularNovedad = (
    fichada: Partial<FichadaProcesada>,
    fecha: string
  ): { novedad: string; color: 'success' | 'warning' | 'error' | 'info' } => {
    if (FERIADOS_2025.includes(fecha)) {
      return { novedad: '🏖️ FERIADO', color: 'info' };
    }

    const { ingresoMañana, egresoMañana, ingresoTarde, egresoTarde } = fichada;

    const tieneFichadaMañana = ingresoMañana || egresoMañana;
    const tieneFichadaTarde = ingresoTarde || egresoTarde;

    if (!tieneFichadaMañana && !tieneFichadaTarde) {
      return { novedad: '❌ AUSENTE', color: 'error' };
    }

    let tardanzaMaxima = 0;

    if (ingresoMañana) {
      const minsTarde = diffMinutos(ingresoMañana, turnos.mañana.ingreso);
      if (minsTarde > TOLERANCIA_MINUTOS) {
        tardanzaMaxima = Math.max(tardanzaMaxima, minsTarde);
      }
    }

    if (ingresoTarde) {
      const minsTarde = diffMinutos(ingresoTarde, turnos.tarde.ingreso);
      if (minsTarde > TOLERANCIA_MINUTOS) {
        tardanzaMaxima = Math.max(tardanzaMaxima, minsTarde);
      }
    }

    if (tardanzaMaxima > 30) {
      return { novedad: `⚠️ ${tardanzaMaxima}min tarde`, color: 'error' };
    } else if (tardanzaMaxima > 0) {
      return { novedad: `⚠️ ${tardanzaMaxima}min tarde`, color: 'warning' };
    }

    return { novedad: '✅ Normal', color: 'success' };
  };

  const calcularTotalHoras = (totalMañana: string, totalTarde: string): number => {
    const extraerMinutos = (str: string): number => {
      const match = str.match(/(\d+)h(\d+)?m?/);
      if (!match) return 0;
      const horas = parseInt(match[1] || '0');
      const mins = parseInt(match[2] || '0');
      return horas * 60 + mins;
    };

    return (extraerMinutos(totalMañana) + extraerMinutos(totalTarde)) / 60;
  };

  return {
    diffHoras,
    diffMinutos,
    calcularNovedad,
    calcularTotalHoras,
  };
};
