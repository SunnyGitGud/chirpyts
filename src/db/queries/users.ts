import { eq } from "drizzle-orm";
import { db } from "../index.js"
import { newUser, users } from "../schema.js"

export async function createUser(user: newUser) {
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

export async function getUserByEmail(emailIn: string) {
  return db.select().from(users).where(eq(users.email, emailIn))
}

