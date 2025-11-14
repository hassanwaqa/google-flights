import { mockFlightsData } from './flights.js';

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
  
  const minPrice = searchParams.minPrice || 0;
  const maxPrice = searchParams.maxPrice || 10000;
  const tripType = searchParams.tripType || 'roundtrip';
  
  let outboundFlights = mockFlightsData.filter(flight => {
    const matchesOrigin = flight.originSkyId === searchParams.originSkyId;
    const matchesDestination = flight.destinationSkyId === searchParams.destinationSkyId;
    const matchesDate = departureDates.includes(flight.date);
    const matchesPrice = flight.price.amount >= minPrice && flight.price.amount <= maxPrice;
    
    return matchesOrigin && matchesDestination && matchesDate && matchesPrice;
  });
  
  let filtered = [];
  
  if (tripType === 'oneway') {
    filtered = outboundFlights.map(flight => ({
      ...flight,
      tripType: 'oneway'
    }));
  } 
  else if (tripType === 'roundtrip' && returnDates) {
    const returnFlights = mockFlightsData.filter(flight => {
      const matchesOrigin = flight.originSkyId === searchParams.destinationSkyId;
      const matchesDestination = flight.destinationSkyId === searchParams.originSkyId;
      const matchesDate = returnDates.includes(flight.date);
      const matchesPrice = flight.price.amount >= minPrice && flight.price.amount <= maxPrice;
      
      return matchesOrigin && matchesDestination && matchesDate && matchesPrice;
    });
    
    const paired = new Set();
    const pairedReturnFlights = new Set();
    
    outboundFlights.forEach(outbound => {
      const airlineName = outbound.legs[0]?.airline?.name;
      if (!airlineName) return;
      
      const matchingReturn = returnFlights.find((returnFlight, index) => {
        if (pairedReturnFlights.has(index)) return false;
        const returnAirline = returnFlight.legs[0]?.airline?.name;
        return returnAirline === airlineName;
      });
      
      if (matchingReturn) {
        const returnIndex = returnFlights.indexOf(matchingReturn);
        pairedReturnFlights.add(returnIndex);
        paired.add(outbound.id);
        
        filtered.push({
          ...outbound,
          tripType: 'roundtrip',
          returnFlight: matchingReturn,
          price: {
            amount: outbound.price.amount + matchingReturn.price.amount,
            currency: outbound.price.currency
          }
        });
      }
    });
    
    outboundFlights.forEach(outbound => {
      if (!paired.has(outbound.id)) {
        filtered.push({
          ...outbound,
          tripType: 'oneway'
        });
      }
    });
    
    returnFlights.forEach((returnFlight, index) => {
      if (!pairedReturnFlights.has(index)) {
        filtered.push({
          ...returnFlight,
          tripType: 'oneway'
        });
      }
    });
  } 
  else {
    filtered = outboundFlights.map(flight => ({
      ...flight,
      tripType: 'oneway'
    }));
  }
  
  filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

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

