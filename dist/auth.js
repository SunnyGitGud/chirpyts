import * as argon2 from "argon2";
export async function hashPassword(password) {
    const hash = await argon2.hash(password);
    return hash;
}
export async function checkPasswordHash(password, hash) {
    const isValid = await argon2.verify(password, hash);
    return isValid;
}
