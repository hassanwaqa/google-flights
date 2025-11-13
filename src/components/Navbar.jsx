import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FlightIcon from '@mui/icons-material/Flight';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import AppsIcon from '@mui/icons-material/Apps';

const Navbar = ({ onMenuClick }) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#202124',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 400,
              fontSize: { xs: '18px', sm: '20px' },
              color: '#e8eaed',
            }}
          >
            Google
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.5,
            backgroundColor: 'rgba(138, 180, 248, 0.12)',
            borderRadius: '24px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(138, 180, 248, 0.16)',
            },
          }}
        >
          <FlightIcon sx={{ color: '#8ab4f8', fontSize: '20px' }} />
          <Typography
            sx={{
              color: '#8ab4f8',
              fontSize: '14px',
              fontWeight: 500,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Flights
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            color="inherit"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <Brightness4Icon />
          </IconButton>
          
          <IconButton
            color="inherit"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <AppsIcon />
          </IconButton>
          
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#8ab4f8',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            H
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

