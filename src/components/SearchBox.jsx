import { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Autocomplete,
  Typography,
  CircularProgress,
  Slider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import SearchIcon from '@mui/icons-material/Search';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getAllAirports, searchFlights } from '../api/flights';
import { getQueryParams, setQueryParams, buildUrlParamsFromSearch } from '../utils/urlParams';

const SearchBox = ({ onSearchResults, hasResults }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tripType, setTripType] = useState('roundtrip');
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');

  const [airportOptions, setAirportOptions] = useState([]);
  const [fromInputValue, setFromInputValue] = useState('');
  const [toInputValue, setToInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [appliedPriceRange, setAppliedPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const loadAirports = async () => {
      const airports = await getAllAirports();
      setAirportOptions(airports);
    };
    
    loadAirports();
  }, []);

  useEffect(() => {
    if (airportOptions.length === 0) return;

    const queryParams = getQueryParams();

    if (Object.keys(queryParams).length === 0) return;

    let shouldAutoSearch = false;
    let loadedFromLocation = null;
    let loadedToLocation = null;
    let loadedDepartureDate = null;
    let loadedReturnDate = null;
    let loadedTripType = 'roundtrip';
    let loadedMinPrice = 0;
    let loadedMaxPrice = 1000;

    if (queryParams.from && queryParams.fromEntityId) {
      const fromAirport = airportOptions.find(
        airport => airport.skyId === queryParams.from && airport.entityId === queryParams.fromEntityId
      );
      if (fromAirport) {
        setFromLocation(fromAirport);
        setFromInputValue(fromAirport.title || '');
        loadedFromLocation = fromAirport;
        shouldAutoSearch = true;
      }
    }

    if (queryParams.to && queryParams.toEntityId) {
      const toAirport = airportOptions.find(
        airport => airport.skyId === queryParams.to && airport.entityId === queryParams.toEntityId
      );
      if (toAirport) {
        setToLocation(toAirport);
        setToInputValue(toAirport.title || '');
        loadedToLocation = toAirport;
      }
    }

    if (queryParams.departure) {
      const depDate = dayjs(queryParams.departure);
      if (depDate.isValid()) {
        setDepartureDate(depDate);
        loadedDepartureDate = depDate;
      }
    }

    if (queryParams.return) {
      const retDate = dayjs(queryParams.return);
      if (retDate.isValid()) {
        setReturnDate(retDate);
        loadedReturnDate = retDate;
      }
    }

    if (queryParams.tripType) {
      setTripType(queryParams.tripType);
      loadedTripType = queryParams.tripType;
    }

    if (queryParams.passengers) {
      const passengerCount = parseInt(queryParams.passengers, 10);
      if (!isNaN(passengerCount)) {
        setPassengers(passengerCount);
      }
    }

    if (queryParams.cabinClass) {
      setCabinClass(queryParams.cabinClass);
    }

    if (queryParams.minPrice) {
      const minPrice = parseInt(queryParams.minPrice, 10);
      if (!isNaN(minPrice)) {
        setPriceRange(prev => [minPrice, prev[1]]);
        setAppliedPriceRange(prev => [minPrice, prev[1]]);
        loadedMinPrice = minPrice;
      }
    }

    if (queryParams.maxPrice) {
      const maxPrice = parseInt(queryParams.maxPrice, 10);
      if (!isNaN(maxPrice)) {
        setPriceRange(prev => [prev[0], maxPrice]);
        setAppliedPriceRange(prev => [prev[0], maxPrice]);
        loadedMaxPrice = maxPrice;
      }
    }

    if (shouldAutoSearch && loadedFromLocation && loadedToLocation && loadedDepartureDate) {
      if (loadedTripType === 'oneway' || (loadedTripType === 'roundtrip' && loadedReturnDate)) {
        setTimeout(async () => {
          setLoading(true);
          try {
            const searchParams = {
              originSkyId: loadedFromLocation.skyId,
              destinationSkyId: loadedToLocation.skyId,
              originEntityId: loadedFromLocation.entityId,
              destinationEntityId: loadedToLocation.entityId,
              date: loadedDepartureDate.format('YYYY-MM-DD'),
              returnDate: loadedTripType === 'roundtrip' && loadedReturnDate ? loadedReturnDate.format('YYYY-MM-DD') : undefined,
              tripType: loadedTripType || 'roundtrip',
              cabinClass: queryParams.cabinClass || 'economy',
              adults: queryParams.passengers ? parseInt(queryParams.passengers, 10) : 1,
              sortBy: 'best',
              currency: 'USD',
              market: 'en-US',
              countryCode: 'US',
              minPrice: loadedMinPrice,
              maxPrice: loadedMaxPrice,
            };

            const results = await searchFlights(searchParams);
            
            if (results.status && results.data && onSearchResults) {
              onSearchResults(results, searchParams);
            }
          } catch (error) {
            console.error('Error in auto-search:', error);
          } finally {
            setLoading(false);
          }
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [airportOptions]);

  const handleTripTypeChange = (event, newTripType) => {
    if (newTripType !== null) {
      setTripType(newTripType);
    }
  };

  const handleSwapLocations = () => {
    const tempLocation = fromLocation;
    const tempInput = fromInputValue;
    setFromLocation(toLocation);
    setFromInputValue(toInputValue);
    setToLocation(tempLocation);
    setToInputValue(tempInput);
  };

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
  };

  const handlePriceClear = () => {
    setPriceRange([0, 1000]);
    setAppliedPriceRange([0, 1000]);
    setPriceDialogOpen(false);
  };

  const handleClearAllFilters = async () => {
    setPriceRange([0, 1000]);
    setAppliedPriceRange([0, 1000]);
    
    if (!fromLocation || !toLocation || !departureDate) {
      return;
    }

    if (tripType === 'roundtrip' && !returnDate) {
      return;
    }

    setLoading(true);

    try {
      const searchParams = {
        originSkyId: fromLocation.skyId,
        destinationSkyId: toLocation.skyId,
        originEntityId: fromLocation.entityId,
        destinationEntityId: toLocation.entityId,
        date: departureDate.format('YYYY-MM-DD'),
        returnDate: tripType === 'roundtrip' && returnDate ? returnDate.format('YYYY-MM-DD') : undefined,
        tripType: tripType,
        cabinClass: cabinClass,
        adults: passengers,
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
        minPrice: 0,
        maxPrice: 1000,
      };

      const results = await searchFlights(searchParams);
      
      if (results.status && results.data) {
        if (onSearchResults) {
          onSearchResults(results, searchParams);
        }

        const urlParams = buildUrlParamsFromSearch({
          fromLocation,
          toLocation,
          departureDate,
          returnDate: tripType === 'roundtrip' ? returnDate : null,
          tripType,
          passengers,
          cabinClass,
          minPrice: 0,
          maxPrice: 1000,
        });
        
        setQueryParams(urlParams);
      }

    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPriceFiltered = appliedPriceRange[0] !== 0 || appliedPriceRange[1] !== 1000;
  const hasActiveFilters = isPriceFiltered;

  const handleSearch = async () => {
    if (!fromLocation) {
      alert('Please select a departure airport');
      return;
    }

    if (!toLocation) {
      alert('Please select a destination airport');
      return;
    }

    if (!departureDate) {
      alert('Please select a departure date');
      return;
    }

    if (tripType === 'roundtrip' && !returnDate) {
      alert('Please select a return date for round trip');
      return;
    }

    setLoading(true);

    try {
      const searchParams = {
        originSkyId: fromLocation.skyId,
        destinationSkyId: toLocation.skyId,
        originEntityId: fromLocation.entityId,
        destinationEntityId: toLocation.entityId,
        date: departureDate.format('YYYY-MM-DD'),
        returnDate: tripType === 'roundtrip' && returnDate ? returnDate.format('YYYY-MM-DD') : undefined,
        tripType: tripType,
        cabinClass: cabinClass,
        adults: passengers,
        sortBy: 'best',
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
        minPrice: appliedPriceRange[0],
        maxPrice: appliedPriceRange[1],
      };

      const results = await searchFlights(searchParams);
      
      if (results.status && results.data) {
        if (onSearchResults) {
          onSearchResults(results, searchParams);
        }

        const urlParams = buildUrlParamsFromSearch({
          fromLocation,
          toLocation,
          departureDate,
          returnDate: tripType === 'roundtrip' ? returnDate : null,
          tripType,
          passengers,
          cabinClass,
          minPrice: appliedPriceRange[0],
          maxPrice: appliedPriceRange[1],
        });
        
        setQueryParams(urlParams);
      }
      
    } catch (error) {
      console.error('Error searching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#303134',
          borderRadius: 3,
          p: { xs: 2, sm: 2.5, md: 3 },
          pb: { xs: 3, sm: 3.5, md: 4 },
          maxWidth: '975px',
          width: '100%',
          mx: 'auto',
          position: 'relative',
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 2.5,
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <ToggleButtonGroup
            value={tripType}
            exclusive
            onChange={handleTripTypeChange}
            aria-label="trip type"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: '#9aa0a6',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                textTransform: 'none',
                fontSize: '13px',
                px: 2,
                py: 0.75,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(138, 180, 248, 0.12)',
                  color: '#8ab4f8',
                  '&:hover': {
                    backgroundColor: 'rgba(138, 180, 248, 0.16)',
                  },
                },
              },
            }}
          >
            <ToggleButton value="roundtrip">Round trip</ToggleButton>
            <ToggleButton value="oneway">One way</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel sx={{ color: '#9aa0a6', fontSize: '14px' }}>Passengers</InputLabel>
              <Select
                value={passengers}
                label="Passengers"
                onChange={(e) => setPassengers(e.target.value)}
                sx={{
                  color: '#e8eaed',
                  fontSize: '14px',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.24)',
                  },
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ color: '#9aa0a6', fontSize: '14px' }}>Class</InputLabel>
              <Select
                value={cabinClass}
                label="Class"
                onChange={(e) => setCabinClass(e.target.value)}
                sx={{
                  color: '#e8eaed',
                  fontSize: '14px',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.24)',
                  },
                }}
              >
                <MenuItem value="economy">Economy</MenuItem>
                <MenuItem value="premium_economy">Premium Economy</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="first">First Class</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1.5,
            alignItems: 'center',
          }}
        >
              <Autocomplete
                fullWidth
                options={airportOptions}
                value={fromLocation}
                onChange={(event, newValue) => setFromLocation(newValue)}
                inputValue={fromInputValue}
                onInputChange={(event, newInputValue) => setFromInputValue(newInputValue)}
                getOptionLabel={(option) => option.title || ''}
                isOptionEqualToValue={(option, value) => option.skyId === value.skyId}
                popupIcon={null}
                filterOptions={(options, { inputValue }) => {
                  const searchTerm = inputValue.toLowerCase();
                  return options.filter(option => 
                    option.title.toLowerCase().includes(searchTerm) ||
                    option.subtitle.toLowerCase().includes(searchTerm) ||
                    option.skyId.toLowerCase().includes(searchTerm)
                  );
                }}
                sx={{ flex: 1 }}
            ListboxProps={{
              sx: {
                backgroundColor: '#303134',
                '& .MuiAutocomplete-option': {
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: 'rgba(138, 180, 248, 0.12)',
                  },
                },
              },
            }}
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: '#303134',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="From"
                placeholder="Where from?"
                InputProps={{
                  ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <FlightTakeoffIcon sx={{ color: '#9aa0a6' }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e8eaed',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      borderRight: { xs: '1px solid rgba(255, 255, 255, 0.12)', md: 'none' },
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.24)',
                      borderRight: { xs: '1px solid rgba(255, 255, 255, 0.24)', md: 'none' },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9aa0a6',
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.skyId}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#e8eaed', fontWeight: 500 }}>
                    {option.title}
                  </Typography>
                  {option.subtitle && (
                    <Typography sx={{ fontSize: '12px', color: '#9aa0a6' }}>
                      {option.subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          />

          {!isMobile && (
            <Button
              onClick={handleSwapLocations}
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                p: 0,
                borderRadius: '50%',
                flexShrink: 0,
                position: 'absolute',
                left: tripType === 'roundtrip' ? 232 : 310,
                backgroundColor: '#303134',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(138, 180, 248, 0.16)',
                },
              }}
            >
              <SwapHorizIcon sx={{ color: '#8ab4f8' }} />
            </Button>
          )}

              <Autocomplete
                fullWidth
                options={airportOptions}
                value={toLocation}
                onChange={(event, newValue) => setToLocation(newValue)}
                inputValue={toInputValue}
                onInputChange={(event, newInputValue) => setToInputValue(newInputValue)}
                getOptionLabel={(option) => option.title || ''}
                isOptionEqualToValue={(option, value) => option.skyId === value.skyId}
                popupIcon={null}
                filterOptions={(options, { inputValue }) => {
                  const searchTerm = inputValue.toLowerCase();
                  return options.filter(option => 
                    option.title.toLowerCase().includes(searchTerm) ||
                    option.subtitle.toLowerCase().includes(searchTerm) ||
                    option.skyId.toLowerCase().includes(searchTerm)
                  );
                }}
                sx={{ flex: 1 }}
            ListboxProps={{
              sx: {
                backgroundColor: '#303134',
                '& .MuiAutocomplete-option': {
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&[aria-selected="true"]': {
                    backgroundColor: 'rgba(138, 180, 248, 0.12)',
                  },
                },
              },
            }}
            componentsProps={{
              paper: {
                sx: {
                  backgroundColor: '#303134',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                },
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="To"
                placeholder="Where to?"
                InputProps={{
                  ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start" style={{ marginLeft: 10 }}>
                          <FlightLandIcon sx={{ color: '#9aa0a6' }} />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e8eaed',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      borderLeft: { xs: '1px solid rgba(255, 255, 255, 0.12)', md: 'none' },
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.24)',
                      borderLeft: { xs: '1px solid rgba(255, 255, 255, 0.24)', md: 'none' },
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9aa0a6',
                  },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.skyId}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#e8eaed', fontWeight: 500 }}>
                    {option.title}
                  </Typography>
                  {option.subtitle && (
                    <Typography sx={{ fontSize: '12px', color: '#9aa0a6' }}>
                      {option.subtitle}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          />

          <DatePicker
            label="Departure"
            value={departureDate}
            onChange={(newValue) => setDepartureDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                sx: {
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#e8eaed',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.24)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9aa0a6',
                  },
                },
              },
            }}
          />

          {tripType === 'roundtrip' && (
            <DatePicker
              label="Return"
              value={returnDate}
              onChange={(newValue) => setReturnDate(newValue)}
              minDate={departureDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#e8eaed',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.24)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#9aa0a6',
                    },
                  },
                },
              }}
            />
          )}
        </Box>

        {hasResults && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 2,
              pb: 3,
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Button
              variant="text"
              onClick={handleClearAllFilters}
              disabled={!hasActiveFilters || loading}
              sx={{
                textTransform: 'none',
                color: hasActiveFilters ? '#8ab4f8' : '#5f6368',
                fontSize: '14px',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                '&:hover': {
                  backgroundColor: hasActiveFilters ? 'rgba(138, 180, 248, 0.08)' : 'transparent',
                },
                '&.Mui-disabled': {
                  color: '#5f6368',
                },
              }}
            >
              Clear all
            </Button>

            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
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
            </Box>
          </Box>
        )}

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

        <Button
          variant="contained"
          size="medium"
          startIcon={loading ? <CircularProgress size={20} sx={{ color: '#202124' }} /> : <SearchIcon />}
          onClick={handleSearch}
          disabled={loading}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translate(-50%, 50%)',
            backgroundColor: '#8ab4f8',
            color: '#202124',
            px: 3.5,
            py: 1.25,
            fontSize: '15px',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            '&:hover': {
              backgroundColor: '#aac8f9',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            },
            '&:disabled': {
              backgroundColor: '#8ab4f8',
              color: '#202124',
              opacity: 0.7,
            },
          }}
        >
          {loading ? 'Searching...' : 'Explore'}
        </Button>
      </Paper>
    </LocalizationProvider>
  );
};

export default SearchBox;

