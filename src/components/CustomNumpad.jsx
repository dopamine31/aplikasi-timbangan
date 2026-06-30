import { useState, useRef, useEffect } from 'react';

export default function CustomNumpad({ value, onClose }) {
  const [currentValue, setCurrentValue] = useState(value || '');
  const [isListening, setIsListening] = useState(false);
  const numpadRef = useRef(null);
  const touchStartX = useRef(0);

  const handlePress = (num) => {
    if (num === 'backspace') {
      setCurrentValue(String(currentValue).slice(0, -1));
    } else if (num === 'clear') {
      setCurrentValue('');
    } else if (num === 'enter') {
      onClose(currentValue);
    } else {
      setCurrentValue(currentValue + num);
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
        setCurrentValue(String(number));
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  // Swipe left/right untuk navigate
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left = next (enter)
        onClose(currentValue);
      } else {
        // Swipe right = backspace
        setCurrentValue(String(currentValue).slice(0, -1));
      }
    }
  };

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace']
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col justify-end">
      <div 
        ref={numpadRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="bg-white rounded-t-2xl p-3 pb-4 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-gray-700">Input Angka</h3>
          <button 
            onClick={() => onClose(currentValue)}
            className="text-gray-500 font-bold text-lg px-3 py-1 bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg mb-3 text-center flex items-center justify-center gap-2">
          <span className="text-3xl font-bold text-blue-600 min-w-[100px]">
            {currentValue || '0'}
          </span>
          <button
            onClick={startVoiceInput}
            className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-500 text-white'}`}
          >
            
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {buttons.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handlePress(btn)}
              className={`
                p-4 rounded-lg text-2xl font-bold shadow-sm active:scale-95 transition-transform
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
          onClick={() => onClose(currentValue)}
          className="w-full mt-3 bg-blue-600 text-white p-3 rounded-lg text-lg font-bold shadow-md active:bg-blue-700"
        >
          ✓ Simpan & Lanjut
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          💡 Geser kiri = Simpan & Lanjut | Geser kanan = Hapus
        </p>
      </div>
    </div>
  );
}