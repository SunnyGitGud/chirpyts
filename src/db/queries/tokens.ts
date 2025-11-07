import { db } from "../index.js"
import { and, eq, gt, isNull } from "drizzle-orm"
import { refreshToken, users } from "../schema.js"
import { config } from "../../config.js";


export async function saveRefreshToken(userID: string, token: string) {
  const rows = await db
    .insert(refreshToken)
    .values({
      user_id: userID,
      token: token,
      expires_at: new Date(Date.now() + config.jwt.refreshDuration),
      revoked_at: null,
    })
    .returning();

  return rows.length > 0;
}

export async function userForRefreshToken(token: string) {
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refreshToken, eq(users.id, refreshToken.user_id))
    .where(
      and(
        eq(refreshToken.token, token),
        isNull(refreshToken.revoked_at),
        gt(refreshToken.expires_at, new Date()),
      ),
    )
    .limit(1);

  return result;
}

export async function revokeRefreshToken(token: string) {
  const rows = await db
    .update(refreshToken)
    .set({ expires_at: new Date() })
    .where(eq(refreshToken.token, token))
    .returning();

  if (rows.length === 0) {
    throw new Error("Couldn't revoke token");
  }
}
