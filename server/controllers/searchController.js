const { getSession } = require("../config/database");
const logger = require("../utils/logger");

exports.search = async (req, res, next) => {
  const type = req.params.type;
  const session = getSession();

  let query = "";

  switch (type) {
    case "character":
      query = `MATCH (n:Character)
        WHERE n.name IS NOT NULL
        RETURN n.name`;
      break;
    case "house":
      query = `MATCH (n:House)
        WHERE n.name IS NOT NULL
        RETURN n.name`;
      break;
    case "seat":
      query = `MATCH (n:Seat)
        WHERE n.name IS NOT NULL
        RETURN n.name`;
      break;
    default:
      return res.status(400).json({ error: "Invalid search type" });
  }

  try {
    const result = await session.run(query);
    const searches = result.records.map((v) => v.get("n.name"));
    res.json(searches);
  } catch (error) {
    logger.error("Error performing search:", error);
    next(error);
  } finally {
    session.close();
  }
};
