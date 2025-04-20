const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DBURI, { 
      
      serverSelectionTimeoutMS: 15000, 
      socketTimeoutMS: 45000,          
      family: 4                        
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn; 
  } catch (err) {
    console.error(`Error: ${err.message}`);
    
    return { error: err };
  }
};

module.exports = connectDB;