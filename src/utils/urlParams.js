export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const queryParams = {};
  
  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }
  
  return queryParams;
};

export const setQueryParams = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key, value);
    }
  });
  
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState({}, '', newUrl);
};

export const updateQueryParam = (key, value) => {
  const params = new URLSearchParams(window.location.search);
  
  if (value !== null && value !== undefined && value !== '') {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, '', newUrl);
};

export const clearQueryParams = () => {
  const newUrl = window.location.pathname;
  window.history.pushState({}, '', newUrl);
};

export const buildSearchParamsFromUrl = (queryParams) => {
  const searchParams = {};
  
  if (queryParams.from) searchParams.from = queryParams.from;
  if (queryParams.to) searchParams.to = queryParams.to;
  if (queryParams.fromEntityId) searchParams.fromEntityId = queryParams.fromEntityId;
  if (queryParams.toEntityId) searchParams.toEntityId = queryParams.toEntityId;
  if (queryParams.departure) searchParams.departure = queryParams.departure;
  if (queryParams.return) searchParams.return = queryParams.return;
  if (queryParams.tripType) searchParams.tripType = queryParams.tripType;
  if (queryParams.passengers) searchParams.passengers = parseInt(queryParams.passengers, 10);
  if (queryParams.cabinClass) searchParams.cabinClass = queryParams.cabinClass;
  if (queryParams.minPrice) searchParams.minPrice = parseInt(queryParams.minPrice, 10);
  if (queryParams.maxPrice) searchParams.maxPrice = parseInt(queryParams.maxPrice, 10);
  
  return searchParams;
};

export const buildUrlParamsFromSearch = (searchData) => {
  const urlParams = {};
  
  if (searchData.fromLocation && searchData.fromLocation.skyId && searchData.fromLocation.entityId) {
    urlParams.from = searchData.fromLocation.skyId;
    urlParams.fromEntityId = searchData.fromLocation.entityId;
  }
  
  if (searchData.toLocation && searchData.toLocation.skyId && searchData.toLocation.entityId) {
    urlParams.to = searchData.toLocation.skyId;
    urlParams.toEntityId = searchData.toLocation.entityId;
  }
  
  if (searchData.departureDate && searchData.departureDate.format) {
    urlParams.departure = searchData.departureDate.format('YYYY-MM-DD');
  }
  
  if (searchData.returnDate && searchData.returnDate.format && searchData.tripType === 'roundtrip') {
    urlParams.return = searchData.returnDate.format('YYYY-MM-DD');
  }
  
  if (searchData.tripType) {
    urlParams.tripType = searchData.tripType;
  }
  
  if (searchData.passengers) {
    urlParams.passengers = searchData.passengers;
  }
  
  if (searchData.cabinClass) {
    urlParams.cabinClass = searchData.cabinClass;
  }
  
  if (searchData.minPrice !== undefined && searchData.minPrice !== 0) {
    urlParams.minPrice = searchData.minPrice;
  }
  
  if (searchData.maxPrice !== undefined && searchData.maxPrice !== 1000) {
    urlParams.maxPrice = searchData.maxPrice;
  }
  
  return urlParams;
};

