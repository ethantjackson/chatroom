import React from 'react';
import { createTheme } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import ChatRoom from './ChatRoom/ChatRoom';
import { ErrorProvider } from './ErrorContext';
import { AuthProvider } from './AuthContext';
import { SocketProvider } from './SocketContext';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#868BBB',
      dark: '#7B7EAE',
      light: '#EAF0F4',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00CACB',
    },
    info: {
      main: '#FFCD1E',
    },
    warning: {
      main: '#ff4d8e',
    },
    text: {
      primary: '#6e6e6e',
      secondary: '#e7e7e7',
    },
    background: {
      default: '#DAE3EC',
      paper: '#fff',
    },
  },
};
const theme = createTheme(themeOptions);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorProvider>
        <AuthProvider>
          <SocketProvider>
            <ChatRoom />
          </SocketProvider>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}

export default App;
