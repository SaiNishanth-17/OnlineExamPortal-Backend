const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    error: err.message || 'Something went wrong!'
  });
};

module.exports = errorHandler;