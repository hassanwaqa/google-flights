import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';

const Sidebar = ({ open, onClose }) => {
  const menuItems = [
    { text: 'Travel', isHeader: true },
    { text: 'Flights', icon: <FlightIcon />, active: true },
    { text: 'Hotels', icon: <HotelIcon /> },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundColor: '#202124',
          color: '#e8eaed',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            fontSize: '20px',
            color: '#e8eaed',
            mb: 2,
          }}
        >
          Google
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {menuItems.map((item, index) =>
          item.isHeader ? (
            <Box key={index} sx={{ px: 3, py: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#9aa0a6',
                  fontSize: '11px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                }}
              >
                {item.text}
              </Typography>
            </Box>
          ) : (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={item.active}
                sx={{
                  py: 1.5,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(138, 180, 248, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(138, 180, 248, 0.16)',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: item.active ? '#8ab4f8' : '#9aa0a6',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: item.active ? 500 : 400,
                    color: item.active ? '#8ab4f8' : '#e8eaed',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;

