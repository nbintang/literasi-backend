import jwt from "jsonwebtoken";

export async function generateAccessToken({
  id,
  role,
  time = "15s",
}: {
  role: string;
  id: string;
  time?: string;
}) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: time });
}

export async function generateRefreshToken({
  id,
  role,
}: {
  id: string;
  role: string;
}) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

export async function generateTokens({
  id,
  role,
}: {
  id: string;
  role: string;
}) {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken({ id, role }),
    generateRefreshToken({ id, role }),
  ]);
  return {
    accessToken,
    refreshToken,
  };
}
