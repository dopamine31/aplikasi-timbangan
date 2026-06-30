export default function StickyHeader({ rata2, totalKarung, grandTotal, targetTotal, location, truckData }) {
  const progress = targetTotal > 0 ? (grandTotal / targetTotal) * 100 : 0;

  return (
    <div className="sticky top-0 z-10 bg-white shadow-md p-3 border-b">
      <div className="text-sm font-bold text-gray-800 mb-1">
        🚚 {truckData?.noPlat}
      </div>
      
      {location && (
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-1 bg-blue-50 p-1 rounded">
          <span>📍</span>
          <span className="truncate font-mono text-xs">
            {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-center flex-1">
          <div className="text-xs text-gray-500">RATA²</div>
          <div className="text-lg font-bold text-blue-600">{rata2.toFixed(2)}</div>
        </div>
        <div className="text-center flex-1 border-x border-gray-200">
          <div className="text-xs text-gray-500">KARUNG</div>
          <div className="text-lg font-bold text-green-600">{totalKarung}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-xs text-gray-500">TOTAL</div>
          <div className="text-lg font-bold text-orange-600">{grandTotal}</div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: Math.min(progress, 100) + '%' }}
        />
      </div>
      <div className="text-xs text-gray-500 text-right mt-1">
        {progress.toFixed(1)}% dari {targetTotal} kg
      </div>
    </div>
  );
}