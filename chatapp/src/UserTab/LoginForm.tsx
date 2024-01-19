import { Box, Typography, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import React, { useEffect, useRef, useState } from 'react';

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
  marginBottom: '8px',
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

interface LoginFormProps {
  setOpen: (val: boolean) => void;
}

const LoginForm = ({ setOpen }: LoginFormProps) => {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const formRef = useRef<Node>(null);

  useEffect(() => {
    const detectClickOut = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', detectClickOut);

    return () => {
      document.removeEventListener('mousedown', detectClickOut);
    };
  }, []);

  return (
    <Box
      ref={formRef}
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
      {isCreateAccount ? (
        <>
          <IconBox>
            <PersonIcon />
          </IconBox>
          <LoginInput placeholder='Username' />
          <IconBox>
            <KeyIcon />
          </IconBox>
          <LoginInput type='password' placeholder='Password' />
          <SubmitBtn>
            <LoginIcon />
          </SubmitBtn>
          <IconBox>
            <KeyIcon />
          </IconBox>
          <LoginInput
            type='password'
            placeholder='Confirm Passord'
            sx={{ width: 'calc(100% - 32px - 32px)' }}
          />
        </>
      ) : (
        <>
          <IconBox>
            <PersonIcon />
          </IconBox>
          <LoginInput placeholder='Username' />
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
        </>
      )}
      <Box sx={{ width: '100%', textAlign: 'center' }} mt={-0.5}>
        <Typography
          variant='caption'
          color='textSecondary'
          sx={{
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={() => {
            setIsCreateAccount(!isCreateAccount);
          }}
        >
          {isCreateAccount ? 'Use an existing account' : 'Create an account'}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
