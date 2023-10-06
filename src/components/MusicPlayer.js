import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Slider, Typography, Tooltip } from '@mui/material';
import {
  AddCircleOutline,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
} from '@mui/icons-material';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(new Audio());
  const fileInputRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackName, setCurrentTrackName] = useState('');

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (event, newValue) => {
    audioRef.current.volume = newValue;
    setVolume(newValue);
  };

  const addToPlaylist = (file) => {
    const newPlaylist = [...playlist, file];
    setPlaylist(newPlaylist);
  };

  const removeFromPlaylist = (index) => {
    const newPlaylist = [...playlist];
    newPlaylist.splice(index, 1);
    setPlaylist(newPlaylist);
  };

  const playAudio = (index) => {
    setCurrentTrackIndex(index);
    const file = playlist[index];
    audioRef.current.src = URL.createObjectURL(file);
    audioRef.current.load();
    audioRef.current.play();
    setIsPlaying(true);
    setCurrentTrackName(file.name);
  };

  const handlePreviousTrack = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    playAudio(newIndex);
  };

  const handleNextTrack = () => {
    const newIndex = currentTrackIndex < playlist.length - 1 ? currentTrackIndex + 1 : 0;
    playAudio(newIndex);
  };

  const handleSeekBarChange = (event, newValue) => {
    setCurrentTime(newValue);
    audioRef.current.currentTime = newValue;
  };

  return (
    <Box sx={{ textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Music Player
      </Typography>
      <input
        type="file"
        accept="audio/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            addToPlaylist(file);
          }
        }}
      />
      <Button variant="contained" onClick={() => fileInputRef.current.click()}>
        <AddCircleOutline /> Add Song
      </Button>
      <Box sx={{ textAlign: 'left', margin: '16px' }}>
        <Typography variant="h6" gutterBottom>
          Playlist
        </Typography>
        <ul>
          {playlist.map((file, index) => (
            <li key={index}>
              {file.name}{' '}
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => removeFromPlaylist(index)}
              >
                Remove
              </Button>{' '}
              <Button variant="outlined" size="small" onClick={() => playAudio(index)}>
                Play
              </Button>
            </li>
          ))}
        </ul>
      </Box>
      <Slider
        value={volume}
        onChange={handleVolumeChange}
        step={0.01}
        min={0}
        max={1}
        aria-label="Volume"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <Button variant="contained" onClick={handlePreviousTrack}>
          <SkipPrevious /> Previous
        </Button>
        <Button variant="contained" onClick={togglePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />} {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="contained" onClick={handleNextTrack}>
          Next <SkipNext />
        </Button>
      </Box>
      <Tooltip
        title={`${currentTrackName} - ${formatTime(currentTime)} / ${formatTime(duration)}`}
      >
        <Slider
          value={currentTime}
          max={duration}
          onChange={handleSeekBarChange}
          step={0.1}
          aria-label="Song Progress"
        />
      </Tooltip>
      <Typography variant="body2" gutterBottom>
        {currentTrackName}
      </Typography>
    </Box>
  );
}

export default MusicPlayer;

// Helper function to format time in HH:MM:SS format
function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
