import { badRequest400, unAuthorized401 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { createUser, updateUserbyID } from "../db/queries/users.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";
export async function handlerUsersCreate(req, res) {
    const params = req.body;
    if (!params.email || !params.password) {
        throw new badRequest400("Missing required fields");
    }
    const hashedPass = await hashPassword(params.password);
    const user = await createUser({ email: params.email, hashed_password: hashedPass });
    if (!user) {
        throw new Error("Could not create user");
    }
    const userWithoutPass = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed
    };
    respondWithJSON(res, 201, userWithoutPass);
}
export async function handlerUpdateUser(req, res) {
    const accessToken = getBearerToken(req);
    if (!accessToken) {
        throw new unAuthorized401("acces token unavailable");
    }
    const userId = validateJWT(accessToken, config.jwt.secret);
    const params = req.body;
    if (!params.email || !params.password) {
        throw new unAuthorized401("email and password unavailable");
    }
    const hashedPass = await hashPassword(params.password);
    const [update] = await updateUserbyID(userId, params.email, hashedPass);
    if (!update) {
        throw new unAuthorized401("failed to update email and password");
    }
    const userWithoutPass = {
        id: update.id,
        email: update.email,
        createdAt: update.createdAt,
        updatedAt: update.updatedAt,
        isChirpyRed: update.isChirpyRed
    };
    respondWithJSON(res, 200, userWithoutPass);
}
