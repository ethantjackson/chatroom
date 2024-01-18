import { Box, Grid, Typography, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';

const TabContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  height: '100vh',
}));

const PrimaryGridItem = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  justifyContnt: 'center',
  height: '100%',
  cursor: 'pointer',
});

interface UserTabProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

const UserTab = ({ isOpen, setIsOpen }: UserTabProps) => {
  if (!isOpen)
    return (
      <PrimaryGridItem
        sx={{
          backgroundColor: (theme) => theme.palette.primary.light,
          color: (theme) => theme.palette.primary.contrastText,
          height: '82px',
        }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <PersonIcon sx={{ margin: 'auto' }} />
      </PrimaryGridItem>
    );
  return (
    <TabContainer sx={{ display: isOpen ? 'block' : 'none' }}>
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
            backgroundColor: (theme) => theme.palette.primary.main,
          }}
        >
          <Typography sx={{ margin: 'auto' }}>User Name</Typography>
        </PrimaryGridItem>
        <PrimaryGridItem
          item
          xs={3}
          sx={{
            backgroundColor: (theme) => theme.palette.primary.light,
          }}
          onClick={() => {
            setIsOpen(false);
          }}
        >
          <PersonIcon sx={{ margin: 'auto' }} />
        </PrimaryGridItem>
      </Grid>
    </TabContainer>
  );
};

export default UserTab;
