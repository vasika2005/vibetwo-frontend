import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminSongs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    api.get('/admin/songs/').then(res => setSongs(res.data));
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this song?')) return;
    await api.delete(`/admin/songs/${id}/`);
    setSongs(songs.filter(s => s.id !== id));
    toast.success('Song deleted');
  };

  return (
    <div className="pt-24 pb-32 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Song Management</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-300"><tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">Artist</th><th className="px-4 py-3">Uploader</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
          <tbody>
            {songs.map(s => (
              <tr key={s.id} className="border-t border-gray-800 text-gray-300">
                <td className="px-4 py-3 text-white font-bold">{s.title}</td>
                <td className="px-4 py-3">{s.artist}</td>
                <td className="px-4 py-3">{s.uploader}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${s.status === 'APPROVED' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{s.status}</span></td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}