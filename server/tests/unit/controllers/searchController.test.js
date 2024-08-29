const { search } = require("server/controllers/searchController");
const { getSession } = require("server/config/database");
const logger = require("server/utils/logger");

jest.mock("server/config/database");
jest.mock("server/utils/logger");

describe("searchController", () => {
  let mockSession, mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockSession = {
      run: jest.fn(),
      close: jest.fn(),
    };
    getSession.mockReturnValue(mockSession);

    mockReq = {
      params: { type: "character" },
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

  test("search should return search results for valid type", async () => {
    const mockRecords = [
      { get: jest.fn().mockReturnValue("Jon Snow") },
      { get: jest.fn().mockReturnValue("Daenerys Targaryen") },
    ];
    mockSession.run.mockResolvedValue({ records: mockRecords });

    await search(mockReq, mockRes, mockNext);

    expect(mockSession.run).toHaveBeenCalledWith(
      expect.stringContaining("Character")
    );
    expect(mockRes.json).toHaveBeenCalledWith([
      "Jon Snow",
      "Daenerys Targaryen",
    ]);
    expect(mockSession.close).toHaveBeenCalled();
  });

  test("search should return 400 for invalid search type", async () => {
    mockReq.params.type = "invalid";

    await search(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid search type" });
    expect(mockSession.close).not.toHaveBeenCalled();
  });

  test("search should handle errors", async () => {
    const mockError = new Error("Database error");
    mockSession.run.mockRejectedValue(mockError);

    await search(mockReq, mockRes, mockNext);

    expect(logger.error).toHaveBeenCalledWith(
      "Error performing search:",
      mockError
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockSession.close).toHaveBeenCalled();
  });
});
