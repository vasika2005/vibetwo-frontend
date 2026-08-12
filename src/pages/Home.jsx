import { useState, useEffect } from 'react';
import api from '../api/axios';
import SongCard from '../components/SongCard';
import { HiSearch } from 'react-icons/hi';

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const res = await api.get(`/songs/${search ? `?search=${search}` : ''}`);
    setSongs(res.data.results || res.data);
  };

  return (
    <div className="pt-24 pb-32 max-w-5xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
        Share Your Sound. Discover New Vibes.
      </h1>

      <div className="relative mb-8">
        <HiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search songs, artists, or creators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchSongs()}
          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {songs.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-5xl mb-4">🎵</p>
          <p className="text-xl">No songs found. Be the first to upload!</p>
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