const {
  getCharacterData,
} = require("server/controllers/characterController");
const { getSession } = require("server/config/database");
const { formatNeo4jResult } = require("server/utils/formatters");
const logger = require("server/utils/logger");

jest.mock("server/config/database");
jest.mock("server/utils/formatters");
jest.mock("server/utils/logger");

describe("characterController", () => {
  let mockSession, mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockSession = {
      run: jest.fn(),
      close: jest.fn(),
    };
    getSession.mockReturnValue(mockSession);

    mockReq = {
      params: { characterName: "Jon Snow" },
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getCharacterData should return character data when found", async () => {
    const mockRecords = [{ get: jest.fn() }];
    mockSession.run.mockResolvedValue({ records: mockRecords });
    formatNeo4jResult.mockReturnValue({ nodes: [], edges: [] });

    await getCharacterData[1](mockReq, mockRes, mockNext);

    expect(mockSession.run).toHaveBeenCalledWith(expect.any(String), {
      characterName: "Jon Snow",
    });
    expect(formatNeo4jResult).toHaveBeenCalledWith(mockRecords);
    expect(mockRes.json).toHaveBeenCalledWith({ nodes: [], edges: [] });
    expect(mockSession.close).toHaveBeenCalled();
  });

  test("getCharacterData should return 404 when character is not found", async () => {
    mockSession.run.mockResolvedValue({ records: [] });

    await getCharacterData[1](mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Character not found",
    });
    expect(mockSession.close).toHaveBeenCalled();
  });

  test("getCharacterData should handle errors", async () => {
    const mockError = new Error("Database error");
    mockSession.run.mockRejectedValue(mockError);

    await getCharacterData[1](mockReq, mockRes, mockNext);

    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching character data:",
      mockError
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockSession.close).toHaveBeenCalled();
  });
});
