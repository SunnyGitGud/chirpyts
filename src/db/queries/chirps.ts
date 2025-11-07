import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [rows] = await db.insert(chirps).values(chirp).returning();
  return rows;
}

export async function getChirps() {
  return db.select().from(chirps)
}

export async function getChirpbyID(chirpID: string) {
  return db.select().from(chirps).where(eq(chirps.id, chirpID))
}

