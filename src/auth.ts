import * as argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { unAuthorized401 } from "./error";

export async function hashPassword(password: string) {
  const hash = await argon2.hash(password)
  return hash
}

export async function checkPasswordHash(password: string, hash: string) {
  return argon2.verify(password, hash).then(result => result).catch(() => false)
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">

export function makeJWT(userID: string, expiresIn: string | number, secret: string): string {
  const iat = Math.floor(Date.now() / 1000)
  const exp = Number(expiresIn) + iat
  const payload: payload = {
    iss: "chirpy",
    sub: userID,
    iat,
    exp
  }
  const token = jwt.sign(payload, secret)
  return token;
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    var decoded = jwt.verify(tokenString, secret) as payload
    return decoded.sub as string
  } catch {
    throw new unAuthorized401("UnAuthorized token")
  }
}

