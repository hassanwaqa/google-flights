import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { mockAirports } from './data/airports.js';
import { filterFlights } from './data/flightFilters.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Flights API Server',
    version: '1.0.0',
    endpoints: {
      airports: '/api/airports',
      searchFlights: '/api/flights/search'
    }
  });
});

app.get('/api/airports', (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.json({
        status: true,
        data: mockAirports.map(item => ({
          skyId: item.skyId,
          entityId: item.entityId,
          title: item.presentation.title,
          subtitle: item.presentation.subtitle,
          suggestionTitle: item.presentation.suggestionTitle,
          entityType: item.navigation.entityType,
          localizedName: item.navigation.localizedName,
        }))
      });
    }

    const searchTerm = query.toLowerCase();
    const filteredAirports = mockAirports.filter(airport => {
      const title = airport.presentation.title.toLowerCase();
      const subtitle = airport.presentation.subtitle.toLowerCase();
      const skyId = airport.skyId.toLowerCase();
      
      return title.includes(searchTerm) || 
             subtitle.includes(searchTerm) || 
             skyId.includes(searchTerm);
    });

    res.json({
      status: true,
      data: filteredAirports.map(item => ({
        skyId: item.skyId,
        entityId: item.entityId,
        title: item.presentation.title,
        subtitle: item.presentation.subtitle,
        suggestionTitle: item.presentation.suggestionTitle,
        entityType: item.navigation.entityType,
        localizedName: item.navigation.localizedName,
      }))
    });
  } catch (error) {
    console.error('Error searching airports:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.get('/api/flights/search', (req, res) => {
  try {
    const {
      originSkyId,
      destinationSkyId,
      originEntityId,
      destinationEntityId,
      date,
      returnDate,
      tripType,
      cabinClass,
      adults,
      sortBy,
      currency,
      market,
      countryCode,
      minPrice,
      maxPrice,
      page,
      pageSize
    } = req.query;

    if (!originSkyId || !destinationSkyId || !date) {
      return res.status(400).json({
        status: false,
        message: 'Missing required parameters: originSkyId, destinationSkyId, date'
      });
    }

    const searchParams = {
      originSkyId,
      destinationSkyId,
      originEntityId,
      destinationEntityId,
      date,
      returnDate,
      tripType: tripType || 'roundtrip',
      cabinClass: cabinClass || 'economy',
      adults: parseInt(adults) || 1,
      sortBy: sortBy || 'best',
      currency: currency || 'USD',
      market: market || 'en-US',
      countryCode: countryCode || 'US',
      minPrice: parseFloat(minPrice) || 0,
      maxPrice: parseFloat(maxPrice) || 10000,
      page: parseInt(page) || 1,
      pageSize: parseInt(pageSize) || 3
    };

    const results = filterFlights(searchParams);
    
    res.json(results);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
});

