import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Slider, Typography, Tooltip, IconButton } from '@mui/material';
import {
  AddCircleOutline,
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  VolumeDown,
  VolumeUp,
} from '@mui/icons-material';
import './MusicPlayer.css'
import AudioVisualizer from './AudioVisualizer';



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
      <Typography color={'white'} className='mainTitle' variant="h4" gutterBottom>
        Music Player
      </Typography>
      <AudioVisualizer audioRef={audioRef} />
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
      <Button className='addSong' style={{backgroundColor: '#0080809d', width: '450px', marginLeft: '-22px'}} variant="contained" onClick={() => fileInputRef.current.click()}>
        <AddCircleOutline /> Add Song
      </Button>
      <Box sx={{ textAlign: 'left', margin: '16px', backgroundColor: '#0080809d', borderRadius: '10px', width: '450px', marginLeft: '-25px' }} >
        <Typography className='playlist' variant="h6" gutterBottom color={'white'}>
          Playlist
        </Typography>
        <ul style={{color: 'white', textAlign: 'left'}}>
          {playlist.map((file, index) => (
            <li style={{padding:'5px'}} key={index} >
              {file.name}{' '}
              <Button style={{backgroundColor: '#510400', color: 'white', height:'30px', fontSize: 'small'}} 

                onClick={() => removeFromPlaylist(index)}
              >
                Remove
              </Button>{' '}
              <Button style={{backgroundColor: '#023020', color: 'white', height:'30px', fontSize: 'small'}}  onClick={() => playAudio(index)}>
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
  sx={{
    display: 'flex',
    alignItems: 'center',
    '& .MuiSlider-rail': {
      backgroundColor: '#0080809d', // Change the rail color here
    },
    '& .MuiSlider-track': {
      backgroundColor: '#0080809d', // Change the track color here
    },
    '& .MuiSlider-thumb': {
      backgroundColor: '#0080809d', // Change the thumb color here
    },
  }}
>
  <VolumeDown />
  <Slider
    value={volume}
    onChange={handleVolumeChange}
    step={0.01}
    min={0}
    max={1}
    aria-label="Volume"
    sx={{ flexGrow: 1 }}
  />
  <VolumeUp />
</Slider>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <IconButton onClick={handlePreviousTrack}>
          <SkipPrevious style={{color: 'white'}} />
        </IconButton>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? <Pause style={{color: 'white'}} /> : <PlayArrow style={{color: 'white'}} />}
        </IconButton>
        <IconButton onClick={handleNextTrack}>
          <SkipNext style={{color: 'white'}} />
        </IconButton>
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
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& .MuiSlider-rail': {
              backgroundColor: '#0080809d', // Change the rail color here
            },
            '& .MuiSlider-track': {
              backgroundColor: '#0080809d', // Change the track color here
            },
            '& .MuiSlider-thumb': {
              backgroundColor: '#0080809d', // Change the thumb color here
            },
          }}
        >
          <SkipPrevious />
          <Slider
            value={currentTime}
            max={duration}
            onChange={handleSeekBarChange}
            step={0.1}
            aria-label="Song Progress"
            sx={{ flexGrow: 1 }}
          />
          <SkipNext />
        </Slider>
      </Tooltip>
      <Typography color={'white'} padding={'10px'} fontSize={'20px'} width={'500px'} marginLeft={'-40px'} variant="body2" gutterBottom>
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
