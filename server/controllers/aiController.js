const claude = require("../config/claude");
const logger = require("../utils/logger");

exports.getAIResponse = async (req, res, next) => {
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

    const jsonResponse = JSON.parse(message.content[0].text);
    res.json(jsonResponse);
  } catch (error) {
    logger.error("Error in AI response:", error);
    next(error);
  }
};
