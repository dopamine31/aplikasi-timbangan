import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import useStore from '../useStore';

export default function ExportButtons({ truckData, rows }) {
  const { location } = useStore();

  const exportExcel = () => {
    const totalKarung = rows.length;
    const grandTotal = rows.reduce((sum, row) => {
      const rowSum = row.values.reduce((rSum, val) => rSum + (parseFloat(val) || 0), 0);
      return sum + rowSum;
    }, 0);
    const rata2 = totalKarung > 0 ? grandTotal / totalKarung : 0;

    const headerData = [
      { 'Field': 'No Plat', 'Value': truckData.noPlat },
      { 'Field': 'Nama Sopir', 'Value': truckData.namaSopir },
      { 'Field': 'No HP', 'Value': truckData.noHp },
      { 'Field': 'Tanggal', 'Value': new Date().toLocaleDateString('id-ID') },
      { 'Field': 'Lokasi GPS', 'Value': location ? `${location.lat}, ${location.lng}` : '-' },
      { 'Field': '', 'Value': '' },
      { 'Field': 'Total Karung', 'Value': totalKarung },
      { 'Field': 'Grand Total', 'Value': grandTotal + ' kg' },
      { 'Field': 'Rata-rata', 'Value': rata2.toFixed(2) + ' kg' },
      { 'Field': '', 'Value': '' },
    ];

    const sackData = rows.map((row, index) => {
      const rowData = { 'No Karung': index + 1 };
      row.values.forEach((val, i) => {
        rowData[`Titik ${i + 1}`] = val || 0;
      });
      rowData['Subtotal'] = row.values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
      return rowData;
    });

    const allData = [...headerData, ...sackData];
    const ws = XLSX.utils.json_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timbangan");
    
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-40">
      <div className="flex gap-2 max-w-md mx-auto">
        <button
          onClick={exportExcel}
          className="flex-1 bg-green-600 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 active:bg-green-700 text-sm"
        >
          📊 Excel
        </button>
        <button
          onClick={exportPNG}
          className="flex-1 bg-purple-600 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 active:bg-purple-700 text-sm"
        >
          🖼️ PNG
        </button>
      </div>
    </div>
  );
}