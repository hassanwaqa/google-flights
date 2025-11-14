import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const backendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllAirports = async (query = '') => {
  try {
    const params = query ? { query } : {};
    const response = await backendApi.get('/api/airports', { params });
    
    if (response.data.status) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching airports:', error);
    return [];
  }
};

export const searchFlights = async (searchParams) => {
  try {
    const apiParams = {
      originSkyId: searchParams.originSkyId,
      destinationSkyId: searchParams.destinationSkyId,
      originEntityId: searchParams.originEntityId,
      destinationEntityId: searchParams.destinationEntityId,
      date: searchParams.date,
      tripType: searchParams.tripType || 'roundtrip',
      cabinClass: searchParams.cabinClass || 'economy',
      adults: searchParams.adults || 1,
      sortBy: searchParams.sortBy || 'best',
      currency: searchParams.currency || 'USD',
      market: searchParams.market || 'en-US',
      countryCode: searchParams.countryCode || 'US',
      minPrice: searchParams.minPrice || 0,
      maxPrice: searchParams.maxPrice || 10000,
      page: searchParams.page || 1,
      pageSize: searchParams.pageSize || 3,
    };

    if (searchParams.returnDate) {
      apiParams.returnDate = searchParams.returnDate;
    }

    if (searchParams.children && searchParams.children > 0) {
      apiParams.childrens = searchParams.children;
    }

    if (searchParams.infants && searchParams.infants > 0) {
      apiParams.infants = searchParams.infants;
    }

    const response = await backendApi.get('/api/flights/search', {
      params: apiParams,
    });

    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

export default backendApi;
