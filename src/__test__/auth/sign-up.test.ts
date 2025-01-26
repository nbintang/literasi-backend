import serverApp from "../setup/server.setup";
import request from "supertest";

import * as repositories from "@/controller/repositories";
import * as otpHelper from "@/helper/otp";
import sendEmail from "@/lib/mail";
import { PayloadError } from "@/helper/error-response";
interface SignUp {
  email: string;
  password: string;
  name: string;
}
jest.mock("@/controller/repositories");
jest.mock("@/helper/otp");
jest.mock("@/lib/mail");

describe("SignUp Route", () => {
  let app: ReturnType<typeof serverApp>;

  beforeAll(() => {
    app = serverApp();
  });

  it("Should return 200 and Email sent successfully", async () => {
    const data: SignUp = {
      email: "test@example.com",
      password: "password123",
      name: "John Doe",
    };
    jest
      .spyOn(repositories, "findUserByEmailWithProfile")
      .mockResolvedValue(null);
    jest.spyOn(repositories, "createUser").mockResolvedValue({
      id: "1",
      email: "test@example.com",
      name: "John Doe",
      image: null,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    jest.spyOn(otpHelper, "generateOtps").mockReturnValue({
      otp: "123456",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    jest.spyOn(repositories, "createToken").mockResolvedValue({
      id: "1",
      token: "token123",
      userId: "1",
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    (sendEmail as jest.Mock).mockResolvedValue(true);
    const response = await request(app).post("/api/auth/signup").send(data);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Please check your email to verify");
  });

  it("Should return 400 and User already exists", async () => {
    const data: SignUp = {
      email: "test@example.com",
      password: "password123",
      name: "John Doe",
    };
    jest.spyOn(repositories, "findUserByEmailWithProfile").mockResolvedValue({
      id: "1",
      email: "test@example.com",
      name: "John Doe",
      isVerified: true,
      password: "password123",
      profile: {
        image: null,
        role: "USER",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).post("/api/auth/signup").send(data);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User already exists");
  });

  it("Should return 500 and Sign up failed", async () => {
    const data: SignUp = {
      email: "test@example.com",
      password: "password123",
      name: "John Doe",
    };

    jest
      .spyOn(repositories, "findUserByEmailWithProfile")
      .mockResolvedValue(null);
    jest
      .spyOn(repositories, "createUser")
      .mockRejectedValue(new PayloadError("Sign up failed"));
    const response = await request(app).post("/api/auth/signup").send(data);
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Sign up failed");
  });
});
