import jwt from "jsonwebtoken";


type PayloadOpts =  {
  id: string;
  role: string;
  isVerified?: boolean;
}


export async function generateAccessToken({
  id,
  role,
  isVerified
}: PayloadOpts) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "15s" });
}

export async function generateRefreshToken({
  id,
  role,
  isVerified
}:PayloadOpts) {
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
  isVerified
}: PayloadOpts) {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken({ id, role, isVerified }),
    generateRefreshToken({ id, role, isVerified }),
  ]);
  return {
    accessToken,
    refreshToken,
  };
}
