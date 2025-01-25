import { Application, Request, Response, NextFunction } from "express";
import passport from "passport";
import { localConfigMiddleware } from "@/middleware";
import { authMiddleware } from "@/middleware";
import { signIn } from "@/controller/services";
import request from "supertest";
import express from "express";

jest.mock("passport", () => ({
  use: jest.fn(),
  authenticate: jest.fn(),
  initialize: jest.fn(),
  session: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
}));

describe("POST /signin", () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    localConfigMiddleware(app);

    (passport.authenticate as jest.Mock).mockImplementationOnce(
      (strategy, options, callback) => {
        callback(null, {
          id: "1",
          accessToken: "validAccessToken",
          refreshToken: "validRefreshToken",
        });
      }
    );

    app.post("/signin", authMiddleware("local"), signIn);
  });

  it("should successfully sign in and return tokens", async () => {
    const response = await request(app).post("/signin").send({
      email: "user@example.com",
      password: "validPassword",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toBe("validAccessToken");
    expect(response.body.refreshToken).toBe("validRefreshToken");
  });

  it("should return 401 if user is not found", async () => {
    (passport.authenticate as jest.Mock).mockImplementationOnce(
      (strategy, options, callback) => {
        callback(null, false, { message: "User not found" });
      }
    );

    const response = await request(app).post("/signin").send({
      email: "nonexistent@example.com",
      password: "somePassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  it("should return 401 if password is incorrect", async () => {
    (passport.authenticate as jest.Mock).mockImplementationOnce(
      (strategy, options, callback) => {
        callback(null, false, { message: "Incorrect Password" });
      }
    );

    const response = await request(app).post("/signin").send({
      email: "user@example.com",
      password: "wrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Incorrect Password");
  });

  it("should return 401 if email is not verified", async () => {
    // Mock authentication failure: email not verified
    (passport.authenticate as jest.Mock).mockImplementationOnce(
      (strategy, options, callback) => {
        callback(null, false, { message: "Please verify your email" });
      }
    );

    const response = await request(app).post("/signin").send({
      email: "user@example.com",
      password: "validPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Please verify your email");
  });
});
