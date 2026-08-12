import { useContext, useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { HiPlay, HiPause, HiSwitchHorizontal, HiFastForward } from 'react-icons/hi';

export default function MusicPlayer() {
  const { currentSong, isPlaying, togglePlay, nextSong, previousSong, currentTime, duration, seekSong, formatTime, playlist, currentIndex } = useContext(PlayerContext);

  if (!currentSong) return null;

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-950 border-t border-gray-800 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Song Info */}
        <div className="flex items-center gap-3 w-1/4 min-w-[150px]">
          <img src={currentSong.cover_image || 'https://via.placeholder.com/50'} alt="cover" className="w-12 h-12 rounded-lg object-cover" />
          <div className="truncate">
            <p className="text-sm font-bold text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentSong.artist_name}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-2/4">
          <div className="flex items-center gap-6 mb-2">
            <button onClick={previousSong} className="text-gray-400 hover:text-white"><HiSwitchHorizontal size={20} /></button>
            <button onClick={togglePlay} className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform">
              {isPlaying ? <HiPause size={24} /> : <HiPlay size={24} className="ml-0.5" />}
            </button>
            <button onClick={nextSong} className="text-gray-400 hover:text-white"><HiFastForward size={20} /></button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="w-full bg-gray-700 rounded-full h-1 cursor-pointer relative group" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              seekSong((x / rect.width) * duration);
            }}>
              <div className="bg-purple-500 h-1 rounded-full group-hover:bg-purple-400 transition-colors" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="hidden md:block text-right w-1/4 text-xs text-gray-400">
          {playlist.length > 0 && <p>Playing {currentIndex + 1} of {playlist.length}</p>}
        </div>
      </div>
    </div>
  );
}