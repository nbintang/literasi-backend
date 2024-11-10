import jwt from "jsonwebtoken";

export async function generateAccessToken({
  id,
  time = "15s",
}: {
  id: string;
  time?: string;
}) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: time });
}

export async function generateRefreshToken({ id }: { id: string }) {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
