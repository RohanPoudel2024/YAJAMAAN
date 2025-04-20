const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const colors = require('colors'); 
const fs = require('fs');
const path = require('path');


dotenv.config({ path: './config/config.env' });

const startServer = async () => {
  
  const dbConnection = await connectDB();
  
  if (dbConnection.error) {
    console.error('Failed to connect to MongoDB. Server will not start.');
    process.exit(1);
  }

  
  const app = express();
  
  
  app.use(express.json());

  
  app.use(cookieParser());

  
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

  
  const uploadsDir = path.join(__dirname, 'upload');
  const profilesDir = path.join(uploadsDir, 'profiles');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  if (!fs.existsSync(profilesDir)) {
    fs.mkdirSync(profilesDir, { recursive: true });
  }

  
  app.use('/uploads', express.static(path.join(__dirname, 'upload')));

  
  const publicUploadsDir = path.join(__dirname, 'public/uploads/profiles');
  if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
  }
  if (!fs.existsSync(path.join(__dirname, 'public/uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'public/uploads'));
  }
  if (!fs.existsSync(publicUploadsDir)) {
    fs.mkdirSync(publicUploadsDir);
  }

  
  app.use(express.static(path.join(__dirname, 'public')));

  
  const auth = require('./routes/auth');
  const brahminRoutes = require('./routes/brahminRoutes');
  const adminRoutes = require('./routes/admin'); 
  

  
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/brahmins', require('./routes/brahminRoutes')); 
  app.use('/api/v1/admin', adminRoutes); 
  

  
  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  });
  
  
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    
    server.close(() => process.exit(1));
  });
};

startServer();