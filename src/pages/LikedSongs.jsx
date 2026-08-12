import { useState, useEffect } from 'react';
import api from '../api/axios';
import SongCard from '../components/SongCard';
import { HiHeart } from 'react-icons/hi';

export default function LikedSongs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    api.get('/songs/liked/').then(res => setSongs(res.data.results || res.data));
  }, []);

  return (
    <div className="pt-24 pb-32 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><HiHeart className="text-red-500" /> Liked Songs</h1>
      {songs.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-5xl mb-4">💔</p>
          <p>No liked songs yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {songs.map((song, index) => (
            <SongCard key={song.id} song={song} list={songs} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}