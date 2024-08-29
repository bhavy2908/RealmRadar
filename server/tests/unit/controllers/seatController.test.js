const { getSeatData } = require("server/controllers/seatController");
const { getSession } = require("server/config/database");
const { formatNeo4jResult } = require("server/utils/formatters");
const logger = require("server/utils/logger");

jest.mock("server/config/database");
jest.mock("server/utils/formatters");
jest.mock("server/utils/logger");

describe("seatController", () => {
  let mockSession, mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockSession = {
      run: jest.fn(),
      close: jest.fn(),
    };
    getSession.mockReturnValue(mockSession);

    mockReq = {
      params: { seatName: "Scattered (formerly Winterfell)" },
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

  test("getSeatData should return seat data when found", async () => {
    const mockRecords = [{ get: jest.fn() }];
    mockSession.run.mockResolvedValue({ records: mockRecords });
    formatNeo4jResult.mockReturnValue({ nodes: [], edges: [] });

    await getSeatData[1](mockReq, mockRes, mockNext);

    expect(mockSession.run).toHaveBeenCalledWith(expect.any(String), {
      seatName: "Scattered (formerly Winterfell)",
    });
    expect(formatNeo4jResult).toHaveBeenCalledWith(mockRecords);
    expect(mockRes.json).toHaveBeenCalledWith({ nodes: [], edges: [] });
    expect(mockSession.close).toHaveBeenCalled();
  });

  test("getSeatData should return 404 when seat is not found", async () => {
    mockSession.run.mockResolvedValue({ records: [] });

    await getSeatData[1](mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Seat not found" });
    expect(mockSession.close).toHaveBeenCalled();
  });

  test("getSeatData should handle errors", async () => {
    const mockError = new Error("Database error");
    mockSession.run.mockRejectedValue(mockError);

    await getSeatData[1](mockReq, mockRes, mockNext);

    expect(logger.error).toHaveBeenCalledWith(
      "Error fetching seat data:",
      mockError
    );
    expect(mockNext).toHaveBeenCalledWith(mockError);
    expect(mockSession.close).toHaveBeenCalled();
  });
});
