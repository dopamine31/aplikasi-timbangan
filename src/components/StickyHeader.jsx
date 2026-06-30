export default function StickyHeader({ rata2, totalKarung, grandTotal, targetTotal, location }) {
    const progress = targetTotal > 0 ? (grandTotal / targetTotal) * 100 : 0;
  
    return (
      <div className="sticky top-0 z-10 bg-white shadow-md p-4 border-b">
        {/* Info GPS */}
        {location && (
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-1 bg-blue-50 p-2 rounded-lg">
            <span>📍</span>
            <span className="truncate font-mono">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-2">
          <div className="text-center flex-1">
            <div className="text-xs text-gray-500 font-semibold">RATA²</div>
            <div className="text-xl font-bold text-blue-600">{rata2.toFixed(2)}</div>
          </div>
          <div className="text-center flex-1 border-x border-gray-200">
            <div className="text-xs text-gray-500 font-semibold">KARUNG</div>
            <div className="text-xl font-bold text-green-600">{totalKarung}</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xs text-gray-500 font-semibold">TOTAL</div>
            <div className="text-xl font-bold text-orange-600">{grandTotal}</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: Math.min(progress, 100) + '%' }}
          />
        </div>
        <div className="text-xs text-gray-500 text-right mt-1 font-medium">
          {progress.toFixed(1)}% dari {targetTotal} kg
        </div>
      </div>
    );
  }