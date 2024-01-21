import { Box, styled } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import React, { KeyboardEvent, useState } from 'react';
import { useSocket } from '../SocketContext';
import { useAuth } from '../AuthContext';

const Input = styled('input')({
  position: 'relative',
  top: '-7px',
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

const InputBox = styled(Box)({
  height: '64px',
  width: '64px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const MessageInput = () => {
  const { user } = useAuth();
  const { sendChatMessage } = useSocket();
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (!user) {
      return;
    }
    sendChatMessage({
      type: 'CHAT',
      content: content,
      senderId: user._id,
      senderUsername: user.username,
      votes: 0,
    });
    setContent('');
  };

  const detectEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      <Input
        placeholder={
          user == null
            ? 'Please log in to send messages'
            : 'Type your message here...'
        }
        onKeyDown={detectEnter}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
        }}
        disabled={user == null}
        sx={{
          backgroundColor: (theme) =>
            user == null
              ? theme.palette.background.default
              : theme.palette.background.paper,
          '&::placeholder': {
            color: (theme) =>
              user == null
                ? theme.palette.secondary.main
                : theme.palette.primary.main,
            fontWeight: 'bold',
          },
        }}
      />
      <InputBox
        sx={{
          backgroundColor: (theme) =>
            user == null
              ? theme.palette.background.default
              : theme.palette.background.paper,
        }}
      >
        <SendIcon
          sx={{
            color: (theme) => theme.palette.secondary.main,
            cursor: 'pointer',
            opacity: user == null ? 0.3 : 1,
          }}
          onClick={handleSend}
        />
      </InputBox>
    </>
  );
};

export default MessageInput;
