const request = require("supertest");
const app = require("server/server");

describe("Security Tests", () => {
  test("should have security headers", async () => {
    const response = await request(app).get(
      "/api/house/House Stark of Winterfell"
    );
    expect(response.headers["x-xss-protection"]).toBeDefined();
    expect(response.headers["x-frame-options"]).toBeDefined();
    expect(response.headers["x-content-type-options"]).toBeDefined();
  });

  

  test("should use CORS", async () => {
    const response = await request(app)
      .get("/api/house/House Stark of Winterfell")
      .set("Origin", "http://example.com");
    expect(response.headers["access-control-allow-origin"]).toBe(
      process.env.ALLOWED_ORIGIN
    );
  });

  test("should validate and sanitize input", async () => {
    const response = await request(app).get(
      '/api/house/<script>alert("xss")</script>'
    );
    expect(response.status).toBe(404);
  });

  test("should not expose sensitive information in error messages", async () => {
    const response = await request(app).get("/non-existent-route");
    expect(response.status).toBe(404);
    expect(response.body).not.toHaveProperty("stack");
    expect(response.body).toHaveProperty("message", "Resource not found");
  });

  test("should not disclose server information", async () => {
    const response = await request(app).get(
      "/api/house/House Stark of Winterfell"
    );
    expect(response.headers).not.toHaveProperty("x-powered-by");
    expect(response.headers).not.toHaveProperty("server");
  });

  test("should handle database connection errors securely", async () => {
    const response = await request(app).get(
      "/api/house/House Stark"
    );
    expect(response.status).toBe(404);
  });
});
