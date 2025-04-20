const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    
    console.log(err);
  
    
    if (err.name === 'CastError') {
      const message = `Resource not found`;
      error = { message };
      return res.status(404).json({
        success: false,
        error: message
      });
    }
  
    
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = { message };
      return res.status(400).json({
        success: false,
        error: message
      });
    }
  
    
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = { message };
      return res.status(400).json({
        success: false,
        error: message
      });
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
    });
  };
  
  module.exports = errorHandler;