
import request from "supertest";
import serverApp from "./setup/server.setup";


describe("Express Server App", () => {
  const app = serverApp();
  it("Should return Hello World", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hello World");
  });

  it("Should Allow Cross-Origin Resource Sharing Request", async () => {
    const response = await request(app)
      .get("/")
      .set("Origin", "http://localhost:3000");
    expect(response.status).toBe(200);
  });
});
