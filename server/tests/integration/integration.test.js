const request = require("supertest");
const app = require("server/server");
const { initializeDatabase } = require("server/config/database");
const claude = require("server/config/claude");

jest.mock("server/config/claude");

describe("API Integration Tests", () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  describe("GET /api/house/:houseName", () => {
    it("should return house data for existing house", async () => {
      const response = await request(app)
        .get("/api/house/House Stark of Winterfell")
        .expect(200);

      expect(response.body).toHaveProperty("nodes");
      expect(response.body).toHaveProperty("edges");
      expect(response.body.nodes.length).toBeGreaterThan(0);
      expect(response.body.nodes[0].data.label).toBe(
        "House Stark of Winterfell"
      );
    });

    it("should return 404 for non-existent house", async () => {
      await request(app).get("/api/house/NonExistent").expect(404);
    });
  });

  describe("GET /api/character/:characterName", () => {
    it("should return character data for existing character", async () => {
      const response = await request(app)
        .get("/api/character/Jon%20Snow")
        .expect(200);

      expect(response.body).toHaveProperty("nodes");
      expect(response.body).toHaveProperty("edges");
      expect(response.body.nodes.length).toBeGreaterThan(0);
      expect(response.body.nodes[0].data.label).toBe("Jon Snow");
    });

    it("should return 404 for non-existent character", async () => {
      await request(app).get("/api/character/NonExistent").expect(404);
    });
  });

  describe("GET /api/seat/:seatName", () => {
    it("should return seat data for existing seat", async () => {
      const response = await request(app)
        .get("/api/seat/Scattered (formerly Winterfell)")
        .expect(200);

      expect(response.body).toHaveProperty("nodes");
      expect(response.body).toHaveProperty("edges");
      expect(response.body.nodes.length).toBeGreaterThan(0);
      expect(response.body.nodes[0].data.label).toBe(
        "Scattered (formerly Winterfell)"
      );
    });

    it("should return 404 for non-existent seat", async () => {
      await request(app).get("/api/seat/NonExistent").expect(404);
    });
  });

  describe("GET /api/ai/:info", () => {
    it("should return AI-generated response", async () => {
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

      const response = await request(app).get("/api/ai/Stark").expect(200);

      expect(response.body).toHaveProperty("type", "house");
      expect(response.body).toHaveProperty("name", "House Stark");
      expect(response.body).toHaveProperty("fact");
    });

    it("should handle AI service errors", async () => {
      claude.messages.create.mockRejectedValue(new Error("AI service error"));

      await request(app).get("/api/ai/Stark").expect(500);
    });
  });

  describe("GET /api/search/:type", () => {
    it("should return search results for characters", async () => {
      const response = await request(app)
        .get("/api/search/character")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toContain("Jon Snow");
    });

    it("should return search results for houses", async () => {
      const response = await request(app).get("/api/search/house").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toContain("House Stark of Winterfell");
    });

    it("should return search results for seats", async () => {
      const response = await request(app).get("/api/search/seat").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toContain("Scattered (formerly Winterfell)");
    });

    it("should return 400 for invalid search type", async () => {
      await request(app).get("/api/search/invalid").expect(400);
    });
  });
});
