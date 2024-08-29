const { param, validationResult } = require("express-validator");
const { getSession } = require("../config/database");
const { formatNeo4jResult } = require("../utils/formatters");
const logger = require("../utils/logger");

exports.getHouseData = [
  param("houseName").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const houseName = req.params.houseName;
    const session = getSession();

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
      logger.error("Error fetching house data:", error);
      next(error);
    } finally {
      session.close();
    }
  },
];
