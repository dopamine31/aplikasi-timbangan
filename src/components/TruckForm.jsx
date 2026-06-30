import { useState } from 'react';
import useStore from '../useStore';

export default function TruckForm({ onSave }) {
  const { uploadTruckPhoto } = useStore();
  const [formData, setFormData] = useState({
    noPlat: '',
    namaSopir: '',
    noHp: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      await onSave(formData);
      
      if (photoFile) {
        await uploadTruckPhoto(photoFile);
      }
      
      setIsUploading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🚚 Detail Truk</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">No Plat</label>
        <input
          type="text"
          name="noPlat"
          value={formData.noPlat}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Contoh: B 1234 ABC"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sopir</label>
        <input
          type="text"
          name="namaSopir"
          value={formData.namaSopir}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Nama lengkap sopir"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">No HP</label>
        <input
          type="tel"
          name="noHp"
          value={formData.noHp}
          onChange={handleChange}
          className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="0812..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">📷 Foto Truk (Opsional)</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm"
        />
        {photoFile && (
          <p className="text-sm text-green-600 mt-1">✓ {photoFile.name}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition shadow-md disabled:bg-gray-400"
      >
        {isUploading ? '⏳ Menyimpan...' : 'Simpan & Lanjut'}
      </button>
    </form>
  );
}