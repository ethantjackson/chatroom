import { Box, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import React from 'react';

const IconBox = styled(Box)(({ theme }) => ({
  height: '32px',
  width: '32px',
  backgroundColor: theme.palette.background.default,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const LoginInput = styled('input')({
  border: 'none',
  width: 'calc(100% - 32px)',
  height: '32px',
  boxSizing: 'border-box',
  marginLeft: '32px',
  '&:focus': {
    outline: 'none',
  },
  paddingLeft: '12px',
});

const SubmitBtn = styled(Box)(({ theme }) => ({
  height: '32px',
  width: '32px',
  position: 'absolute',
  right: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  cursor: 'pointer',
}));

const LoginForm = () => {
  return (
    <Box
      sx={{
        width: 'calc(100% - 24px)',
        boxSizing: 'border-box',
        position: 'absolute',
        top: '12px',
        left: '12px',
        backgroundColor: (theme) => theme.palette.primary.dark,
        padding: '8px',
      }}
    >
      <IconBox>
        <PersonIcon />
      </IconBox>
      <LoginInput placeholder='Username' sx={{ marginBottom: '8px' }} />
      <IconBox>
        <KeyIcon />
      </IconBox>
      <SubmitBtn>
        <LoginIcon />
      </SubmitBtn>
      <LoginInput
        type='password'
        placeholder='Password'
        sx={{ width: 'calc(100% - 32px - 32px)' }}
      />
    </Box>
  );
};

export default LoginForm;
