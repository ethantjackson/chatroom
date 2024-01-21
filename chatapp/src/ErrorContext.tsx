import { Alert, Snackbar } from '@mui/material';
import { ReactNode, createContext, useContext, useState } from 'react';

interface ErrorContextProps {
  children: ReactNode;
}

const ErrorContext = createContext({
  showError: (message: string) => {},
});

export const ErrorProvider = ({ children }: ErrorContextProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  const showError = (message: string) => {
    setError(message);
    setIsOpen(true);
  };

  return (
    <>
      <Snackbar
        open={isOpen}
        autoHideDuration={6000}
        onClose={() => {
          setIsOpen(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity='warning'
          onClose={() => {
            setIsOpen(false);
          }}
        >
          {error}
        </Alert>
      </Snackbar>
      <ErrorContext.Provider value={{ showError }}>
        {children}
      </ErrorContext.Provider>
    </>
  );
};

export const useError = () => useContext(ErrorContext);
