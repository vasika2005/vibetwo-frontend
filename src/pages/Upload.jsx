import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiCloudUpload } from 'react-icons/hi';

export default function Upload() {
  const [formData, setFormData] = useState({ title: '', artist_name: '', description: '', audio: null, cover: null });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, audio: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.audio) return toast.error('Please select an audio file');
    
    setLoading(true);
    setError(null);
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => { if (val) data.append(key, val); });

    try {
      const res = await api.post('/songs/upload/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      if (res.data.requires_payment) {
        const options = {
          key: res.data.payment.key,
          amount: res.data.payment.amount,
          currency: "INR",
          name: "VibeTwo",
          description: "First Upload Fee",
          order_id: res.data.payment.order_id,
          handler: async (response) => {
            await api.post('/payments/verify/', response);
            toast.success('Payment successful! Song published.');
            navigate('/my-songs');
          },
          theme: { color: "#7c3aed" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.success('Song uploaded and published!');
        navigate('/my-songs');
      }
    } catch (err) {
      console.log("FULL ERROR OBJECT:", err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Upload failed';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-32 max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><HiCloudUpload className="text-purple-500" /> Upload Song</h1>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-xl mb-6">
          <p className="font-bold">Error Details:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl border border-gray-800 space-y-6">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Title</label>
          <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="text-sm text-gray-300 block mb-1">Artist Name</label>
          <input required value={formData.artist_name} onChange={(e) => setFormData({...formData, artist_name: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
        </div>
        <div>
          <label className="text-sm text-gray-300 block mb-1">Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24" />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Audio File (Max 2 minutes)</label>
          <input type="file" accept="audio/*" required onChange={handleAudioChange} className="w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700" />
          {preview && <audio controls src={preview} className="w-full mt-4"></audio>}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Uploading & Moderating...' : 'Upload Song'}
        </button>
      </form>
    </div>
  );
}