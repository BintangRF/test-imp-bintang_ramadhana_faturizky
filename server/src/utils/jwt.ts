import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET as string;
const expiresIn = "1d";

export function signJWT(payload: object) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, secret);
}
