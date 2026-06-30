import { useState, useRef, useEffect } from 'react';
import CustomNumpad from './CustomNumpad';
import ExportButtons from './ExportButtons';
import useStore from '../useStore';

export default function WeighingTable({ truckData, rows, onReset }) {
  const { updateCell, addRow, deleteRow } = useStore();
  const [activeCell, setActiveCell] = useState(null);
  const [showNumpad, setShowNumpad] = useState(false);
  const tableRef = useRef(null);

  const getRowSubtotal = (row) => {
    return row.values.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const handleCellClick = (rowId, colIndex) => {
    setActiveCell({ rowId, colIndex });
    setShowNumpad(true);
  };

  const handleNumpadClose = (value) => {
    if (activeCell && value !== null) {
      updateCell(activeCell.rowId, activeCell.colIndex, value);
      
      // Auto-move ke kolom berikutnya
      const currentRow = rows.find(r => r.id === activeCell.rowId);
      if (currentRow) {
        const nextCol = activeCell.colIndex + 1;
        if (nextCol < 10) {
          // Masih ada kolom di baris ini
          setTimeout(() => {
            setActiveCell({ rowId: activeCell.rowId, colIndex: nextCol });
            setShowNumpad(true);
          }, 100);
        } else {
          // Sudah kolom terakhir, buat baris baru
          setTimeout(() => {
            addRow();
          }, 100);
        }
      }
    }
    setShowNumpad(false);
  };

  const handleKeyDown = (rowId, colIndex, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextCol = colIndex + 1;
      if (nextCol < 10) {
        setActiveCell({ rowId, colIndex: nextCol });
      } else {
        addRow();
      }
    }
  };

  return (
    <div className="p-2 pb-32">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">
          📦 Penimbangan
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

      <div id="tabel-timbangan" className="bg-white rounded-xl shadow-sm overflow-hidden">
        {rows.map((row, rowIndex) => (
          <div key={row.id} className="border-b border-gray-200 last:border-0">
            <div className="flex items-center">
              {/* Nomor Karung */}
              <div className="bg-gray-100 px-3 py-2 font-bold text-sm border-r border-gray-200 min-w-[60px] text-center">
                #{rowIndex + 1}
              </div>
              
              {/* 10 Kolom Input */}
              <div className="flex-1 overflow-x-auto">
                <div className="flex min-w-[600px]">
                  {row.values.map((val, colIndex) => (
                    <input
                      key={colIndex}
                      type="number"
                      value={val}
                      onChange={(e) => updateCell(row.id, colIndex, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(row.id, colIndex, e)}
                      onClick={() => handleCellClick(row.id, colIndex)}
                      className={`
                        w-16 p-2 text-center font-bold border-r border-gray-200 last:border-r-0
                        ${val ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-400'}
                        focus:outline-none focus:bg-yellow-50
                      `}
                      placeholder="0"
                    />
                  ))}
                </div>
              </div>
              
              {/* Subtotal */}
              <div className="bg-green-100 px-3 py-2 font-bold text-sm border-l border-gray-200 min-w-[80px] text-center text-green-700">
                {getRowSubtotal(row)}
              </div>
              
              {/* Delete Button */}
              <button
                onClick={() => deleteRow(row.id)}
                className="px-3 py-2 text-red-500 hover:bg-red-50"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="w-full mt-4 bg-green-600 text-white p-3 rounded-lg font-bold active:bg-green-700"
      >
        + Tambah Baris
      </button>

      {showNumpad && activeCell && (
        <CustomNumpad 
          value={rows.find(r => r.id === activeCell.rowId)?.values[activeCell.colIndex] || ''}
          onClose={handleNumpadClose}
        />
      )}

      <ExportButtons truckData={truckData} rows={rows} />
    </div>
  );
}