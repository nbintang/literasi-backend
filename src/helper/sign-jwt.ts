import jwt from "jsonwebtoken";
import { secret } from "../lib/env";
export async function signJwt({ id }: { id: number }) {
  if (!secret) throw new Error("JWT secret is not defined");
  return jwt.sign({ id }, secret, { expiresIn: "15m" });
}
