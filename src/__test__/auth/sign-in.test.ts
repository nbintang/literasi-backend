import request from "supertest";
import passport from "passport";
import serverApp from "../setup/server.setup";
import {
  mockServerError,
  mockInvalidUser,
  mockValidUser,
} from "../mocks/passport.mocks";

describe("SignIn Route", () => {
  let app: ReturnType<typeof serverApp>;

  beforeAll(() => {
    app = serverApp();
  });

  it("Should return 200 and tokens for a valid user", async () => {
    passport.authenticate = mockValidUser();

    const response = await request(app)
      .post("/api/auth/signin")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.message).toBe("Welcome!...");
    expect(response.headers["set-cookie"][0]).toContain("refreshToken");
  });

  it("Should return 401 for invalid user", async () => {
    passport.authenticate = mockInvalidUser();

    const response = await request(app)
      .post("/api/auth/signin")
      .send({ email: "wrong@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  it("Should return 500 on server error", async () => {
    passport.authenticate = mockServerError();

    const response = await request(app)
      .post("/api/auth/signin")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("success", false);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});
