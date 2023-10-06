import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function Playlist({ songs, onRemove }) {
  return (
    <Box sx={{ textAlign: 'left', margin: '16px' }}>
      <Typography variant="h6" gutterBottom>
        Playlist
      </Typography>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            {song.title}{' '}
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => onRemove(index)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
}

export default Playlist;
