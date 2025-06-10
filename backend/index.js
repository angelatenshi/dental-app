const cors = require('cors');
require('dotenv').config();
const express = require('express');
const pool = require('./database/database');
const authRoutes = require('./routes/authRoutes');
const dentistRoutes = require('./routes/dentistRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const rateLimit = require('express-rate-limit'); 

const app = express();
app.use(cors());
// app.use(cors({
//   origin: 'http://dental-frontend-bucket.s3-website-ap-southeast-1.amazonaws.com',
//   credentials: true
// }));
app.use(express.json());

// for my additional points - RATE LIMITING
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', apiLimiter); 

// routes
app.use('/api/auth', authRoutes);
app.use('/api/dentists', dentistRoutes);
app.use('/api/appointments', appointmentRoutes);

// db
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('DB connected at:', res.rows[0].now);
  }
});

app.get('/', (req, res) => res.send('API running'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});