import { getUserByEmail } from "../db/queries/users.js";
import { badRequest400, unAuthorized401 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { checkPasswordHash } from "../auth.js";
export async function handlerLogin(req, res) {
    const params = req.body;
    if (!params.email || !params.password) {
        throw new badRequest400("Missing required fields");
    }
    const [user] = await getUserByEmail(params.email);
    if (!user) {
        throw new badRequest400("User not found");
    }
    const valid = await checkPasswordHash(user.hashed_password, params.password);
    if (!valid) {
        throw new unAuthorized401("Invalid Password");
    }
    const userWithoutPass = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    respondWithJSON(res, 200, userWithoutPass);
}
