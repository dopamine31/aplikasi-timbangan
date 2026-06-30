import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

export default function ExportButtons({ truckData, rows }) {
  const exportExcel = () => {
    // Siapkan data untuk Excel
    const dataToExport = rows.map((row, index) => {
      const rowData = { 'No Karung': index + 1 };
      row.values.forEach((val, i) => {
        rowData[`Titik ${i + 1}`] = val || 0;
      });
      rowData['Subtotal'] = row.values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      return rowData;
    });

    // Tambah baris total di bawah
    const grandTotal = dataToExport.reduce((sum, row) => sum + row['Subtotal'], 0);
    dataToExport.push({ 'No Karung': 'TOTAL', 'Subtotal': grandTotal });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Timbangan");
    
    // Download file
    XLSX.writeFile(wb, `Timbangan_${truckData.noPlat}_${new Date().toLocaleDateString()}.xlsx`);
  };

  const exportPNG = () => {
    const element = document.getElementById('tabel-timbangan');
    if (!element) return;

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const link = document.createElement('a');
      link.download = `Timbangan_${truckData.noPlat}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
      <div className="flex gap-3 max-w-md mx-auto">
        <button
          onClick={exportExcel}
          className="flex-1 bg-green-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-green-700"
        >
          📊 Excel
        </button>
        <button
          onClick={exportPNG}
          className="flex-1 bg-purple-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 active:bg-purple-700"
        >
          🖼️ PNG
        </button>
      </div>
    </div>
  );
}