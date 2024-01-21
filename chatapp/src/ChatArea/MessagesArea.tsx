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
  const { messages, handleVote } = useSocket();

  return (
    <Box p={2} sx={{ height: '100%', overflow: 'auto' }}>
      {messages.map(
        ({ senderId, senderUsername, content, votes, _id }, index) => (
          <Box
            key={senderId + index}
            sx={{
              display: 'flex',
              justifyContent: senderId === user?._id ? 'right' : 'left',
              alignItems: 'center',
              color: (theme) => theme.palette.text.primary,
            }}
            mb={3}
          >
            <Box
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'center',
                order: senderId === user?._id ? '0' : '1',
                textAlign: 'center',
              }}
              p={1}
            >
              <UpIcon
                sx={{
                  cursor: 'pointer',
                  color: (theme) =>
                    _id && user?.upvotedChatIds.has(_id || '-1')
                      ? theme.palette.secondary.main
                      : 'inherit',
                }}
                onClick={() => {
                  if (_id && user)
                    if (user.upvotedChatIds.has(_id)) {
                      handleVote(-1, true, _id);
                    } else {
                      handleVote(
                        user.downvotedChatIds.has(_id) ? 2 : 1,
                        false,
                        _id
                      );
                    }
                }}
              />
              <Typography variant='body2'>{JSON.stringify(votes)}</Typography>
              <DownIcon
                sx={{
                  cursor: 'pointer',
                  color: (theme) =>
                    _id && user?.downvotedChatIds.has(_id || '-1')
                      ? theme.palette.secondary.main
                      : 'inherit',
                }}
                onClick={() => {
                  if (_id && user) {
                    if (user.downvotedChatIds.has(_id)) {
                      handleVote(1, true, _id);
                    } else {
                      handleVote(
                        user.upvotedChatIds.has(_id) ? -2 : -1,
                        false,
                        _id
                      );
                    }
                  }
                }}
              />
            </Box>
            <MessageBubble
              sx={{
                backgroundColor: (theme) =>
                  senderId === user?._id
                    ? theme.palette.primary.light
                    : theme.palette.background.paper,
              }}
            >
              <Typography
                variant='body2'
                color={senderId === user?._id ? 'secondary' : 'primary'}
                sx={{ fontWeight: 'bold' }}
              >
                {senderUsername}
              </Typography>
              <Typography>{content}</Typography>
            </MessageBubble>
          </Box>
        )
      )}
    </Box>
  );
};

export default MessagesArea;
