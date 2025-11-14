import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Collapse,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FlightIcon from '@mui/icons-material/Flight';
import NatureIcon from '@mui/icons-material/Nature';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { searchFlights } from '../api/flights';

const FlightResults = ({ flights, context, currentPage, searchParams, onSearchResults }) => {
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleToggleExpand = (flightId) => {
    setExpandedFlight(expandedFlight === flightId ? null : flightId);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (amount, currency) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  const getStopsText = (stops) => {
    if (stops === 0) return 'Nonstop';
    if (stops === 1) return '1 stop';
    return `${stops} stops`;
  };

  return (
    <Box
      sx={{
        maxWidth: '1040px',
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: 4,
      }}
    >
      {flights.map((flight) => {
        const leg = flight.legs[0];
        const isExpanded = expandedFlight === flight.id;

        return (
          <Paper
            key={flight.id}
            sx={{
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.23)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
              }}
              onClick={() => handleToggleExpand(flight.id)}
            >
              <Box
                component="img"
                src={leg.airline.logo}
                alt={leg.airline.name}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  p: 0.5,
                  objectFit: 'contain',
                }}
              />

              <Box sx={{ flex: 1, display: 'flex', gap: 3, alignItems: 'center' }}>
                <Box sx={{ minWidth: 150 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#e8eaed',
                      mb: 0.5,
                    }}
                  >
                    {formatTime(leg.departure)} – {formatTime(leg.arrival)}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#9aa0a6', mb: 1 }}>
                    {leg.airline.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' }, gap: 0.5, alignItems: 'center' }}>
                      <Chip
                        label={leg.duration}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '11px',
                          backgroundColor: 'rgba(154, 160, 166, 0.12)',
                          color: '#9aa0a6',
                          border: 'none',
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' }, gap: 0.5, alignItems: 'center' }}>
                      <Chip
                        label={`${leg.origin.id}–${leg.destination.id}`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '11px',
                          backgroundColor: 'rgba(154, 160, 166, 0.12)',
                          color: '#9aa0a6',
                          border: 'none',
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' }, gap: 0.5, alignItems: 'center' }}>
                      <Chip
                        label={getStopsText(leg.stops)}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '11px',
                          backgroundColor: 'rgba(138, 180, 248, 0.12)',
                          color: '#8ab4f8',
                          border: 'none',
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'none' }, gap: 0.5, alignItems: 'center' }}>
                      <Chip
                        icon={<NatureIcon sx={{ fontSize: 12, color: '#81c995 !important' }} />}
                        label={`${leg.emissions.amount} kg`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: '11px',
                          backgroundColor: 'rgba(129, 201, 149, 0.12)',
                          color: '#81c995',
                          border: 'none',
                          '& .MuiChip-label': { px: 0.5 }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ minWidth: 120, display: { xs: 'none', sm: 'none', md: 'block' } }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#e8eaed',
                      mb: 0.5,
                    }}
                  >
                    {leg.duration}
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#9aa0a6' }}>
                    {leg.origin.id}–{leg.destination.id}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 80, display: { xs: 'none', sm: 'none', md: 'block' } }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#e8eaed',
                      mb: 0.5,
                    }}
                  >
                    {getStopsText(leg.stops)}
                  </Typography>
                  {leg.stopInfo && (
                    <Typography sx={{ fontSize: '13px', color: '#9aa0a6' }}>
                      {leg.stopInfo}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ minWidth: 140, display: { xs: 'none', sm: 'none', md: 'none', lg: 'block' } }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#e8eaed',
                      mb: 0.5,
                    }}
                  >
                    {leg.emissions.amount} {leg.emissions.unit}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ fontSize: '13px', color: '#9aa0a6' }}>
                      Avg emissions
                    </Typography>
                    <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9aa0a6' }} />
                  </Box>
                  {leg.emissions.comparison && (
                    <Chip
                      label={`${leg.emissions.comparison} emissions`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '11px',
                        mt: 0.5,
                        backgroundColor: 'rgba(129, 201, 149, 0.12)',
                        color: '#81c995',
                        border: 'none',
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  textAlign: 'right',
                  minWidth: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#e8eaed',
                    mb: 0.5,
                  }}
                >
                  {formatPrice(flight.price.amount, flight.price.currency)}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#9aa0a6', mb: 1 }}>
                  {flight.tripType === 'roundtrip' ? 'round trip' : 'one way'}
                </Typography>
              </Box>

              <IconButton
                size="small"
                sx={{
                  color: '#9aa0a6',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={isExpanded}>
              <Box
                sx={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                  p: 3,
                  backgroundColor: '#202124',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    component="img"
                    src={leg.airline.logo}
                    alt={leg.airline.name}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      p: 0.5,
                      objectFit: 'contain',
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#e8eaed',
                        mb: 3,
                      }}
                    >
                      {flight.tripType === 'roundtrip' ? 'Outbound' : 'Departure'} · {formatDate(leg.departure)}
                    </Typography>

                    <Box sx={{ position: 'relative', pl: 4 }}>
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 8,
                          bottom: 8,
                          width: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        }}
                      />

                      <Box sx={{ mb: 3 }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: -4,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            border: '2px solid #9aa0a6',
                            backgroundColor: '#202124',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#e8eaed',
                            mb: 0.5,
                          }}
                        >
                          {formatTime(leg.departure)} · {leg.origin.name} ({leg.origin.id})
                        </Typography>
                      </Box>

                      <Box sx={{ my: 2, ml: 2 }}>
                        <Typography sx={{ fontSize: '13px', color: '#9aa0a6', mb: 0.5 }}>
                          Travel time: {leg.duration}
                        </Typography>
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: -4,
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            border: '2px solid #9aa0a6',
                            backgroundColor: '#202124',
                          }}
                        />
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#e8eaed',
                            mb: 0.5,
                          }}
                        >
                          {formatTime(leg.arrival)} · {leg.destination.name} ({leg.destination.id})
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                      }}
                    >
                      <Typography sx={{ fontSize: '13px', color: '#9aa0a6' }}>
                        {leg.airline.name} · Economy · {leg.aircraft} · {leg.aircraft?.split(' ')[1] || '9P 500'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {flight.tripType === 'roundtrip' && flight.returnFlight && flight.returnFlight.legs[0] && (
                  <>
                    <Box sx={{ my: 4, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }} />
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        component="img"
                        src={flight.returnFlight.legs[0].airline.logo}
                        alt={flight.returnFlight.legs[0].airline.name}
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#fff',
                          p: 0.5,
                          objectFit: 'contain',
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 500,
                            color: '#e8eaed',
                            mb: 3,
                          }}
                        >
                          Return · {formatDate(flight.returnFlight.legs[0].departure)}
                        </Typography>

                        <Box sx={{ position: 'relative', pl: 4 }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 8,
                              bottom: 8,
                              width: 2,
                              backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            }}
                          />

                          <Box sx={{ mb: 3 }}>
                            <Box
                              sx={{
                                position: 'absolute',
                                left: -4,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                border: '2px solid #9aa0a6',
                                backgroundColor: '#202124',
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#e8eaed',
                                mb: 0.5,
                              }}
                            >
                              {formatTime(flight.returnFlight.legs[0].departure)} · {flight.returnFlight.legs[0].origin.name} ({flight.returnFlight.legs[0].origin.id})
                            </Typography>
                          </Box>

                          <Box sx={{ my: 2, ml: 2 }}>
                            <Typography sx={{ fontSize: '13px', color: '#9aa0a6', mb: 0.5 }}>
                              Travel time: {flight.returnFlight.legs[0].duration}
                            </Typography>
                          </Box>

                          <Box>
                            <Box
                              sx={{
                                position: 'absolute',
                                left: -4,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                border: '2px solid #9aa0a6',
                                backgroundColor: '#202124',
                              }}
                            />
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#e8eaed',
                                mb: 0.5,
                              }}
                            >
                              {formatTime(flight.returnFlight.legs[0].arrival)} · {flight.returnFlight.legs[0].destination.name} ({flight.returnFlight.legs[0].destination.id})
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            mt: 3,
                            pt: 2,
                            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                          }}
                        >
                          <Typography sx={{ fontSize: '13px', color: '#9aa0a6' }}>
                            {flight.returnFlight.legs[0].airline.name} · Economy · {flight.returnFlight.legs[0].aircraft} · {flight.returnFlight.legs[0].aircraft?.split(' ')[1] || '9P 500'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </>
                )}

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#303134',
                      borderRadius: 2,
                      flex: 1,
                      mr: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <NatureIcon sx={{ fontSize: 18, color: '#9aa0a6' }} />
                      <Typography sx={{ fontSize: '13px', color: '#e8eaed' }}>
                        Emissions estimate: {leg.emissions.amount} {leg.emissions.unit}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlightIcon sx={{ fontSize: 18, color: '#9aa0a6' }} />
                      <Typography sx={{ fontSize: '13px', color: '#e8eaed' }}>
                        Contrail warming potential: Low
                      </Typography>
                      <InfoOutlinedIcon sx={{ fontSize: 14, color: '#9aa0a6' }} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        sx={{
                          fontSize: '18px',
                          fontWeight: 500,
                          color: '#e8eaed',
                        }}
                      >
                        {formatPrice(flight.price.amount, flight.price.currency)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '13px',
                          color: '#9aa0a6',
                        }}
                      >
                        {flight.tripType === 'roundtrip' ? 'round trip' : 'one way'}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#8ab4f8',
                        color: '#202124',
                        py: 1.5,
                        px: 4,
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: '24px',
                        '&:hover': {
                          backgroundColor: '#aac8f9',
                        },
                      }}
                    >
                      Select flight
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        );
      })}
      
      {context && context.hasMore && (
        <Paper
          onClick={async () => {
            if (loadingMore) return;
            setLoadingMore(true);
            try {
              const nextPage = currentPage + 1;
              const results = await searchFlights({
                ...searchParams,
                page: nextPage,
                pageSize: 3
              });
              
              if (results.status && results.data) {
                onSearchResults(results, searchParams, false, nextPage);
              }
            } catch (error) {
              console.error('Error loading more flights:', error);
            } finally {
              setLoadingMore(false);
            }
          }}
          elevation={0}
          sx={{
            mb: 4,
            p: 2,
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.23)',
            borderRadius: 2,
            cursor: loadingMore ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: loadingMore ? 'transparent' : 'rgba(255, 255, 255, 0.04)',
            },
          }}
        >
          {loadingMore ? (
            <CircularProgress size={20} sx={{ color: '#e8eaed' }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ color: '#e8eaed', fontSize: 20 }} />
          )}
          <Typography
            sx={{
              color: '#e8eaed',
              fontSize: '14px',
              fontWeight: 400,
            }}
          >
            {loadingMore ? 'Loading...' : 'View more flights'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default FlightResults;

