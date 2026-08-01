const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, message: "Duplicate entry — record already exists" });
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ success: false, message: "Referenced record does not exist" });
  }

  const statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
