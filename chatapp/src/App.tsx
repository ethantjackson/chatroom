import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme } from '@mui/material';
import { ThemeOptions } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import ChatRoom from './ChatRoom/ChatRoom';

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#7B7EAE',
      light: '#868BBB',
      dark: '#576B90',
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
      primary: '#303030',
      secondary: '#00CACB',
      disabled: '#7e7e7e',
    },
    background: {
      default: '#EEF3F7',
      paper: '#fff',
    },
  },
};
const theme = createTheme(themeOptions);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='' element={<ChatRoom />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
