import React, { useState } from 'react';
import UserTab from '../UserTab/UserTab';
import { Box, Grid, Typography, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MessagesArea from '../ChatArea/MessagesArea';
import MessageInput from '../ChatArea/MessageInput';

const UserTabBtn = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '82px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const ChatRoom = () => {
  const [isUserTabOpen, setIsUserTabOpen] = useState(true);

  return (
    <Grid
      container
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        overflowY: 'hidden',
        height: '100vh',
      }}
    >
      <Grid item xs={isUserTabOpen ? 9 : 12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            height: '82px',
            backgroundColor: (theme) => theme.palette.primary.light,
          }}
        >
          <Box m={2}>
            <Typography
              variant='h3'
              color='secondary'
              sx={{ display: 'inline' }}
            >
              Chat
            </Typography>
            <Typography
              variant='h3'
              color='primary'
              ml={1}
              sx={{ display: 'inline' }}
            >
              App
            </Typography>
          </Box>
          {!isUserTabOpen && (
            <UserTabBtn
              onClick={() => {
                setIsUserTabOpen(true);
              }}
            >
              <PersonIcon />
            </UserTabBtn>
          )}
        </Box>
        <Box
          sx={{
            height: 'calc(100vh - 82px - 64px)',
            boxShadow: 'inset -2px 2px 11px rgba(0, 0, 0, 0.1)',
          }}
        >
          <MessagesArea />
        </Box>
        <MessageInput />
      </Grid>
      {isUserTabOpen && (
        <Grid item xs={3}>
          <UserTab isOpen={isUserTabOpen} setIsOpen={setIsUserTabOpen} />
        </Grid>
      )}
    </Grid>
  );
};

export default ChatRoom;
