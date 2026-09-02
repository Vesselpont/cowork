require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const cors = require('cors');

 
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { globalErrorHandler } = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

//запросы с фронта
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// 404 Handler
app.all('/{*splat}', (req, res, next) => next(new AppError(`Маршрут ${req.originalUrl} не найден`, 404)));

// Global Error Handler
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));