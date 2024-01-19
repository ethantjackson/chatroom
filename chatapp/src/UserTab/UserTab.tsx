import { Box, Grid, Typography, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import LoginForm from './LoginForm';

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
  const [isSignedIn, setIsSignedIn] = useState(false);
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
            {isSignedIn ? 'Hi, Ethan Jackson' : 'Hello!'}
          </Typography>
          <Typography
            variant='caption'
            sx={{
              cursor: 'pointer',
              textAlign: 'center',
              color: '#e7e7e7',
              textDecoration: 'underline',
            }}
            onClick={() => {
              setShowLoginForm(true);
            }}
          >
            {isSignedIn ? 'logout' : 'login'}
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
        {showLoginForm && <LoginForm />}
        users panel
      </Box>
    </TabContainer>
  );
};

export default UserTab;
