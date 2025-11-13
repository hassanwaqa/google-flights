# Flights App

A Google Flights clone built with React and Node.js. This application allows users to search for flights between different airports with real-time filtering and pagination.

## Tech Stack

**Frontend:**
- React with Vite
- Material-UI (MUI v7)

**Backend:**
- Node.js with Express
- Mock flight and airport data

## Prerequisites

- Node.js version 24

## Getting Started

This project has two parts: a frontend and a backend. You need to run both to use the application.

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on http://localhost:5000

### Frontend Setup

1. In a new terminal, navigate to the root directory and install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Features

- Search flights between major international airports
- Filter by cabin class, number of passengers, and price range
- Round trip and one-way flight options
- Responsive design for mobile and desktop
- Pagination for flight results
- URL parameters for shareable search results

## Mock Data

The application uses mock data for 6 international airports (JFK, LHR, SYD, YYZ, AKL, BER) with flight data covering November 15-30, 2025.

