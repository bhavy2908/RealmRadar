const request = require("supertest");
const app = require("server/server");
const { expect } = require("@jest/globals");

describe("API Endpoints", () => {
  describe("GET /api/house/:houseName", () => {
    it("should return house data", async () => {
      const houseName = "House Stark of Winterfell";
      const response = await request(app).get(`/api/house/${houseName}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nodes");
      expect(response.body).toHaveProperty("edges");
    });

    it("should return 404 for non-existent house", async () => {
      const houseName = "NonExistentHouse";
      const response = await request(app).get(`/api/house/${houseName}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "House not found");
    });
  });


  describe("GET /api/character/:characterName", () => {
    it("should return character data", async () => {
      const characterName = "Jon Snow";
      const response = await request(app).get(
        `/api/character/${characterName}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nodes");
      expect(response.body).toHaveProperty("edges");
    });

    it("should return 404 for non-existent character", async () => {
      const characterName = "NonExistentCharacter";
      const response = await request(app).get(
        `/api/character/${characterName}`
      );
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Character not found");
    });
  });


  describe("GET /api/seat/:seatName", () => {
    it("should return seat data", async () => {
      const seatName = "Scattered (formerly Winterfell)";
      const response = await request(app).get(`/api/seat/${seatName}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nodes");
      expect(response.body).toHaveProperty("edges");
    });

    it("should return 404 for non-existent seat", async () => {
      const seatName = "NonExistentSeat";
      const response = await request(app).get(`/api/seat/${seatName}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Seat not found");
    });
  });


  describe("GET /api/ai/:info", () => {
    it("should return AI response data", async () => {
      const info = "Winterfell";
      const response = await request(app).get(`/api/ai/${info}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("type");
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("fact");
    });
  });


  describe("GET /api/search/:type", () => {
    it("should return search results", async () => {
      const type = "character";
      const response = await request(app).get(`/api/search/${type}`);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should return 400 for invalid search type", async () => {
      const type = "invalidType";
      const response = await request(app).get(`/api/search/${type}`);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Invalid search type");
    });
  });
});
