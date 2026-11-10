const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


// --- 1. IMPORT YOUR AUTH ROUTES HERE ---
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const orderRoutes=require('./routes/orderRoutes');
const app = express();
// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/matflow';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully to MatFlow Database'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('MatFlow Backend API is running...');
});

// --- 2. LINK/MOUNT THE ROUTES HERE ---
// This means any route defined in authRoutes will now be prefixed with "/api/auth"
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes); 
app.use('/api/orders', orderRoutes);
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


