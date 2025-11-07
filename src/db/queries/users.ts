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

export async function updateUserbyID(userID: string, email: string, hashed_password: string) {
  return db
    .update(users)
    .set({
      email,
      hashed_password,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userID))
    .returning();
}



