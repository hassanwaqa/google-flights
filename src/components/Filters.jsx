import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Filters = ({ onFiltersChange }) => {
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 1000]);

  const handlePriceClick = () => {
    setPriceDialogOpen(true);
  };

  const handlePriceClose = () => {
    setPriceDialogOpen(false);
    setPriceRange(appliedPriceRange);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceApply = () => {
    setAppliedPriceRange(priceRange);
    setPriceDialogOpen(false);
    
    if (onFiltersChange) {
      onFiltersChange({
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });
    }
  };

  const handlePriceClear = () => {
    setPriceRange([0, 1000]);
    setAppliedPriceRange([0, 1000]);
    setPriceDialogOpen(false);
    
    if (onFiltersChange) {
      onFiltersChange({
        minPrice: 0,
        maxPrice: 1000,
      });
    }
  };

  const isPriceFiltered = appliedPriceRange[0] !== 0 || appliedPriceRange[1] !== 1000;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        py: 2,
        px: { xs: 2, sm: 3, md: 4 },
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        flexWrap: 'wrap',
      }}
    >
      <Button
        variant="outlined"
        onClick={handlePriceClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          borderRadius: '20px',
          textTransform: 'none',
          color: isPriceFiltered ? '#8ab4f8' : '#e8eaed',
          borderColor: isPriceFiltered ? '#8ab4f8' : 'rgba(255, 255, 255, 0.23)',
          backgroundColor: isPriceFiltered ? 'rgba(138, 180, 248, 0.12)' : 'transparent',
          px: 2,
          py: 0.75,
          fontSize: '14px',
          fontWeight: 500,
          '&:hover': {
            borderColor: isPriceFiltered ? '#8ab4f8' : 'rgba(255, 255, 255, 0.4)',
            backgroundColor: isPriceFiltered ? 'rgba(138, 180, 248, 0.16)' : 'rgba(255, 255, 255, 0.08)',
          },
        }}
      >
        Price
        {isPriceFiltered && ` ($${appliedPriceRange[0]}-$${appliedPriceRange[1]})`}
      </Button>

      <Dialog
        open={priceDialogOpen}
        onClose={handlePriceClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#303134',
            backgroundImage: 'none',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#e8eaed',
            fontSize: '20px',
            fontWeight: 500,
            pb: 1,
          }}
        >
          Price
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ px: 2, py: 3 }}>
            <Typography
              sx={{
                color: '#9aa0a6',
                fontSize: '14px',
                mb: 3,
                textAlign: 'center',
              }}
            >
              ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
              valueLabelFormat={(value) => `$${value}`}
              sx={{
                color: '#8ab4f8',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#8ab4f8',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(138, 180, 248, 0.16)',
                  },
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#8ab4f8',
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: 'rgba(255, 255, 255, 0.23)',
                },
                '& .MuiSlider-valueLabel': {
                  backgroundColor: '#8ab4f8',
                  color: '#202124',
                  fontWeight: 500,
                },
              }}
            />
            
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              <Typography sx={{ color: '#9aa0a6', fontSize: '12px' }}>
                $0
              </Typography>
              <Typography sx={{ color: '#9aa0a6', fontSize: '12px' }}>
                $1000
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={handlePriceClear}
            sx={{
              textTransform: 'none',
              color: '#8ab4f8',
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(138, 180, 248, 0.08)',
              },
            }}
          >
            Clear
          </Button>
          <Button
            onClick={handlePriceApply}
            variant="contained"
            sx={{
              textTransform: 'none',
              backgroundColor: '#8ab4f8',
              color: '#202124',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '20px',
              px: 3,
              '&:hover': {
                backgroundColor: '#a8c7fa',
              },
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Filters;

