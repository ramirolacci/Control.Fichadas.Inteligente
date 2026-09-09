import { Printer, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { FichadaProcesada } from '../types';
import toast from 'react-hot-toast';

interface ExportButtonsProps {
  fichadas: FichadaProcesada[];
}

export const ExportButtons = ({ fichadas }: ExportButtonsProps) => {
  const exportarExcel = () => {
    try {
      const dataExport = fichadas.map(f => ({
        'Legajo': f.legajo,
        'Nombre': f.nombre,
        'Fecha': f.fecha,
        'Ingreso Mañana': f.ingresoMañana || '-',
        'Egreso Mañana': f.egresoMañana || '-',
        'Total Mañana': f.totalMañana,
        'Ingreso Tarde': f.ingresoTarde || '-',
        'Egreso Tarde': f.egresoTarde || '-',
        'Total Tarde': f.totalTarde,
        'Novedad': f.novedad,
        'Horas Extras 50%': f.horasExtras50 || 0,
        'Horas Extras 100%': f.horasExtras100 || 0,
        'Horas Nocturnas': f.horasNocturnas || 0,
        'Observaciones': f.observaciones || '',
      }));

      const ws = XLSX.utils.json_to_sheet(dataExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Fichadas');

      ws['!cols'] = [
        { wch: 10 },
        { wch: 25 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 13 },
        { wch: 15 },
        { wch: 15 },
        { wch: 13 },
        { wch: 20 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 30 },
      ];

      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `fichadas_${fecha}.xlsx`);
      toast.success('Archivo Excel exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar Excel');
      console.error(error);
    }
  };

  const exportarCSV = () => {
    try {
      const headers = [
        'Legajo',
        'Nombre',
        'Fecha',
        'Ingreso Mañana',
        'Egreso Mañana',
        'Total Mañana',
        'Ingreso Tarde',
        'Egreso Tarde',
        'Total Tarde',
        'Novedad',
        'Horas Extras 50%',
        'Horas Extras 100%',
        'Horas Nocturnas',
        'Observaciones',
      ];

      const rows = fichadas.map(f => [
        `"${f.legajo}"`,
        `"${f.nombre}"`,
        `"${f.fecha}"`,
        `"${f.ingresoMañana || '-'}"`,
        `"${f.egresoMañana || '-'}"`,
        `"${f.totalMañana}"`,
        `"${f.ingresoTarde || '-'}"`,
        `"${f.egresoTarde || '-'}"`,
        `"${f.totalTarde}"`,
        `"${f.novedad}"`,
        f.horasExtras50 || 0,
        f.horasExtras100 || 0,
        f.horasNocturnas || 0,
        `"${f.observaciones || ''}"`,
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const fecha = new Date().toISOString().split('T')[0];

      link.setAttribute('href', url);
      link.setAttribute('download', `fichadas_${fecha}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Archivo CSV exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar CSV');
      console.error(error);
    }
  };

  const imprimirTabla = () => {
    window.print();
    toast.success('Abriendo vista de impresión');
  };

  if (fichadas.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <button
        onClick={exportarExcel}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-950/30 active:scale-95 cursor-pointer"
      >
        <FileSpreadsheet size={16} />
        <span>Exportar Excel</span>
      </button>

      <button
        onClick={exportarCSV}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-sky-950/30 active:scale-95 cursor-pointer"
      >
        <FileText size={16} />
        <span>Exportar CSV</span>
      </button>

      <button
        onClick={imprimirTabla}
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-950/30 active:scale-95 cursor-pointer"
      >
        <Printer size={16} />
        <span>Imprimir</span>
      </button>
    </div>
  );
};
