const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const unitRoutes = require('./routes/unitRoutes');
const transaction = require('./routes/transactionRoutes');
const payment = require('./routes/paymentRoutes');
const notification = require('./routes/notificationRoutes');
const userAccess = require('./routes/userAccessRoute');

dotenv.config();

const app = express();
app.options('*', cors());

   // Enable CORS for all routes
   app.use(cors({
    origin: true,  // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true // Allow credentials (if needed)
}));

//  // Allow requests from both localhost:3000 and localhost:3001
//  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
//  app.use(cors({
//      origin: allowedOrigins,
//  }));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', userRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/transaction', transaction);
app.use('/api/payment', payment);
app.use('/api/notification', notification);
app.use('/api/access', userAccess);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


