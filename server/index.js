const express = require("express");
const neo4j = require("neo4j-driver");
const app = express();
const port = 3000;

// Neo4j connection details
const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "password";

// Create a driver instance
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Create a session
const session = driver.session();

app.use(express.json());

app.get("/houses", async (req, res) => {
  try {
    const result = await session.run("MATCH (u:User) RETURN u");
    console.log(result);
    const users = result.records.map((record) => {
      console.log(record);
      return record.get("u").properties;
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    const result = await session.run(
      "MATCH (u:User {name: $name, email: $email}) RETURN u"
    );
    const newUser = result.records[0].get("u").properties;
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Close the driver when the application exits
process.on("SIGTERM", () => {
  driver.close();
  process.exit(0);
});
