import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Aplikasi Timbangan</h1>
        <p className="text-gray-600 mb-4">Coming soon...</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Count: {count}
        </button>
      </div>
    </div>
  )
}

export default App
