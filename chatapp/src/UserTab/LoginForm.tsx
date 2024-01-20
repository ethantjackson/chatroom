import { Box, Typography, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import LoginIcon from '@mui/icons-material/Login';
import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useAuth } from '../AuthContext';

const FormContainer = styled(Box)(({ theme }) => ({
  width: 'calc(100% - 24px)',
  boxSizing: 'border-box',
  position: 'absolute',
  top: '12px',
  left: '12px',
  backgroundColor: theme.palette.primary.dark,
  padding: '8px',
  zIndex: '1',
}));

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
  const [formVals, setFormVals] = useState({
    regUsername: '',
    regPassword: '',
    regConfirmPassword: '',
    loginUsername: '',
    loginPassword: '',
  });
  const formRef = useRef<Node>(null);
  const { login } = useAuth();

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
  }, [setOpen]);

  const handleChange = (field: string, newVal: string) => {
    setFormVals({
      ...formVals,
      [field]: newVal,
    });
  };

  const detectEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!isCreateAccount) {
      const { success, message } = await login(
        formVals.loginUsername,
        formVals.loginPassword
      );
      if (!success) {
        console.log(message || 'Login failed');
      } else {
        setOpen(false);
      }
      return;
    }

    if (formVals.regPassword !== formVals.regConfirmPassword) {
      console.log('mismatched passwords');
      return;
    }
    try {
      const res = await fetch('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formVals.regUsername,
          password: formVals.regPassword,
        }),
      });
      if (!res.ok) {
        console.log('Could not register');
        return;
      }
      console.log('Account created successfully');
      setIsCreateAccount(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormContainer ref={formRef}>
      {isCreateAccount ? (
        <>
          <IconBox>
            <PersonIcon />
          </IconBox>
          <LoginInput
            placeholder='Username'
            value={formVals.regUsername}
            onChange={(e) => {
              handleChange('regUsername', e.target.value);
            }}
            onKeyDown={detectEnter}
          />
          <IconBox>
            <KeyIcon />
          </IconBox>
          <LoginInput
            type='password'
            placeholder='Password'
            value={formVals.regPassword}
            onChange={(e) => {
              handleChange('regPassword', e.target.value);
            }}
            onKeyDown={detectEnter}
          />
          <SubmitBtn onClick={handleSubmit}>
            <LoginIcon />
          </SubmitBtn>
          <IconBox>
            <KeyIcon />
          </IconBox>
          <LoginInput
            type='password'
            placeholder='Confirm Passord'
            value={formVals.regConfirmPassword}
            onChange={(e) => {
              handleChange('regConfirmPassword', e.target.value);
            }}
            onKeyDown={detectEnter}
            sx={{ width: 'calc(100% - 32px - 32px)' }}
          />
        </>
      ) : (
        <>
          <IconBox>
            <PersonIcon />
          </IconBox>
          <LoginInput
            placeholder='Username'
            value={formVals.loginUsername}
            onChange={(e) => {
              handleChange('loginUsername', e.target.value);
            }}
            onKeyDown={detectEnter}
          />
          <IconBox>
            <KeyIcon />
          </IconBox>
          <SubmitBtn onClick={handleSubmit}>
            <LoginIcon />
          </SubmitBtn>
          <LoginInput
            type='password'
            placeholder='Password'
            value={formVals.loginPassword}
            onChange={(e) => {
              handleChange('loginPassword', e.target.value);
            }}
            onKeyDown={detectEnter}
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
    </FormContainer>
  );
};

export default LoginForm;
