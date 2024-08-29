const { param, validationResult } = require("express-validator");
const { getSession } = require("../config/database");
const { formatNeo4jResult } = require("../utils/formatters");
const logger = require("../utils/logger");

exports.getSeatData = [
  param("seatName").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const seatName = req.params.seatName;
    const session = getSession();

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
      logger.error("Error fetching seat data:", error);
      next(error);
    } finally {
      session.close();
    }
  },
];
