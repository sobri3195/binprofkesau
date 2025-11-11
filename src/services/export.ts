import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class ExportService {
  static exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: string[]
  ): void {
    const filteredData = columns
      ? data.map(row => {
          const filtered: Record<string, any> = {};
          columns.forEach(col => {
            filtered[col] = row[col];
          });
          return filtered;
        })
      : data;

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  }

  static exportToExcel<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: string[]
  ): void {
    const filteredData = columns
      ? data.map(row => {
          const filtered: Record<string, any> = {};
          columns.forEach(col => {
            filtered[col] = row[col];
          });
          return filtered;
        })
      : data;

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  static exportToPDF<T extends Record<string, any>>(
    data: T[],
    filename: string,
    columns?: { header: string; dataKey: string }[]
  ): void {
    const doc = new jsPDF({
      orientation: columns && columns.length > 5 ? 'landscape' : 'portrait',
    });

    doc.setFontSize(16);
    doc.text(filename, 14, 15);

    const cols = columns || Object.keys(data[0] || {}).map(key => ({
      header: key,
      dataKey: key,
    }));

    autoTable(doc, {
      head: [cols.map(col => col.header)],
      body: data.map(row => cols.map(col => row[col.dataKey])),
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [60, 141, 188] },
    });

    doc.save(`${filename}.pdf`);
  }
}
