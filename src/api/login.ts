import { getUserByEmail } from "../db/queries/users.js";
import { badRequest400, unAuthorized401 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { Request, Response } from "express"
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { newUser } from "../db/schema.js";
import { config } from "../config.js";
import { revokeRefreshToken, saveRefreshToken, userForRefreshToken } from "../db/queries/tokens.js";


export async function handlerLogin(req: Request, res: Response) {
  type parameter = {
    password: string;
    email: string;
    expiresInSeconds?: number
  }
  const params: parameter = req.body

  if (!params.email || !params.password) {
    throw new badRequest400("Missing required fields")
  }

  const [user] = await getUserByEmail(params.email)
  if (!user) {
    throw new badRequest400("User not found")
  }
  const valid = await checkPasswordHash(user.hashed_password, params.password)
  if (!valid) {
    throw new unAuthorized401("Invalid Password")
  }

  const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret)
  const refreshToken = makeRefreshToken()
  const saved = await saveRefreshToken(user.id, refreshToken);
  if (!saved) {
    throw new unAuthorized401("could to save the refersh token")
  }
  type UserWithoutPass = Omit<newUser, "hashed_password"> & { token: string; refreshToken: string };
  const userWithoutPass: UserWithoutPass = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token,
    refreshToken,
    isChirpyRed: user.isChirpyRed
  };

  respondWithJSON(res, 200, userWithoutPass)
}

export async function handleRefresh(req: Request, res: Response) {
  const token = getBearerToken(req)
  const result = await userForRefreshToken(token)
  if (!result) {
    throw new unAuthorized401("invalid refresh token")
  }
  const user = result.user
  const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret)
  type response = {
    token: string
  }
  respondWithJSON(res, 200, {
    token: accessToken
  } satisfies response)
}

export async function handleRevoke(req: Request, res: Response) {
  const refreshToken = getBearerToken(req)
  await revokeRefreshToken(refreshToken)
  res.status(204).send();
}
