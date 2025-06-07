import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  adminId: number;
  email: string;
}

export function verifyToken(req: NextApiRequest): AuthPayload | null {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}
