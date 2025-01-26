import serverApp from "../setup/server.setup";
import * as repositories from "@/controller/repositories";
import * as otpHelper from "@/helper/otp";
import sendEmail from "@/lib/mail";
import request from "supertest";
jest.mock("@/controller/repositories");
jest.mock("@/helper/otp");
jest.mock("@/lib/mail");
describe("ReSendEmail Route", () => {
  let app: ReturnType<typeof serverApp>;

  beforeAll(() => {
    app = serverApp();
  });

  it("Should return 200 and Email sent successfully", async () => {
    const data = { email: "test@example.com" };

    jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
      id: "random-uuid",
      email: "test@example.com",
      isVerified: false,
    });

    jest.spyOn(otpHelper, "generateOtps").mockReturnValue({
      otp: "123456",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    jest.spyOn(repositories, "deleteAllTokensByIdentifier").mockResolvedValue();
    jest.spyOn(repositories, "createToken").mockResolvedValue({
      id: "1",
      token: "token123",
      userId: "1",
      expiresAt: new Date(),
      createdAt: new Date(),
    });

    (sendEmail as jest.Mock).mockResolvedValue(true);

    const response = await request(app).post("/api/auth/resend-otp").send(data);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Verification code sent successfully, please check your email"
    );
  });

  it("Should return 404 and User not found", async () => {
    const data = { email: "test@example.com" };

    jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue(null);

    const response = await request(app).post("/api/auth/resend-otp").send(data);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  it("Should return 400 and Email already verified", async () => {
    const data = { email: "test@example.com" };

    jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
      id: "random-uuid",
      email: "test@example.com",
      isVerified: true,
    });

    const response = await request(app).post("/api/auth/resend-otp").send(data);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Email already verified");
  });
});
