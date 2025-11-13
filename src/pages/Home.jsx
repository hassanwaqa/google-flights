import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import SearchBox from '../components/SearchBox';
import FlightResults from '../components/FlightResults';

const Home = () => {
  const [flightResults, setFlightResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState(null);
  
  const hasResults = flightResults && flightResults.data && flightResults.data.itineraries && flightResults.data.itineraries.length > 0;

  const handleSearchResults = (results, params, isNewSearch = true, newPage = null) => {
    if (isNewSearch) {
      setFlightResults(results);
      setCurrentPage(1);
      setSearchParams(params);
    } else {
      setFlightResults(prev => ({
        ...results,
        data: {
          ...results.data,
          itineraries: [...prev.data.itineraries, ...results.data.itineraries]
        }
      }));
      if (newPage) {
        setCurrentPage(newPage);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#202124',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1240px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            pt: { xs: 6, sm: 8, md: 10 },
            pb: { xs: 4, sm: 6, md: 8 },
            backgroundImage:
              'url(https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg)',
            backgroundSize: 'contain',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            minHeight: { xs: '400px', sm: '500px', md: '600px' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
            }}
          />

          <Container
            maxWidth={false}
            sx={{
              position: 'relative',
              zIndex: 2,
              px: { xs: 2, sm: 3, md: 4 },
              mt: { xs: 4, sm: 10, md: 18 },
              width: '100%',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: '#e8eaed',
                textAlign: 'center',
                mb: { xs: 4, sm: 6, md: 8 },
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 400,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Flights
            </Typography>

            <SearchBox onSearchResults={handleSearchResults} hasResults={hasResults} />
          </Container>
        </Box>

        {flightResults && flightResults.data && flightResults.data.itineraries && flightResults.data.itineraries.length > 0 && (
          <FlightResults 
            flights={flightResults.data.itineraries} 
            context={flightResults.data.context}
            currentPage={currentPage}
            searchParams={searchParams}
            onSearchResults={handleSearchResults}
          />
        )}
      </Box>
    </Box>
  );
};

export default Home;

