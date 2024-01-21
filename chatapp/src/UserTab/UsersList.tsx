import { Box, Typography, styled } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import React, { useEffect, useState } from 'react';
import { IUser } from '../AuthContext';

const UserBox = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.primary.main,
  padding: '6px 8px',
  borderRadius: '32px',
}));

const UsersList = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_WEBSERVER_URL || ''}/user/all-users`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message);
        } else {
          setUsers([...data.users]);
        }
      })
      .catch((err) => {
        console.error('Error while fetching all users: ', err);
      });
  }, []);

  return (
    <Box p={3}>
      {users.map((user) => (
        <Box key={user.username}>
          <UserBox mb={1}>
            <Typography variant='body2'>
              {user.username}
              <CircleIcon
                sx={{
                  fontSize: '12px',
                  marginLeft: '4px',
                  position: 'relative',
                  top: '1.5px',
                }}
              />
            </Typography>
          </UserBox>
        </Box>
      ))}
    </Box>
  );
};

export default UsersList;
