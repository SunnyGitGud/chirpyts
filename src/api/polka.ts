import { Request, Response } from "express";
import { upgradeUserbyID } from "../db/queries/users.js";
import { notFound404 } from "../error.js";


export async function upgradeUser(req: Request, res: Response) {
  type parameters = {
    event: string,
    data: { userId: string }
  }
  const param: parameters = req.body
  if (param.event !== "user.upgraded") {
    res.status(204).send();
    return;
  }
  await upgradeUserbyID(param.data.userId)
  res.status(204).send()
}
