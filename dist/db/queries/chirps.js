import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirp(chirp) {
    const [rows] = await db.insert(chirps).values(chirp).returning();
    return rows;
}
