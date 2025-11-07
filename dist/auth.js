import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    const isValid = await argon2.verify(password, hash);
    return isValid;
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
    var decoded = jwt.verify(tokenString, secret);
    return decoded.sub;
}
