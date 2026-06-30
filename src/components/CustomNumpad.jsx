import { useState } from 'react';

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
      alert('Browser tidak support voice input');
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
      const number = parseFloat(transcript.replace(/[^0-9.]/g, ''));
      if (!isNaN(number)) {
        onChange(String(number));
      }
    };

    recognition.onerror = () => setIsListening(false);
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
      <div className="bg-white rounded-t-2xl p-3 pb-4 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-gray-700">Input Angka</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 font-bold text-lg px-3 py-1 bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg mb-3 text-center flex items-center justify-center gap-2">
          <span className="text-2xl font-bold text-blue-600">
            {value || '0'}
          </span>
          <button
            onClick={startVoiceInput}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-500 text-white'}`}
          >
            🎤
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {buttons.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handlePress(btn)}
              className={`
                p-3 rounded-lg text-xl font-bold shadow-sm active:scale-95 transition-transform
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
          className="w-full mt-3 bg-blue-600 text-white p-3 rounded-lg text-base font-bold shadow-md active:bg-blue-700"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}