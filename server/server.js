require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandlers");
const routes = require("./routes");
const { initializeDatabase } = require("./config/database");
const logger = require("./utils/logger");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(helmet());

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  app.close(() => {
    logger.info("HTTP server closed");
  });
});


module.exports = app;