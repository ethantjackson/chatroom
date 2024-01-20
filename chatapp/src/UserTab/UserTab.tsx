import { Box, Grid, Typography, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import { useAuth } from '../AuthContext';
import UsersList from './UsersList';

const TabContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100vh',
}));

const PrimaryGridItem = styled(Grid)({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  padding: '12px 0',
});

interface UserTabProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const UserTab = ({ isOpen, setIsOpen }: UserTabProps) => {
  const { user, logout } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);

  return (
    <TabContainer
      sx={{
        backgroundColor: (theme) => theme.palette.primary.light,
      }}
    >
      <Grid
        container
        sx={{
          height: '82px',
          color: (theme) => theme.palette.primary.contrastText,
        }}
      >
        <PrimaryGridItem
          item
          xs={9}
          sx={{
            backgroundColor: (theme) => theme.palette.primary.dark,
          }}
        >
          <Typography sx={{ flexGrow: 1, textAlign: 'center', width: '100%' }}>
            {user ? `Hi, ${user.username}` : 'Hello!'}
          </Typography>
          <Typography
            variant='caption'
            color='textSecondary'
            sx={{
              cursor: 'pointer',
              textAlign: 'center',
              textDecoration: 'underline',
            }}
            onClick={() => {
              if (user) {
                logout();
              } else {
                setShowLoginForm(true);
              }
            }}
          >
            {user ? 'logout' : 'login'}
          </Typography>
        </PrimaryGridItem>
        <PrimaryGridItem
          item
          xs={3}
          sx={{
            backgroundColor: (theme) => theme.palette.primary.main,
            cursor: 'pointer',
          }}
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <PersonIcon sx={{ margin: 'auto' }} />
        </PrimaryGridItem>
      </Grid>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        {showLoginForm && <LoginForm setOpen={setShowLoginForm} />}
        <UsersList />
      </Box>
    </TabContainer>
  );
};

export default UserTab;
