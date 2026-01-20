import logger from '../utils/logger.js';
import config from '../config/env.js';

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  logger.error(`Error: ${message}`, {
    statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  if (config.node_env === 'development') {
    return res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
      error: err,
    });
  }
  
  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? message : 'Internal Server Error',
  });
};

export default errorHandler;
