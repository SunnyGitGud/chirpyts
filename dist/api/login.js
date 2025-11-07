import { getUserByEmail } from "../db/queries/users.js";
import { badRequest400, unAuthorized401 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { config } from "../config.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    if (!params.email || !params.password) {
        throw new badRequest400("Missing required fields");
    }
    const expiry = Math.min(Number(params.expiresInSeconds) || 3600, 3600);
    const [user] = await getUserByEmail(params.email);
    if (!user) {
        throw new badRequest400("User not found");
    }
    const valid = await checkPasswordHash(user.hashed_password, params.password);
    if (!valid) {
        throw new unAuthorized401("Invalid Password");
    }
    const token = makeJWT(user.id, expiry, config.api.secret);
    const userWithoutPass = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token
    };
    respondWithJSON(res, 200, userWithoutPass);
}
