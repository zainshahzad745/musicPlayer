import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

function AddToPlaylistForm({ onAdd }) {
  const [newSongUrl, setNewSongUrl] = useState('');

  const handleAddSong = () => {
    // Assuming newSongUrl is a SoundCloud URL
    onAdd({ title: 'Custom Song', src: newSongUrl });
    setNewSongUrl('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '16px',
      }}
    >
      <TextField
        type="text"
        placeholder="Enter SoundCloud URL"
        variant="outlined"
        size="small"
        value={newSongUrl}
        onChange={(e) => setNewSongUrl(e.target.value)}
      />
      <Button variant="contained" onClick={handleAddSong}>
        Add to Playlist
      </Button>
    </Box>
  );
}

export default AddToPlaylistForm;
