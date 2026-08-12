import { createContext, useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../api/axios';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const audioRef = useRef(new Audio());
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioData = () => setDuration(audio.duration);
    const handleEnd = () => nextSong();
    const handleErr = () => setError("Failed to load audio. Check URL or format.");

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('error', handleErr);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('error', handleErr);
    };
  }, [currentIndex, playlist]);

  const playSong = async (song, list = [], index = 0) => {
    if (!song || !song.audio_url) {
      setError("No audio URL found for this song.");
      return;
    }
    
    setError(null); // Clear previous errors
    const playList = list.length > 0 ? list : [song];
    setPlaylist(playList);
    setCurrentIndex(index);
    setCurrentSong(song);
    
    // Crucial fix: Reset audio, load new source, then play
    const audio = audioRef.current;
    audio.pause();
    audio.src = song.audio_url;
    audio.load(); // Force the browser to load the new Cloudinary URL
    
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Play error:", err);
      setError("Browser blocked playback. Click play again.");
    }

    // Increment play count
    if (user) api.post(`/songs/${song.id}/play/`).catch(() => {});
  };

  const playPlaylist = (songs, startIndex = 0) => {
    if (songs.length > 0) {
      playSong(songs[startIndex], songs, startIndex);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError("Browser blocked playback.");
    }
  };

  const nextSong = () => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex], playlist, nextIndex);
  };

  const previousSong = () => {
    if (playlist.length === 0) return;
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex], playlist, prevIndex);
  };

  const seekSong = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, togglePlay, nextSong, previousSong,
      currentTime, duration, seekSong, formatTime, playSong, playPlaylist, playlist, currentIndex, error
    }}>
      {children}
    </PlayerContext.Provider>
  );
};