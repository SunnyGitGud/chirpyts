import { createChirp, getChirpbyID, getChirps } from "../db/queries/chirps.js";
import { badRequest400, unAuthorized401 } from "../error.js";
import { Request, Response } from "express"
import { respondWithJSON } from "../json.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
import { ne } from "drizzle-orm";

export async function handlerchirp(req: Request, res: Response): Promise<void> {
  type parameter = {
    body: string;
  }
  const params: parameter = req.body
  const token = getBearerToken(req)
  if (!token) {
    throw new unAuthorized401("acces token unavailable")
  }
  const userId = validateJWT(token, config.jwt.secret)

  const cleaned = validateChirp(params.body)
  const Chirp = await createChirp({ body: cleaned, userId: userId })

  respondWithJSON(res, 201, Chirp)
}

export async function handlerChirpsRetrieve(_req: Request, res: Response) {
  const chirps = await getChirps();
  respondWithJSON(res, 200, chirps)
}

export async function handlerGetChirpByID(req: Request, res: Response) {
  const [chirp] = await getChirpbyID(req.params.chirpID)
  respondWithJSON(res, 200, chirp)
}

export async function handlerDeleteChirp(req: Request, res: Response) {
  const accessToken = getBearerToken(req)
  const userId = validateJWT(accessToken, config.jwt.secret)
  if (!userId) {
    throw new unAuthorized401("user not authorized")
  }
}



function validateChirp(body: string) {
  const maxChirpLength = 140;
  if (body.length > maxChirpLength) {
    throw new badRequest400(
      `Chirp is too long. Max length is ${maxChirpLength}`
    )
  }
  const badWords = ["kerfuffle", "sharbert", "fornax"];
  return getCleanedBody(body, badWords)
}

function getCleanedBody(body: string, badWords: string[]) {
  const words = body.split(" ")

  for (let i = 0; i < words.length; i++) {
    const word = words[i].toLowerCase()
    if (badWords.includes(word)) {
      words[i] = "****"
    }
  }
  const cleaned = words.join(" ")
  return cleaned
}
