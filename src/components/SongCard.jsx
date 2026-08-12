import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { HiPlay, HiHeart } from 'react-icons/hi';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function SongCard({ song, list, index }) {
  const { playSong, playPlaylist } = useContext(PlayerContext);
  const [isLiked, setIsLiked] = useState(song.is_liked);
  const [likes, setLikes] = useState(song.likes_count);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/songs/${song.id}/like/`);
      setIsLiked(res.data.liked);
      setLikes(prev => res.data.liked ? prev + 1 : prev - 1);
    } catch (err) {
      toast.error("Failed to like song");
    }
  };

  const handlePlay = () => {
    if (list && list.length > 0) {
      playPlaylist(list, index);
    } else {
      playSong(song);
    }
  };

  return (
    <div onClick={handlePlay} className="bg-gray-900/50 hover:bg-gray-800/50 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all group border border-transparent hover:border-gray-700">
      <div className="relative w-14 h-14 flex-shrink-0">
        <img src={song.cover_image || `https://picsum.photos/seed/${song.id}/100/100`} className="w-full h-full object-cover rounded-lg" alt="cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <HiPlay className="text-white text-2xl" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold truncate">{song.title}</p>
        <p className="text-gray-400 text-sm truncate">{song.artist_name} • {song.uploader_username}</p>
      </div>

      <div className="flex items-center gap-4 text-gray-400">
        <button onClick={handleLike} className="flex items-center gap-1 hover:text-purple-400 transition-colors">
          <HiHeart className={`text-xl ${isLiked ? 'text-purple-500 fill-purple-500' : ''}`} />
          <span className="text-sm">{likes}</span>
        </button>
        <span className="text-sm hidden sm:block">▶ {song.play_count}</span>
      </div>
    </div>
  );
}