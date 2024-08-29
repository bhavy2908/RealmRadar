const neo4j = require("neo4j-driver");
const logger = require("../utils/logger");

let driver;

async function initializeDatabase() {
  const uri = process.env.NEO4J_URI;
  const user = process.env.NEO4J_USER;
  const password = process.env.NEO4J_PASSWORD;

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

  try {
    await driver.verifyConnectivity();
    logger.info("Connected to Neo4j database");
  } catch (error) {
    logger.error("Failed to connect to Neo4j:", error);
    throw error;
  }
}

function getSession() {
  return driver.session();
}

module.exports = {
  initializeDatabase,
  getSession,
};
