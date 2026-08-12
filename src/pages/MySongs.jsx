import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import SongCard from '../components/SongCard';
import toast from 'react-hot-toast';

export default function MySongs() {
  const { user } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    api.get('/songs/my-songs/').then(res => setSongs(res.data.results || res.data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    try {
      await api.delete(`/songs/${id}/delete/`);
      setSongs(songs.filter(s => s.id !== id));
      toast.success('Song deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="pt-24 pb-32 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">My Uploads</h1>
      {songs.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">You haven't uploaded any songs yet.</p>
      ) : (
        <div className="space-y-3">
          {songs.map(song => (
            <div key={song.id} className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white font-bold">{song.title}</p>
                <p className="text-sm text-gray-400">Status: <span className={`font-bold ${song.status === 'APPROVED' ? 'text-green-400' : 'text-yellow-400'}`}>{song.status}</span></p>
              </div>
              <button onClick={() => handleDelete(song.id)} className="text-red-500 hover:text-red-400 font-bold text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}