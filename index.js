const express = require("express");
const neo4j = require("neo4j-driver");
const { Anthropic } = require("@anthropic-ai/sdk");
const app = express();
const port = 4000;
const cors = require("cors");

// Neo4j connection details
const uri = "bolt://localhost:7687";
const user = "neo4j";
const password = "password";

const env = require("dotenv").config();

// Create a driver instance
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

// Create a session
const session = driver.session();

app.use(express.json());
app.use(cors());

const claude = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Helper function to format Neo4j results for React Flow
function formatNeo4jResult(records) {
  const nodes = [];
  const edges = [];
  const nodeIds = new Set();

  records.forEach((record) => {
    record.forEach((value, index) => {
      if (neo4j.isNode(value)) {
        if (!nodeIds.has(value.identity?.toString())) {
          nodes.push({
            id: value.identity?.toString(),

            data: {
              label: value.properties.name || value.properties.title,
              ...value.properties,
              name: undefined,
              id: undefined,
              type: value.labels[0].toLowerCase(),
            },
            // position: { x: 0, y: 0 }, // You may want to implement a layout algorithm here
          });
          nodeIds.add(value.identity.toString());
        }
      } else if (neo4j.isRelationship(value)) {
        const source = value.startNodeElementId.split(":")[2];
        const target = value.endNodeElementId.split(":")[2];
        edges.push({
          id: value.identity.toString(),
          source,
          target,
          type: value.type.toLowerCase(),
        });
      }
    });
  });

  nodes[0].data.isCrowned = true;

  return { nodes, edges };
}

// Endpoint to get all data
app.get("/api/data", async (req, res) => {
  try {
    const result = await session.run("MATCH (n)-[r]->(m) RETURN n, r, m");
    const formattedResult = formatNeo4jResult(result.records);
    res.json(formattedResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
});

// Endpoint to get data for a specific house
app.get("/api/house/:houseName", async (req, res) => {
  const houseName = req.params.houseName;
  try {
    const result = await session.run(
      "MATCH (h:House {name: $houseName})-[r]-(n) RETURN h, r, n",
      { houseName }
    );
    if (result.records.length === 0) {
      return res.status(404).json({ message: "House not found" });
    }
    const formattedResult = formatNeo4jResult(result.records);
    res.json(formattedResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching house data", error: error.message });
  }
});

// Endpoint to get data for a specific character
app.get("/api/character/:characterName", async (req, res) => {
  const characterName = req.params.characterName;
  try {
    const result = await session.run(
      "MATCH (c:Character {name: $characterName})-[r]-(n) RETURN c, r, n",
      { characterName }
    );
    if (result.records.length === 0) {
      return res.status(404).json({ message: "Character not found" });
    }
    const formattedResult = formatNeo4jResult(result.records);
    res.json(formattedResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching character data", error: error.message });
  }
});

// Endpoint to get data for a specific seat
app.get("/api/seat/:seatName", async (req, res) => {
  const seatName = req.params.seatName;
  try {
    const result = await session.run(
      "MATCH (s:Seat {name: $seatName})-[r]-(n) RETURN s, r, n",
      { seatName }
    );
    if (result.records.length === 0) {
      return res.status(404).json({ message: "Seat not found" });
    }
    const formattedResult = formatNeo4jResult(result.records);
    res.json(formattedResult);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching seat data", error: error.message });
  }
});

app.get("/houses", async (req, res) => {
  try {
    const result = await session.run(
      "MATCH (c:Character)-[:CHILD_OF]->(p:Character) OPTIONAL MATCH (c)-[:MARRIED_TO]->(s:Character) RETURN c.name AS Character, collect(DISTINCT p.name) AS Parents, collect(DISTINCT s.name) AS Spouse;"
    );
    const users = result.records.map((record) => {
      return record.get("Character");
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/character", async (req, res) => {
  try {
    const result = await session.run(
      `MATCH (c:Character {name: 'Danerys Targareyan'})
      OPTIONAL MATCH (c)-[:BELONGS_TO]->(h:House)
      OPTIONAL MATCH (c)-[:HOLDS_TITLE]->(t:Title)
      OPTIONAL MATCH (c)-[:HAS_ALIAS]->(a:Alias)
      OPTIONAL MATCH (c)-[:CHILD_OF]->(p:Character)
      OPTIONAL MATCH (c)-[:MARRIED_TO]->(s:Character)
      RETURN c AS Character,
       h.name AS House,
       COLLECT(DISTINCT t.name) AS Titles,
       COLLECT(DISTINCT a.name) AS Aliases,
       COLLECT(DISTINCT CASE WHEN (c)-[:CHILD_OF]->(p) THEN p.name END) AS Parents,
       s.name AS Spouse`
    );
    const formattedResult = formatNeo4jResult(result.records);
    res.json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/ai/:info", async (req, res) => {
  const info = req.params.info;
  try {
    const message = await claude.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: `As the Three-Eyed Raven from Game of Thrones, you possess knowledge of all events, characters, and places in the world of Westeros and Essos. Respond to queries about Game of Thrones in JSON format only, providing exactly three pieces of information:
        "type": Either "character", "house", or "seat"
        "name": The full name of the character, house, or seat (e.g., "Robert I Baratheon" or "House Targaryen of King's Landing")
        "fact": A brief, interesting not commonly known fact about the entity

        If multiple entities are mentioned in the query, focus on the single most relevant one.
        Example response format:
        {
        "type": "character",
        "name": "Jon Snow",
        "fact": "He was Lord Commander of the Night's Watch before being resurrected."
        }
        Respond to all queries using only this JSON format, without any additional text or explanation.
      `,
      messages: [
        {
          role: "user",
          content: `Provide information about ${info}`,
        },
      ],
    });

    console.log(message.content);

    const jsonResponse = JSON.parse(message.content[0].text);
    res.json(jsonResponse);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.get("/search/:type", async (req, res) => {
  const type = req.params.type;

  let query = "";

  switch (type) {
    case "character":
      query = `MATCH (n)
        WHERE n:Character AND n.name IS NOT NULL
        RETURN n.name`;
      break;
    case "house":
      query = `MATCH (n)
        WHERE n:House AND n.name IS NOT NULL
        RETURN n.name`;
      break;
    case "seat":
      query = `MATCH (n)
        WHERE n:Seat AND n.name IS NOT NULL
        RETURN n.name`;
      break;
    default:
      return res.status(403).json({ error: "Invalid search type" });
  }

  try {
    const result = await session.run(query);
    const searches = result.records.map((v) => v.get("n.name"));
    res.json(searches);
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
