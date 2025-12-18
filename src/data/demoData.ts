import { FichadaRaw } from '../types';

export const generarDatosDemo = (): FichadaRaw[] => {
  const empleados = [
    { legajo: '1001', nombre: 'Juan Pérez' },
    { legajo: '1002', nombre: 'María González' },
    { legajo: '1003', nombre: 'Pedro Sánchez' },
    { legajo: '1004', nombre: 'Ana Rodríguez' },
    { legajo: '1005', nombre: 'Carlos Martínez' },
    { legajo: '1006', nombre: 'Laura Fernández' },
    { legajo: '1007', nombre: 'Roberto López' },
    { legajo: '1008', nombre: 'Sofía García' },
    { legajo: '1009', nombre: 'Diego Torres' },
    { legajo: '1010', nombre: 'Valentina Ruiz' },
  ];

  const fechas = [
    '2025-12-01',
    '2025-12-02',
    '2025-12-03',
    '2025-12-04',
    '2025-12-05',
  ];

  const fichadas: FichadaRaw[] = [];

  empleados.forEach((empleado, empIndex) => {
    fechas.forEach((fecha, fechaIndex) => {
      if (empIndex === 2 && fechaIndex === 2) {
        return;
      }

      if (empIndex === 5 && fechaIndex === 1) {
        return;
      }

      let ingresoMañana = '08:00';
      let egresoMañana = '16:30';
      let ingresoTarde = '14:00';
      let egresoTarde = '22:15';

      if (empIndex === 1 && fechaIndex === 1) {
        ingresoMañana = '08:15';
      }

      if (empIndex === 3 && fechaIndex === 0) {
        ingresoMañana = '08:25';
      }

      if (empIndex === 4 && fechaIndex === 3) {
        ingresoMañana = '08:45';
      }

      if (empIndex === 7 && fechaIndex === 2) {
        ingresoTarde = '14:30';
      }

      const turnoIndex = (empIndex + fechaIndex) % 2;

      if (turnoIndex === 0) {
        fichadas.push(
          {
            legajo: empleado.legajo,
            nombre: empleado.nombre,
            fecha,
            hora: ingresoMañana,
            tipo: 'entrada',
            turno: 'mañana',
          },
          {
            legajo: empleado.legajo,
            nombre: empleado.nombre,
            fecha,
            hora: egresoMañana,
            tipo: 'salida',
            turno: 'mañana',
          }
        );
      } else {
        fichadas.push(
          {
            legajo: empleado.legajo,
            nombre: empleado.nombre,
            fecha,
            hora: ingresoTarde,
            tipo: 'entrada',
            turno: 'tarde',
          },
          {
            legajo: empleado.legajo,
            nombre: empleado.nombre,
            fecha,
            hora: egresoTarde,
            tipo: 'salida',
            turno: 'tarde',
          }
        );
      }
    });
  });

  return fichadas;
};
