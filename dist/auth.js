import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { unAuthorized401 } from "./error.js";
import crypto from "crypto";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    return argon2.verify(password, hash).then(result => result).catch(() => false);
}
export function makeJWT(userID, expiresIn, secret) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = Number(expiresIn) + iat;
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat,
        exp
    };
    const token = jwt.sign(payload, secret);
    return token;
}
export function validateJWT(tokenString, secret) {
    try {
        var decoded = jwt.verify(tokenString, secret);
        return decoded.sub;
    }
    catch {
        throw new unAuthorized401("UnAuthorized token");
    }
}
export function getBearerToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        throw new unAuthorized401("missing auth header ");
    }
    if (!authHeader.startsWith("Bearer ")) {
        throw new unAuthorized401("invalid auth format");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new unAuthorized401("Empty Bearer token");
    }
    return token;
}
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString("hex");
}
