import React, { useState } from 'react';
import UserTab from '../UserTab/UserTab';
import { Box, Grid, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';

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

const MessageInput = styled('input')({
  position: 'relative',
  top: '-8px',
  paddingBlock: '0',
  paddingInline: '0',
  paddingLeft: '24px',
  width: 'calc(100% - 24px - 64px)',
  height: '64px',
  border: '0',
  '&:focus': {
    outline: 'none',
  },
});

const ChatRoom = () => {
  const [isUserTabOpen, setIsUserTabOpen] = useState(false);

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
          <Box>test</Box>
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
          messages area
        </Box>
        <MessageInput placeholder='Type your message here...' />
        <Box
          sx={{
            height: '64px',
            width: '64px',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          <SendIcon
            sx={{
              color: (theme) => theme.palette.secondary.main,
              cursor: 'pointer',
            }}
          />
        </Box>
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
