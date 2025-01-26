import serverApp from "../setup/server.setup";
import bcrypt from "bcrypt";
import * as repositories from "@/controller/repositories";
import request from "supertest";
import errorMocks from "../mocks/error.mocks";
jest.mock("@/controller/repositories");
jest.mock("bcrypt");
describe("VerifyEmail Route", () => {
  let app: ReturnType<typeof serverApp>;
  beforeAll(() => {
    app = serverApp();
  });

  it("Should return 200 and Verify Email Successfully", async () => {
    const data = {
      email: "test@example.com",
      token: "token123",
    };

    jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
      id: "random-uuid",
      email: "test@example.com",
      isVerified: false,
    });

    jest.spyOn(repositories, "findTokenByIdentifier").mockResolvedValue({
      token: await bcrypt.hash("token123", 10),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    jest.spyOn(repositories, "updateUserVerifyStatus").mockResolvedValue({
      id: "random-uuid",
      email: "test@example.com",
      isVerified: true,
    });

    jest.spyOn(repositories, "deleteAllTokensByIdentifier").mockResolvedValue();

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const response = await request(app).post("/api/auth/verify-otp").send(data);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(
      "Email verified successfully, Try to sign in"
    );
  });

  test.each(errorMocks)(
    "$name",
    async ({ mocks, expectedStatus, expectedMessage }) => {
      const data = {
        email: "test@example.com",
        token: "token123",
      };
      mocks();

      const response = await request(app)
        .post("/api/auth/verify-otp")
        .send(data);

      expect(response.status).toBe(expectedStatus);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(expectedMessage);
    }
  );
});
