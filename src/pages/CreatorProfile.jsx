import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import SongCard from '../components/SongCard';
import { PlayerContext } from '../context/PlayerContext';
import { HiPlay } from 'react-icons/hi';

export default function CreatorProfile() {
  const { username } = useParams();
  const [creatorData, setCreatorData] = useState(null);
  const { playPlaylist } = useContext(PlayerContext);

  useEffect(() => {
    api.get(`/users/${username}/songs/`).then(res => setCreatorData(res.data));
  }, [username]);

  if (!creatorData) return <div className="pt-24 text-center text-gray-400">Loading...</div>;

  return (
    <div className="pt-24 pb-32 max-w-5xl mx-auto px-4">
      <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 mb-8 flex flex-col md:flex-row items-center gap-8">
        <img src={creatorData.user.profile_image_url || `https://ui-avatars.com/api/?name=${username}&background=7c3aed&color=fff`} className="w-28 h-28 rounded-full border-4 border-purple-600" />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">{creatorData.user.username}</h1>
          <p className="text-gray-400 mb-4">{creatorData.user.bio || 'No bio yet.'}</p>
          <div className="flex gap-6 text-sm text-gray-300 mb-4">
            <span><strong className="text-white">{creatorData.total_songs}</strong> Songs</span>
            <span><strong className="text-white">{creatorData.total_plays}</strong> Plays</span>
            <span><strong className="text-white">{creatorData.total_likes}</strong> Likes</span>
          </div>
          {creatorData.songs.length > 0 && (
            <button onClick={() => playPlaylist(creatorData.songs, 0)} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 mx-auto md:mx-0">
              <HiPlay /> Play All
            </button>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">{username}'s Songs</h2>
      <div className="grid gap-3">
        {creatorData.songs.map((song, index) => (
          <SongCard key={song.id} song={song} list={creatorData.songs} index={index} />
        ))}
      </div>
    </div>
  );
}