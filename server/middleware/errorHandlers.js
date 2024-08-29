const logger = require("../utils/logger");

exports.notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
};

exports.errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
};
