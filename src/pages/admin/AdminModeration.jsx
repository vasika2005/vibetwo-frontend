import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminModeration() {
  const [songs, setSongs] = useState([]);
  const [filter, setFilter] = useState('MANUAL_REVIEW');

  useEffect(() => {
    api.get(`/admin/moderation/?status=${filter}`).then(res => setSongs(res.data));
  }, [filter]);

  const handleAction = async (id, action) => {
    await api.post(`/admin/moderation/${id}/${action}/`);
    setSongs(songs.filter(s => s.id !== id));
    toast.success(`Song ${action}d`);
  };

  return (
    <div className="pt-24 pb-32 max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">AI Moderation</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg">
          <option value="MANUAL_REVIEW">Manual Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {songs.length === 0 ? <p className="text-gray-500 text-center mt-10">No songs in this category.</p> : songs.map(s => (
          <div key={s.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">{s.title}</h3>
              <p className="text-gray-400 text-sm">By: {s.uploader} • Confidence: {s.confidence || 'N/A'}</p>
              <p className="text-gray-500 text-xs mt-1">Reason: {s.reason}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction(s.id, 'approve')} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Approve</button>
              <button onClick={() => handleAction(s.id, 'reject')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}