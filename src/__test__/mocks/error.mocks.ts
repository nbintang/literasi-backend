import * as repositories from "@/controller/repositories";
import bcrypt from 'bcrypt';
const errorMocks = [
    {
        name: "should return 404 if token is not found",
        mocks: async () => {
          jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
            id: "random-uuid",
            email: "test@example.com",
            isVerified: false,
          });
          jest.spyOn(repositories, "findTokenByIdentifier").mockResolvedValue(null as unknown as { token: string; expiresAt: Date }); // Return null to simulate token not found
        },
        expectedStatus: 404,
        expectedMessage: "Token not found",
      },
      
    {
      name: "should return 400 if user is already verified",
      mocks: async () => {
        jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
          id: "random-uuid",
          email: "test@example.com",
          isVerified: true,
        });
      },
      expectedStatus: 400,
      expectedMessage: "Email already verified",
    },
    {
      name: "should return 404 if token is not found",
      mocks: async () => {
        jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
          id: "random-uuid",
          email: "test@example.com",
          isVerified: false,
        });
        jest.spyOn(repositories, "findTokenByIdentifier").mockResolvedValue(null as unknown as { token: string; expiresAt: Date });
      },
      expectedStatus: 404,
      expectedMessage: "Token not found",
    },
    {
      name: "should return 400 if token is expired",
      mocks: async () => {
        jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
          id: "random-uuid",
          email: "test@example.com",
          isVerified: false,
        });
        jest.spyOn(repositories, "findTokenByIdentifier").mockResolvedValue({
          token: await bcrypt.hash("token123", 10),
          expiresAt: new Date(Date.now() - 1000), // Expired token
        });
      },
      expectedStatus: 400,
      expectedMessage: "Token expired",
    },
    {
      name: "should return 400 if token is invalid",
      mocks:async () => {
        jest.spyOn(repositories, "findEmailWithToken").mockResolvedValue({
          id: "random-uuid",
          email: "test@example.com",
          isVerified: false,
        });
        jest.spyOn(repositories, "findTokenByIdentifier").mockResolvedValue({
          token: await bcrypt.hash("token123", 10),
          expiresAt: new Date(Date.now() + 1000), // Valid token expiry
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Invalid token
      },
      expectedStatus: 400,
      expectedMessage: "Invalid token",
    },
  ];

  export default errorMocks