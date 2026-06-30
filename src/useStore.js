import { create } from 'zustand';
import { supabase } from './lib/supabase';

const useStore = create((set, get) => ({
  truckData: null,
  truckId: null,
  weighingId: null,
  location: null,
  rows: [], // Setiap row = 1 karung, 1 angka
  isLoading: false,
  error: null,

  setTruckData: async (data) => {
    set({ isLoading: true });
    try {
      const { data: truck, error: truckError } = await supabase
        .from('trucks')
        .insert([{
          no_plat: data.noPlat,
          nama_sopir: data.namaSopir,
          no_hp_sopir: data.noHp,
        }])
        .select()
        .single();

      if (truckError) throw truckError;

      const now = new Date();
      const { data: weighing, error: weighingError } = await supabase
        .from('weighings')
        .insert([{
          truck_id: truck.id,
          tanggal: now.toISOString().split('T')[0],
          jam: now.toTimeString().split(' ')[0],
          target_grand_total: 5000,
          status: 'draft'
        }])
        .select()
        .single();

      if (weighingError) throw weighingError;

      set({ 
        truckData: data, 
        truckId: truck.id,
        weighingId: weighing.id,
        rows: [], // Reset rows
        isLoading: false 
      });
      
      localStorage.setItem('timbangan_data', JSON.stringify({ 
        truckData: data, 
        truckId: truck.id,
        weighingId: weighing.id,
        rows: []
      }));
    } catch (error) {
      console.error('Error saving truck:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  addSack: async (berat) => {
    const { weighingId, rows } = get();
    if (!weighingId) return;

    const newRow = {
      id: rows.length + 1,
      berat: parseFloat(berat) || 0
    };

    const newRows = [...rows, newRow];
    set({ rows: newRows, isLoading: true });

    try {
      await supabase.from('sacks').delete().eq('weighing_id', weighingId);

      const sacksData = newRows.map((row, index) => ({
        weighing_id: weighingId,
        nomor_karung: index + 1,
        col_1: row.berat,
        col_2: 0,
        col_3: 0,
        col_4: 0,
        col_5: 0,
        col_6: 0,
        col_7: 0,
        col_8: 0,
        col_9: 0,
        col_10: 0,
      }));

      const { error } = await supabase.from('sacks').insert(sacksData);
      if (error) throw error;

      localStorage.setItem('timbangan_data', JSON.stringify({ 
        ...get(),
        rows: newRows
      }));

      set({ isLoading: false });
    } catch (error) {
      console.error('Error saving sack:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  deleteSack: async (id) => {
    const { weighingId, rows } = get();
    if (!weighingId) return;

    const newRows = rows.filter(row => row.id !== id)
      .map((row, index) => ({ ...row, nomor_karung: index + 1 }));

    set({ rows: newRows, isLoading: true });

    try {
      await supabase.from('sacks').delete().eq('weighing_id', weighingId);

      const sacksData = newRows.map((row, index) => ({
        weighing_id: weighingId,
        nomor_karung: index + 1,
        col_1: row.berat,
        col_2: 0,
        col_3: 0,
        col_4: 0,
        col_5: 0,
        col_6: 0,
        col_7: 0,
        col_8: 0,
        col_9: 0,
        col_10: 0,
      }));

      const { error } = await supabase.from('sacks').insert(sacksData);
      if (error) throw error;

      localStorage.setItem('timbangan_data', JSON.stringify({ 
        ...get(),
        rows: newRows
      }));

      set({ isLoading: false });
    } catch (error) {
      console.error('Error deleting sack:', error);
      set({ error: error.message, isLoading: false });
    }
  },

  saveLocation: async (lat, lng) => {
    const { truckId } = get();
    if (!truckId) return;
    
    set({ location: { lat, lng } });

    try {
      const { error } = await supabase
        .from('trucks')
        .update({ lokasi_lat: lat, lokasi_lng: lng })
        .eq('id', truckId);
        
      if (error) console.error('Error saving location:', error);
    } catch (error) {
      console.error('Error:', error);
    }
  },

  loadData: async () => {
    const savedData = localStorage.getItem('timbangan_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      set({ 
        truckData: parsed.truckData, 
        truckId: parsed.truckId,
        weighingId: parsed.weighingId,
        location: parsed.location || null,
        rows: parsed.rows || []
      });
    }
  },

  resetData: async () => {
    const { weighingId } = get();
    if (weighingId) {
      await supabase.from('sacks').delete().eq('weighing_id', weighingId);
      await supabase.from('weighings').delete().eq('id', weighingId);
      await supabase.from('trucks').delete().eq('id', get().truckId);
    }
    localStorage.removeItem('timbangan_data');
    set({ 
      truckData: null, 
      truckId: null,
      weighingId: null,
      location: null,
      rows: []
    });
  },

  uploadTruckPhoto: async (file) => {
    const { truckId } = get();
    if (!truckId || !file) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${truckId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('truk-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('truk-photos')
        .getPublicUrl(fileName);

      await supabase
        .from('trucks')
        .update({ foto_truk_url: publicUrl })
        .eq('id', truckId);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      return null;
    }
  }
}));

export default useStore;