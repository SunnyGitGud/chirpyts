import { Request, Response } from "express";
import { upgradeUserbyID } from "../db/queries/users.js";
import { config } from "../config.js";
import { getAPIKey } from "../auth.js";


export async function upgradeUser(req: Request, res: Response) {
  type parameters = {
    event: string,
    data: { userId: string },
  }
  const param: parameters = req.body
  if (param.event !== "user.upgraded") {
    res.status(204).send();
    return;
  }
  const polkaapikey = await getAPIKey(req)
  if (polkaapikey === config.api.polkaKey) {
    await upgradeUserbyID(param.data.userId)
    res.status(204).send()
  }
  res.status(401).send
}
