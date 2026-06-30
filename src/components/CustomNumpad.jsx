import { useState, useEffect } from 'react';

export default function CustomNumpad({ value, onChange, onClose }) {
  const [isListening, setIsListening] = useState(false);

  const handlePress = (num) => {
    if (num === 'backspace') {
      onChange(String(value).slice(0, -1));
    } else if (num === 'clear') {
      onChange('');
    } else {
      onChange(value + num);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser Anda tidak mendukung input suara. Coba pakai Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Ambil hanya angka dari suara
      const number = parseFloat(transcript.replace(/[^0-9.]/g, ''));
      if (!isNaN(number)) {
        onChange(String(number));
      } else {
        alert('Suara tidak dikenali sebagai angka. Coba ucapkan "Empat puluh" atau "40".');
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error('Voice error:', event.error);
    };

    recognition.start();
  };

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace']
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end">
      <div className="bg-white rounded-t-3xl p-4 pb-8 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-700">Input Angka</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 font-bold text-xl px-4 py-2 bg-gray-100 rounded-full"
          >
            ✕ Tutup
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-xl mb-4 text-center flex items-center justify-center gap-3">
          <span className="text-4xl font-bold text-blue-600">
            {value || '0'}
          </span>
          <button
            onClick={startVoiceInput}
            className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-500 text-white'}`}
          >
            🎤
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {buttons.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handlePress(btn)}
              className={`
                p-5 rounded-xl text-2xl font-bold shadow-sm active:scale-95 transition-transform
                ${btn === 'clear' ? 'bg-red-100 text-red-600' : 
                  btn === 'backspace' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-gray-100 text-gray-800'}
              `}
            >
              {btn === 'backspace' ? '⌫' : btn === 'clear' ? 'C' : btn}
            </button>
          ))}
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-4 bg-blue-600 text-white p-4 rounded-xl text-lg font-bold shadow-md active:bg-blue-700"
        >
          Selesai & Simpan
        </button>
      </div>
    </div>
  );
}