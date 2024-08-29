const { getHouseData } = require("server/controllers/houseController");
const { getSession } = require("server/config/database");
const { formatNeo4jResult } = require("server/utils/formatters");
const logger = require("server/utils/logger");

jest.mock("server/config/database");
jest.mock("server/utils/formatters");
jest.mock("server/utils/logger");

describe("houseController", () => {
  let mockSession, mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockSession = {
      run: jest.fn(),
      close: jest.fn(),
    };
    getSession.mockReturnValue(mockSession);

    mockReq = {
      params: { houseName: "House Stark of Winterfell" },
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

  test("getHouseData should return house data when found", async () => {
    const mockRecords = [{ get: jest.fn() }];
    mockSession.run.mockResolvedValue({ records: mockRecords });
    formatNeo4jResult.mockReturnValue({ nodes: [], edges: [] });

    await getHouseData[1](mockReq, mockRes, mockNext);

    expect(mockSession.run).toHaveBeenCalledWith(expect.any(String), {
      houseName: "House Stark of Winterfell",
    });
    expect(formatNeo4jResult).toHaveBeenCalledWith(mockRecords);
    expect(mockRes.json).toHaveBeenCalledWith({ nodes: [], edges: [] });
    expect(mockSession.close).toHaveBeenCalled();
  });

  test("getHouseData should return 404 when house is not found", async () => {
    mockSession.run.mockResolvedValue({ records: [] });

    await getHouseData[1](mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "House not found" });
    expect(mockSession.close).toHaveBeenCalled();
  });

  test("getHouseData should handle errors", async () => {
    const mockError = new Error("Database error");
    mockSession.run.mockRejectedValue(mockError);

    await getHouseData[1](mockReq, mockRes, mockNext);

    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching house data:",
      mockError
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockSession.close).toHaveBeenCalled();
  });
});
