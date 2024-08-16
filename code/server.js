// Import necessary modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Create an instance of Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Create Socket.IO server
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Simulate GPS data
let gpsData = { lat: 37.7749, lon: -122.4194, alt: 100 }; // Default to San Francisco
let weatherData = { description: 'Clear Sky' }; // Default weather data

// Endpoint to get GPS data
app.get('/api/gps', (req, res) => {
  res.json(gpsData);
});

// Endpoint to get weather data
app.get('/api/weather', (req, res) => {
  // In a real application, use the latitude and longitude to fetch real weather data
  const { lat, lon } = req.query;
  res.json(weatherData);
});

// Endpoint to update GPS data (for demonstration purposes)
app.post('/api/gps', (req, res) => {
  const { lat, lon, alt } = req.body;
  gpsData = { lat, lon, alt };
  res.json(gpsData);
});

// Endpoint to simulate starting/stopping recording (for demonstration purposes)
app.post('/api/record', (req, res) => {
  // In a real application, handle starting/stopping recording
  res.send('Recording action simulated');
});

// Endpoint for login
app.post('/api/login', (req, res) => {
  const { droneName, droneId } = req.body;
  // Here you can add logic to verify drone credentials
  // For now, we simply respond with the received data
  res.json({ message: 'Login successful', droneName, droneId });
});

// Route to handle root requests
app.get('/', (req, res) => {
  res.send('Welcome to the Drone Backend API!');
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('start-stream', () => {
    // Assuming the video stream is coming from an RTMP server
    // You should use ffmpeg or another library to handle RTMP to WebRTC streaming
    // For simplicity, we will simulate sending video data chunks via Socket.IO

    // Use a placeholder file to simulate video data (you should use a real streaming setup)
    const videoPath = path.join(__dirname, 'public', 'sample-video.mp4');
    const stream = fs.createReadStream(videoPath);

    stream.on('data', (chunk) => {
      socket.emit('video-data', chunk);
    });

    stream.on('end', () => {
      socket.emit('end-of-stream');
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
