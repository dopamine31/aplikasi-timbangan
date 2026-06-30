import { useState, useEffect } from 'react'
import TruckForm from './components/TruckForm'
import StickyHeader from './components/StickyHeader'
import WeighingTable from './components/WeighingTable'
import useStore from './useStore'

function App() {
  const { 
    truckData, 
    rows, 
    location,
    setTruckData, 
    addSack,
    deleteSack,
    loadData, 
    resetData,
    saveLocation,
    isLoading 
  } = useStore()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (truckData && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          saveLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Gagal ambil GPS:", error);
        }
      );
    }
  }, [truckData])

  const handleTruckSave = async (data) => {
    await setTruckData(data)
  }

  const totalKarung = rows.length;
  const grandTotal = rows.reduce((sum, row) => sum + row.berat, 0);
  const rata2 = totalKarung > 0 ? grandTotal / totalKarung : 0;

  if (!truckData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <TruckForm onSave={handleTruckSave} />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader 
        rata2={rata2} 
        totalKarung={totalKarung} 
        grandTotal={grandTotal}
        targetTotal={5000}
        location={location}
        truckData={truckData}
      />
      <WeighingTable 
        truckData={truckData} 
        rows={rows} 
        addSack={addSack}
        deleteSack={deleteSack}
        onReset={resetData}
      />
      
      {isLoading && (
        <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          💾 Menyimpan...
        </div>
      )}
    </div>
  )
}

export default App