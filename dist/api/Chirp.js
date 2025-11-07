import { createChirp, getChirpbyID, getChirps } from "../db/queries/chirps.js";
import { badRequest400, unAuthorized401 } from "../error.js";
import { respondWithJSON } from "../json.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
export async function handlerchirp(req, res) {
    const params = req.body;
    const token = getBearerToken(req);
    if (!token) {
        throw new unAuthorized401("acces token unavailable");
    }
    const userId = validateJWT(token, config.jwt.secret);
    const cleaned = validateChirp(params.body);
    const Chirp = await createChirp({ body: cleaned, userId: userId });
    respondWithJSON(res, 201, Chirp);
}
export async function handlerChirpsRetrieve(_req, res) {
    const chirps = await getChirps();
    respondWithJSON(res, 200, chirps);
}
export async function handlerGetChirpByID(req, res) {
    const [chirp] = await getChirpbyID(req.params.chirpID);
    respondWithJSON(res, 200, chirp);
}
function validateChirp(body) {
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new badRequest400(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    return getCleanedBody(body, badWords);
}
function getCleanedBody(body, badWords) {
    const words = body.split(" ");
    for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase();
        if (badWords.includes(word)) {
            words[i] = "****";
        }
    }
    const cleaned = words.join(" ");
    return cleaned;
}
