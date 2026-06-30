import { useState, useRef, useEffect } from 'react';
import CustomNumpad from './CustomNumpad';
import ExportButtons from './ExportButtons';

export default function WeighingTable({ truckData, rows, addSack, deleteSack, onReset }) {
  const [showNumpad, setShowNumpad] = useState(false);
  const [currentValue, setCurrentValue] = useState('');
  const inputRef = useRef(null);

  // Auto-focus ke input setelah render
  useEffect(() => {
    if (inputRef.current && !showNumpad) {
      inputRef.current.focus();
    }
  }, [rows.length, showNumpad]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && currentValue) {
      e.preventDefault();
      addSack(currentValue);
      setCurrentValue('');
    }
  };

  const openNumpad = () => {
    setShowNumpad(true);
  };

  const closeNumpad = () => {
    setShowNumpad(false);
    if (currentValue) {
      addSack(currentValue);
      setCurrentValue('');
    }
  };

  const handleNumpadChange = (value) => {
    setCurrentValue(value);
  };

  return (
    <div className="p-3 pb-32">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">
          📦 Input Karung
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

      {/* Input Area */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Berat Karung (kg)
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg text-lg font-bold text-center focus:border-blue-500 focus:outline-none"
            placeholder="0"
            autoFocus
          />
          <button
            onClick={openNumpad}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg font-bold active:bg-blue-700"
          >
            
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
           Tekan Enter untuk simpan & lanjut ke karung berikutnya
        </p>
      </div>

      {/* Daftar Karung */}
      <div id="tabel-timbangan" className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <h3 className="font-bold text-lg mb-3 border-b pb-2">Data Karung</h3>
        
        {rows.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada data karung</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {rows.map((row, index) => (
              <div key={row.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    #{index + 1}
                  </span>
                  <span className="font-bold text-lg">{row.berat} kg</span>
                </div>
                <button
                  onClick={() => deleteSack(row.id)}
                  className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                >
                  ️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Numpad Modal */}
      {showNumpad && (
        <CustomNumpad 
          value={currentValue}
          onChange={handleNumpadChange}
          onClose={closeNumpad}
        />
      )}

      {/* Export Buttons */}
      <ExportButtons truckData={truckData} rows={rows} />
    </div>
  );
}