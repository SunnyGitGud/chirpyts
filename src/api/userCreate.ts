import { badRequest400 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { Request, Response } from "express"
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";
import { newUser } from "../db/schema.js";

export async function handlerUsersCreate(req: Request, res: Response): Promise<void> {
  type parameters = {
    email: string;
    password: string;
  }
  const params: parameters = req.body

  if (!params.email || !params.password) {
    throw new badRequest400("Missing required fields")
  }
  const hashedPass = await hashPassword(params.password)
  const user = await createUser({ email: params.email, hashed_password: hashedPass })
  if (!user) {
    throw new Error("Could not create user")
  }

  type UserWithoutPass = Omit<newUser, "hashed_password">;
  const userWithoutPass: UserWithoutPass = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  respondWithJSON(res, 201, userWithoutPass)
}

