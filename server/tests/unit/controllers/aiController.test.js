const { getAIResponse } = require("server/controllers/aiController");
const claude = require("server/config/claude");
const logger = require("server/utils/logger");

jest.mock("server/config/claude");
jest.mock("server/utils/logger");

describe("aiController", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      params: { info: "Stark" },
    };
    mockRes = {
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAIResponse should return AI-generated response", async () => {
    const mockAIResponse = {
      content: [
        {
          text: JSON.stringify({
            type: "house",
            name: "House Stark",
            fact: "Ruled the North for thousands of years",
          }),
        },
      ],
    };
    claude.messages.create.mockResolvedValue(mockAIResponse);

    await getAIResponse(mockReq, mockRes, mockNext);

    expect(claude.messages.create).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          { role: "user", content: "Provide information about Stark" },
        ],
      })
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      type: "house",
      name: "House Stark",
      fact: "Ruled the North for thousands of years",
    });
  });

  test("getAIResponse should handle errors", async () => {
    const mockError = new Error("AI service error");
    claude.messages.create.mockRejectedValue(mockError);

    await getAIResponse(mockReq, mockRes, mockNext);

    expect(logger.error).toHaveBeenCalledWith(
      "Error in AI response:",
      mockError
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
