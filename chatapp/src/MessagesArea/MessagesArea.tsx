import { Box, Typography, styled } from '@mui/material';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import React from 'react';

const mockMessages = [
  {
    username: 'chetbaker',
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quas, adipisci porro repellat recusandae nobis ab, laborum quo doloribus autem ullam numquam dolore ea, assumenda quisquam voluptatem. Veniam, ab dicta!',
  },
  {
    username: 'milesdavis',
    message: 'I play trumpet.',
  },
  {
    username: 'clarkterry',
    message:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure corrupti deserunt labore vero aut culpa, ratione officia. Quos laboriosam consectetur porro dignissimos similique aperiam doloremque delectus! Voluptatum nobis beatae consequuntur. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo rem cupiditate inventore eius molestias expedita. Est, fuga minima ab quo doloribus esse quia itaque ea exercitationem maxime, corrupti natus magni?',
  },
  {
    username: 'chetbaker',
    message:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam, inventore. Eaque ut temporibus illum fugiat quos quaerat, id odio debitis maxime facere reiciendis quasi. Praesentium necessitatibus tempora dolorum aspernatur mollitia!',
  },
  {
    username: 'kennydorham',
    message:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore accusamus aliquam deleniti sequi quam quis quo unde velit, cupiditate, eius aut rem eos, quisquam voluptate magni maxime? Explicabo, ab doloribus.',
  },
];

const mockUsername = 'chetbaker';

const MessageBubble = styled(Box)({
  textAlign: 'left',
  display: 'inline-block',
  maxWidth: '60%',
  borderRadius: '24px',
  padding: '12px 22px',
  boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
});

const MessagesArea = () => {
  return (
    <Box p={2}>
      {mockMessages.map(({ username, message }, index) => (
        <Box
          key={username + index}
          sx={{
            display: 'flex',
            justifyContent: username === mockUsername ? 'right' : 'left',
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
              order: username === mockUsername ? '0' : '1',
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
                username === mockUsername
                  ? theme.palette.primary.light
                  : theme.palette.background.paper,
            }}
          >
            <Typography
              variant='body2'
              color={username === mockUsername ? 'secondary' : 'primary'}
              sx={{ fontWeight: 'bold' }}
            >
              {username}
            </Typography>
            <Typography>{message}</Typography>
          </MessageBubble>
        </Box>
      ))}
    </Box>
  );
};

export default MessagesArea;
