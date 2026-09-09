import { parse, differenceInMinutes, getDay } from 'date-fns';
import { ConfigTurnos, FichadaProcesada } from '../types';
import { FERIADOS_2025, TOLERANCIA_MINUTOS } from '../constants';

export const useCalculos = (turnos: ConfigTurnos) => {
  const tolerancia = turnos.toleranciaMinutos ?? TOLERANCIA_MINUTOS;
  const jornadaHoras = turnos.jornadaDiariaHoras ?? 8;

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

  const esFeriado = (fecha: string): boolean => {
    if (FERIADOS_2025.includes(fecha)) return true;
    if (turnos.feriadosAdicionales && turnos.feriadosAdicionales.includes(fecha)) return true;
    return false;
  };

  const calcularNovedad = (
    fichada: Partial<FichadaProcesada>,
    fecha: string
  ): { novedad: string; color: 'success' | 'warning' | 'error' | 'info' } => {
    if (esFeriado(fecha)) {
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
      if (minsTarde > tolerancia) {
        tardanzaMaxima = Math.max(tardanzaMaxima, minsTarde);
      }
    }

    if (ingresoTarde) {
      const minsTarde = diffMinutos(ingresoTarde, turnos.tarde.ingreso);
      if (minsTarde > tolerancia) {
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

  const calcularMinutosRango = (inicio: string | null, fin: string | null): number => {
    if (!inicio || !fin) return 0;
    try {
      const inicioDate = parse(inicio, 'HH:mm', new Date());
      let finDate = parse(fin, 'HH:mm', new Date());
      if (finDate < inicioDate) {
        finDate.setDate(finDate.getDate() + 1);
      }
      return differenceInMinutes(finDate, inicioDate);
    } catch {
      return 0;
    }
  };

  const calcularMinutosNocturnos = (inicio: string | null, fin: string | null): number => {
    if (!inicio || !fin) return 0;
    try {
      const inicioDate = parse(inicio, 'HH:mm', new Date());
      let finDate = parse(fin, 'HH:mm', new Date());
      if (finDate < inicioDate) {
        finDate.setDate(finDate.getDate() + 1);
      }

      let minsNocturnos = 0;
      let curr = new Date(inicioDate.getTime());
      while (curr < finDate) {
        const h = curr.getHours();
        if (h >= 21 || h < 6) {
          minsNocturnos++;
        }
        curr.setMinutes(curr.getMinutes() + 1);
      }
      return minsNocturnos;
    } catch {
      return 0;
    }
  };

  const desglosarHoras = (
    fichada: Partial<FichadaProcesada>,
    fechaStr: string
  ): {
    horasNormales: number;
    horasExtras50: number;
    horasExtras100: number;
    horasNocturnas: number;
  } => {
    const minsMañana = calcularMinutosRango(fichada.ingresoMañana || null, fichada.egresoMañana || null);
    const minsTarde = calcularMinutosRango(fichada.ingresoTarde || null, fichada.egresoTarde || null);

    const totalMinutosTrabajados = minsMañana + minsTarde;
    const totalHorasTrabajadas = totalMinutosTrabajados / 60;

    const minsNocturnosM = calcularMinutosNocturnos(fichada.ingresoMañana || null, fichada.egresoMañana || null);
    const minsNocturnosT = calcularMinutosNocturnos(fichada.ingresoTarde || null, fichada.egresoTarde || null);
    const horasNocturnas = (minsNocturnosM + minsNocturnosT) / 60;

    let dayOfWeek = -1;
    try {
      const matchISO = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      const matchDDMM = fechaStr.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
      if (matchISO) {
        const [, yr, mo, da] = matchISO;
        dayOfWeek = getDay(new Date(Number(yr), Number(mo) - 1, Number(da)));
      } else if (matchDDMM) {
        const [, da, mo, yr] = matchDDMM;
        dayOfWeek = getDay(new Date(Number(yr), Number(mo) - 1, Number(da)));
      }
    } catch {
      dayOfWeek = -1;
    }

    const esFeriadoDia = esFeriado(fechaStr);
    const esDomingo = dayOfWeek === 0;

    if (esFeriadoDia || esDomingo) {
      return {
        horasNormales: 0,
        horasExtras50: 0,
        horasExtras100: Number(totalHorasTrabajadas.toFixed(2)),
        horasNocturnas: Number(horasNocturnas.toFixed(2)),
      };
    }

    const horasNorm = Math.min(jornadaHoras, totalHorasTrabajadas);
    const horasEx50 = Math.max(0, totalHorasTrabajadas - jornadaHoras);

    return {
      horasNormales: Number(horasNorm.toFixed(2)),
      horasExtras50: Number(horasEx50.toFixed(2)),
      horasExtras100: 0,
      horasNocturnas: Number(horasNocturnas.toFixed(2)),
    };
  };

  return {
    diffHoras,
    diffMinutos,
    calcularNovedad,
    calcularTotalHoras,
    desglosarHoras,
  };
};
