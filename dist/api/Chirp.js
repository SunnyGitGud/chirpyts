import { createChirp, deleteChirp, getChirpbyID, getChirps } from "../db/queries/chirps.js";
import { badRequest400, forbidden403, notFound404, unAuthorized401 } from "../error.js";
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
    if (!chirp) {
        throw new notFound404(`Chirp not found`);
    }
    respondWithJSON(res, 200, chirp);
}
export async function handlerChirpsDelete(req, res) {
    const { chirpId } = req.params;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwt.secret);
    const [chirp] = await getChirpbyID(chirpId);
    if (!chirp) {
        throw new notFound404(`Chirp with chirpId: ${chirpId} not found`);
    }
    if (chirp.userId !== userId) {
        throw new forbidden403("You can't delete this chirp");
    }
    const deleted = await deleteChirp(chirpId);
    if (!deleted) {
        throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
    }
    res.status(204).send();
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
