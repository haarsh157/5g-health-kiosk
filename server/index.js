const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Import routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const heightRoutes = require('./routes/heightRoutes');
const tempRoutes = require('./routes/tempRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/height', heightRoutes);
app.use('/api/temp', tempRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});