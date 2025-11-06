import { badRequest400 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { Request, Response } from "express"
import { createUser } from "../db/queries/users.js";

export async function handlerUsersCreate(req: Request, res: Response): Promise<void> {
  type parameters = {
    email: string;
  }
  const params: parameters = req.body

  if (!params.email) {
    throw new badRequest400("Missing required fields")
  }
  const user = await createUser({ email: params.email })
  if (!user) {
    throw new Error("Could not create user")
  }
  respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  })
}

