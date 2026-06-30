import { useState } from 'react';
import CustomNumpad from './CustomNumpad';
import ExportButtons from './ExportButtons';

export default function WeighingTable({ truckData, rows, setRows, onReset }) {
  const [activeCell, setActiveCell] = useState(null);

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, values: Array(10).fill('') }]);
  };

  const deleteRow = (id) => {
    if (window.confirm('Yakin hapus baris ini?')) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const openNumpad = (rowId, colIndex) => {
    setActiveCell({ rowId, colIndex });
  };

  const closeNumpad = () => {
    setActiveCell(null);
  };

  const handleNumpadChange = (newValue) => {
    if (!activeCell) return;
    
    setRows(rows.map(row => {
      if (row.id === activeCell.rowId) {
        const newValues = [...row.values];
        newValues[activeCell.colIndex] = newValue;
        return { ...row, values: newValues };
      }
      return row;
    }));
  };

  const getRowSubtotal = (row) => {
    return row.values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  return (
    <div className="p-4 pb-32">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 truncate">
           {truckData.noPlat}
        </h2>
        <button 
          onClick={() => {
            if(window.confirm('Reset semua data?')) {
              onReset();
              window.location.reload();
            }
          }}
          className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full"
        >
          Reset
        </button>
      </div>

      <div id="tabel-timbangan" className="bg-white p-4 rounded-xl shadow-sm">
        <div className="text-center mb-4 border-b pb-2">
          <h3 className="font-bold text-lg">Data Timbangan</h3>
          <p className="text-sm text-gray-500">Sopir: {truckData.namaSopir}</p>
        </div>

        {rows.map((row, rowIndex) => (
          <div key={row.id} className="mb-4 border-b border-gray-100 pb-4 last:border-0">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                Karung #{rowIndex + 1}
              </span>
              <button
                onClick={() => deleteRow(row.id)}
                className="text-red-500 text-sm font-medium px-3 py-1 bg-red-50 rounded-full"
              >
                🗑️
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {row.values.map((val, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => openNumpad(row.id, colIndex)}
                  className={`
                    w-full p-3 rounded-lg text-center text-lg font-bold border-2 transition-all
                    ${val !== '' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-gray-50 text-gray-400'}
                  `}
                >
                  {val || '-'}
                </button>
              ))}
            </div>
            
            <div className="mt-2 text-right font-bold text-gray-600 text-sm">
              Subtotal: <span className="text-blue-600 text-base">{getRowSubtotal(row)}</span> kg
            </div>
          </div>
        ))}

        <button
          onClick={addRow}
          className="w-full bg-green-600 text-white p-3 rounded-xl text-base font-bold hover:bg-green-700 active:bg-green-800 shadow-md"
        >
          + Tambah Baris Karung
        </button>
      </div>

      {activeCell && (
        <CustomNumpad 
          value={rows.find(r => r.id === activeCell.rowId).values[activeCell.colIndex]}
          onChange={handleNumpadChange}
          onClose={closeNumpad}
        />
      )}

      <ExportButtons truckData={truckData} rows={rows} />
    </div>
  );
}