const { param, validationResult } = require("express-validator");
const { getSession } = require("../config/database");
const { formatNeo4jResult } = require("../utils/formatters");
const logger = require("../utils/logger");

exports.getCharacterData = [
  param("characterName").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const characterName = req.params.characterName;
    const session = getSession();

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
      logger.error("Error fetching character data:", error);
      next(error);
    } finally {
      session.close();
    }
  },
];
