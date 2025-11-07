import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { users } from "../schema.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function reset() {
    await db.delete(users);
}
export async function getUserByEmail(emailIn) {
    return db.select().from(users).where(eq(users.email, emailIn));
}
