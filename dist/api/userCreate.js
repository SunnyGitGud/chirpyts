import { badRequest400 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";
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
    };
    respondWithJSON(res, 201, userWithoutPass);
}
