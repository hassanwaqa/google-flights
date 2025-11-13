import { mockFlightsData } from './flights.js';

// Helper function to get date range (date + next 2 days)
const getDateRange = (dateStr) => {
  const date = new Date(dateStr);
  const dates = [];
  
  for (let i = 0; i < 3; i++) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + i);
    dates.push(newDate.toISOString().split('T')[0]);
  }
  
  return dates;
};

export const filterFlights = (searchParams) => {
  const departureDates = getDateRange(searchParams.date);
  const returnDates = searchParams.returnDate ? getDateRange(searchParams.returnDate) : null;
  
  // Filter outbound flights (departure)
  let filtered = mockFlightsData.filter(flight => {
    const matchesOrigin = flight.originSkyId === searchParams.originSkyId;
    const matchesDestination = flight.destinationSkyId === searchParams.destinationSkyId;
    const matchesDate = departureDates.includes(flight.date);
    
    const minPrice = searchParams.minPrice || 0;
    const maxPrice = searchParams.maxPrice || 10000;
    const matchesPrice = flight.price.amount >= minPrice && flight.price.amount <= maxPrice;
    
    return matchesOrigin && matchesDestination && matchesDate && matchesPrice;
  });
  
  // If returnDate is provided, also check if return flights exist
  if (returnDates) {
    filtered = filtered.filter(() => {
      // Check if there's a return flight available (reverse route)
      const hasReturnFlight = mockFlightsData.some(returnFlight => {
        return returnFlight.originSkyId === searchParams.destinationSkyId &&
               returnFlight.destinationSkyId === searchParams.originSkyId &&
               returnDates.includes(returnFlight.date);
      });
      
      return hasReturnFlight;
    });
  }
  
  // Sort by date (ascending - earliest date first)
  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Pagination
  const page = parseInt(searchParams.page) || 1;
  const pageSize = parseInt(searchParams.pageSize) || 3;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalResults = filtered.length;
  const paginatedResults = filtered.slice(startIndex, endIndex);

  return {
    status: true,
    message: "Flights retrieved successfully",
    data: {
      context: {
        totalResults: totalResults,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalResults / pageSize),
        hasMore: endIndex < totalResults
      },
      itineraries: paginatedResults
    }
  };
};

