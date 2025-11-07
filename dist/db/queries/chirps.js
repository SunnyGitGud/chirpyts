import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirp(chirp) {
    const [rows] = await db.insert(chirps).values(chirp).returning();
    return rows;
}
export async function getChirps() {
    return db.select().from(chirps);
}
export async function getChirpbyID(chirpID) {
    return db.select().from(chirps).where(eq(chirps.id, chirpID));
}
export async function deleteChirp(id) {
    const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning();
    return rows.length > 0;
}
