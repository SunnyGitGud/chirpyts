import { createChirp } from "../db/queries/chirps.js";
import { badRequest400 } from "../error.js";
import { respondWithJSON } from "../json.js";
export async function handlerchirp(req, res) {
    const params = req.body;
    const cleaned = validateChirp(params.body);
    const Chirp = await createChirp({ body: cleaned, userId: params.userId });
    respondWithJSON(res, 201, Chirp);
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
