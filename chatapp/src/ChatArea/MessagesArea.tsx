import { Box, Typography, styled } from '@mui/material';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react';
import { useSocket } from '../SocketContext';
import { useAuth } from '../AuthContext';

const MessageBubble = styled(Box)({
  textAlign: 'left',
  display: 'inline-block',
  maxWidth: '60%',
  borderRadius: '24px',
  padding: '12px 22px',
  boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
});

const MessagesArea = () => {
  const { user } = useAuth();
  const { messages } = useSocket();

  return (
    <Box p={2} sx={{ height: '100%', overflow: 'auto' }}>
      {messages.map(({ sender, content }, index) => (
        <Box
          key={sender.username + index}
          sx={{
            display: 'flex',
            justifyContent:
              sender.username === user?.username ? 'right' : 'left',
            alignItems: 'stretch',
            color: (theme) => theme.palette.text.primary,
          }}
          mb={3}
        >
          <Box
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              justifyContent: 'center',
              order: sender.username === user?.username ? '0' : '1',
              textAlign: 'center',
            }}
            p={1}
          >
            <UpIcon sx={{ cursor: 'pointer' }} />
            <Typography variant='body2'>10</Typography>
            <DownIcon sx={{ cursor: 'pointer' }} />
          </Box>
          <MessageBubble
            sx={{
              backgroundColor: (theme) =>
                sender.username === user?.username
                  ? theme.palette.primary.light
                  : theme.palette.background.paper,
            }}
          >
            <Typography
              variant='body2'
              color={
                sender.username === user?.username ? 'secondary' : 'primary'
              }
              sx={{ fontWeight: 'bold' }}
            >
              {sender.username}
            </Typography>
            <Typography>{content}</Typography>
          </MessageBubble>
        </Box>
      ))}
    </Box>
  );
};

export default MessagesArea;
