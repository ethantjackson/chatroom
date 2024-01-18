import React, { useState } from 'react';
import UserTab from '../UserTab/UserTab';
import { Box, Grid, styled } from '@mui/material';

const ChatRoom = () => {
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);
  return (
    <Grid
      container
      sx={{ backgroundColor: (theme) => theme.palette.background.default }}
    >
      <Grid item xs={8}>
        left
      </Grid>
      <Grid item xs={4}>
        <UserTab isOpen={isUserTabOpen} setIsOpen={setIsUserTabOpen} />
      </Grid>
    </Grid>
  );
};

export default ChatRoom;
