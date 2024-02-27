const { ValidationError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    // Sequelize validation error
    const errors = err.errors.map(error => error.message);
    return res.status(400).json({ message: 'Validation Error', errors });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'The user is not authorized' });
  }

  // Default to 500 server error
  console.error(err); // Log the error for debugging purposes
  return res.status(500).json({ message: 'Internal Server Error' });
};

module.exports = errorHandler;
