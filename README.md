# Todo Application with Docker

This is a containerized Todo application with a React frontend and a Node.js/Express backend.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git for cloning the repository

## Running the Application

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```

   This will:
   - Build the frontend and backend images
   - Start a MongoDB container
   - Connect all services together on a shared network
   - Map the necessary ports to your host machine

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:5001

## Services

The application consists of three services:

1. **MongoDB** - The database for storing todo items
   - Port: 27017 (mapped to host)
   - Persists data using a Docker volume

2. **Backend** - Node.js/Express API
   - Port: 5001 (mapped to host)
   - Connects to MongoDB for data storage
   - Provides RESTful API endpoints for todo operations

3. **Frontend** - React application served via Nginx
   - Port: 80 (mapped to host)
   - Communicates with the backend API
   - Provides a responsive user interface for managing todos

## Stopping the Application

To stop the running containers:
```
docker-compose down
```

To stop and remove containers, networks, and volumes:
```
docker-compose down -v
```

## Development

For development purposes, you can run each service separately:

- **Frontend**: `cd frontend && npm start`
- **Backend**: `cd backend && npm run dev`
- **MongoDB**: Use the containerized version or install locally

Make sure to update the API URLs in the frontend code if you're running services on different ports.
