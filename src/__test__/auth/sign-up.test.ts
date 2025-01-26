import serverApp from "../setup/server.setup";
import request from "supertest";

import * as repositories from "@/controller/repositories";
import * as otpHelper from "@/helper/otp";
import sendEmail from "@/lib/mail";
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

    jest.spyOn(otpHelper, "generateOTps").mockReturnValue({
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
    expect(response.body).toHaveProperty("success", true);
    expect(response.body.message).toBe("Please check your email to verify");
  });
});
