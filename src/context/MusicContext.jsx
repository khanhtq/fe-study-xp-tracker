import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getSuggestedPlaylists, searchMusicTracks, getMusicStreamUrl } from '../api';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const iframeRef = useRef(null);
  const streamRequestRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('study_music_volume');
    return saved !== null ? parseFloat(saved) : 0.7;
  });
  const [isMuted, setIsMuted] = useState(false);
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoadingStream, setIsLoadingStream] = useState(false);
  const [audioError, setAudioError] = useState(null);

  const [isMinimized, setIsMinimized] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);

  // Embed fallback: when direct stream fails, use hidden YouTube iframe
  const [useEmbedFallback, setUseEmbedFallback] = useState(false);

  // The iframe fallback does not emit HTMLAudioElement timeupdate events. Keep the
  // UI clock moving from the known track duration while YouTube plays normally.
  useEffect(() => {
    if (!useEmbedFallback || !isPlaying) return undefined;

    const intervalId = window.setInterval(() => {
      setCurrentTime((time) => {
        const nextTime = time + 0.25;
        return duration > 0 ? Math.min(nextTime, duration) : nextTime;
      });
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [useEmbedFallback, isPlaying, duration]);

  // Initialize & Listen to Audio Element Events
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleAutoNext();
    const handleError = () => {
      // If direct stream fails during playback, try YouTube embed fallback
      if (!useEmbedFallback && currentTrack) {
        console.warn('Direct audio stream failed, switching to YouTube embed fallback');
        setUseEmbedFallback(true);
        setAudioError(null);
        setIsPlaying(true);
      } else {
        setAudioError('Không thể phát bài này. Đang chuyển bài tiếp...');
        setIsPlaying(false);
        // Auto-skip to next after 2 seconds
        setTimeout(() => handleAutoNext(), 2000);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentIndex, playlist, volume, isMuted, useEmbedFallback, currentTrack]);

  // Load Suggested Playlists on Mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoadingPlaylists(true);
      try {
        const data = await getSuggestedPlaylists();
        setPlaylists(data || []);
      } catch (err) {
        console.error('Failed to load suggested playlists:', err);
      } finally {
        setIsLoadingPlaylists(false);
      }
    };
    fetchPlaylists();
  }, []);

  const currentTrackRef = useRef(currentTrack);
  const playlistRef = useRef(playlist);
  const playlistsRef = useRef(playlists);

  useEffect(() => {
    currentTrackRef.current = currentTrack;
    playlistRef.current = playlist;
    playlistsRef.current = playlists;
  }, [currentTrack, playlist, playlists]);

  const handleAutoNext = useCallback(() => {
    const activeTrack = currentTrackRef.current;
    const activePlaylist = playlistRef.current;
    const allPlaylists = playlistsRef.current;

    let candidateTracks = [];

    // 1. Tìm các bài cùng chủ đề trong playlist hiện tại (loại bỏ bài đang phát)
    if (activePlaylist && activePlaylist.length > 0) {
      candidateTracks = activePlaylist.filter(
        (t) => !activeTrack || t.id !== activeTrack.id
      );
    }

    // 2. Nếu playlist hiện tại không có bài khác (VD: phát 1 bài đơn lẻ), tìm trong danh mục tương ứng của preset
    if (candidateTracks.length === 0 && allPlaylists && allPlaylists.length > 0) {
      const matchingPlaylist = allPlaylists.find(
        (pl) => pl.tracks && pl.tracks.some((t) => activeTrack && t.id === activeTrack.id)
      ) || allPlaylists[0];

      if (matchingPlaylist && matchingPlaylist.tracks) {
        candidateTracks = matchingPlaylist.tracks.filter(
          (t) => !activeTrack || t.id !== activeTrack.id
        );
      }
    }

    // 3. Fallback: Nếu vẫn chưa có candidate, chọn bất kỳ bài khác bài hiện tại
    if (candidateTracks.length === 0 && allPlaylists && allPlaylists.length > 0) {
      const allTracks = allPlaylists.flatMap((pl) => pl.tracks || []);
      candidateTracks = allTracks.filter((t) => !activeTrack || t.id !== activeTrack.id);
    }

    if (candidateTracks.length === 0) return;

    // Chọn ngẫu nhiên 1 bài cùng chủ đề nhưng khác bài hiện tại
    const randomTrack = candidateTracks[Math.floor(Math.random() * candidateTracks.length)];
    const targetPlaylist = activePlaylist && activePlaylist.length > 0 ? activePlaylist : [randomTrack];
    const newIdx = targetPlaylist.findIndex((t) => t.id === randomTrack.id);

    playTrack(randomTrack, targetPlaylist, newIdx >= 0 ? newIdx : 0);
  }, []);

  // Update Volume
  const setVolume = (val) => {
    const newVol = Math.max(0, Math.min(1, val));
    setVolumeState(newVol);
    localStorage.setItem('study_music_volume', newVol.toString());
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVol;
    }
    // Update iframe volume if in embed mode
    if (useEmbedFallback && iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [Math.round(newVol * 100)] }),
          '*'
        );
      } catch (e) { /* cross-origin, ignore */ }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      // Mute/unmute iframe if in embed mode
      if (useEmbedFallback && iframeRef.current) {
        try {
          const func = next ? 'mute' : 'unMute';
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func, args: [] }),
            '*'
          );
        } catch (e) { /* cross-origin, ignore */ }
      }
      return next;
    });
  };

  // Play a Specific Track
  const playTrack = async (track, newPlaylist = null, index = 0) => {
    if (!track || !track.id) return;

    // Ignore an older request if the listener selects another track before it ends.
    streamRequestRef.current?.abort();
    const controller = new AbortController();
    streamRequestRef.current = controller;

    setAudioError(null);
    setUseEmbedFallback(false);
    setIsLoadingStream(true);
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.durationSeconds || 0);

    if (newPlaylist) {
      setPlaylist(newPlaylist);
      setCurrentIndex(index);
    }

    try {
      // 1. Try getting direct stream URL from backend proxy
      const streamData = await getMusicStreamUrl(track.id, { signal: controller.signal });
      if (streamRequestRef.current !== controller) return;
      const streamUrl = streamData?.streamUrl;

      if (streamUrl) {
        // Direct audio stream available — use HTML5 Audio
        const audio = audioRef.current;
        audio.src = streamUrl;
        audio.volume = isMuted ? 0 : volume;

        await audio.play();
        setIsPlaying(true);
      } else {
        // No direct stream — fallback to YouTube embed iframe
        console.info(`No direct stream for ${track.id}, using YouTube embed fallback`);
        audioRef.current.pause();
        audioRef.current.src = '';
        setUseEmbedFallback(true);
        setIsPlaying(true);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error fetching stream:', err);
      // Fallback to embed on any error
      audioRef.current.pause();
      audioRef.current.src = '';
      setUseEmbedFallback(true);
      setIsPlaying(true);
    } finally {
      if (streamRequestRef.current === controller) {
        setIsLoadingStream(false);
      }
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!currentTrack) {
      // Default to playing first track of first playlist
      if (playlists.length > 0 && playlists[0].tracks.length > 0) {
        playTrack(playlists[0].tracks[0], playlists[0].tracks, 0);
      }
      return;
    }

    if (useEmbedFallback && iframeRef.current) {
      try {
        const func = isPlaying ? 'pauseVideo' : 'playVideo';
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func, args: [] }),
          '*'
        );
        setIsPlaying(!isPlaying);
      } catch (e) {
        console.warn('Embed control failed:', e);
      }
      return;
    }

    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  // Next Track
  const nextTrack = () => {
    handleAutoNext();
  };

  // Previous Track
  const prevTrack = () => {
    if (playlist.length === 0) return;
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIdx);
    playTrack(playlist[prevIdx], playlist, prevIdx);
  };

  // Seek
  const seekTo = (seconds) => {
    if (useEmbedFallback && iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
          '*'
        );
        setCurrentTime(seconds);
      } catch (e) { /* ignore */ }
      return;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Play an entire Playlist
  const playPlaylist = (pl) => {
    if (pl && pl.tracks && pl.tracks.length > 0) {
      playTrack(pl.tracks[0], pl.tracks, 0);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        currentTrack,
        playlist,
        currentIndex,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        duration,
        currentTime,
        seekTo,
        isLoadingStream,
        audioError,
        playlists,
        isLoadingPlaylists,
        playTrack,
        playPlaylist,
        togglePlay,
        nextTrack,
        prevTrack,
        isMinimized,
        setIsMinimized,
        isModalOpen,
        setIsModalOpen,
        useEmbedFallback,
        iframeRef,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
