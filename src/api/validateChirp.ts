import { badRequest400 } from "../error.js";
import { Response, Request } from "express"

export async function handlerchirp(req: Request, res: Response): Promise<void> {
  const parsedBody = req.body
  if (typeof parsedBody.body !== "string") {
    throw new badRequest400("Chirp is required")
  }

  if (parsedBody.body.length > 140) {
    throw new badRequest400("Chirp is too long. Max length is 140")
  }
  const profaneWords = ["kerfuffle", "sharbert", "fornax"];
  const words = parsedBody.body.split(" ")

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    for (const bad of profaneWords) {
      if (w.toLowerCase() === bad.toLowerCase()) {
        words[i] = "****";
        break;
      }
    }
  }
  const cleanedBody = words.join(" ");
  res.status(200).json({ cleanedBody: cleanedBody })
}

