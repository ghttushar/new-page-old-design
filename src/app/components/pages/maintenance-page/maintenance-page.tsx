import { WrenchIcon } from '@phosphor-icons/react';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f3f5fa',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Box
        sx={{
          bgcolor: '#fff',
          borderRadius: '1.2rem',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
          p: '4rem 4rem',
          maxWidth: '44rem',
          width: '90%',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '8rem',
            height: '8rem',
            bgcolor: '#f7edfe',
            borderRadius: '50%',
            mb: '2.5rem',
          }}
        >
          <WrenchIcon size={40} weight="fill" color="#77469b" />
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#23272d',
            mb: '1.5rem',
            letterSpacing: '-0.03em',
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.2,
          }}
        >
          Website Under Maintenance
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: '1.4rem',
            fontWeight: 400,
            color: '#474747',
            lineHeight: 1.7,
            mb: '3rem',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          We're sprucing things up behind the scenes.<br />
          Please try again in some time.
        </Typography>

        <Button
          variant="contained"
          disableTouchRipple
          onClick={() => window.location.reload()}
          sx={{
            bgcolor: '#77469b',
            color: '#fff',
            textTransform: 'none',
            borderRadius: '0.8rem',
            px: '3rem',
            py: '1rem',
            fontSize: '1.4rem',
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#9551ab',
              boxShadow: 'none',
            },
          }}
        >
          Refresh Page
        </Button>
      </Box>
    </Box>
  );
};

export default MaintenancePage;
