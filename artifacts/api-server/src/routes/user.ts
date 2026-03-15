import { Router, type IRouter } from "express";
import bcrypt from 'bcryptjs';
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.put("/settings", async (req, res) => {
  const userId = (req.session as any).userId;
  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { newUsername, currentPassword, newPassword } = req.body;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  const updates: Partial<typeof usersTable.$inferInsert> = {};

  if (newUsername && newUsername !== user.username) {
    if (newUsername.length < 3 || newUsername.length > 50) {
      res.status(400).json({ error: "Username must be 3-50 characters" });
      return;
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.username, newUsername)).limit(1);
    if (existing) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }
    updates.username = newUsername;
  }

  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ error: "Current password is required to set a new password" });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No changes provided" });
    return;
  }

  await db.update(usersTable).set(updates).where(eq(usersTable.id, userId));

  const [updatedUser] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  res.json({
    userId: updatedUser.id,
    username: updatedUser.username,
    plan: updatedUser.plan,
    planExpiresAt: updatedUser.planExpiresAt,
    createdAt: updatedUser.createdAt,
  });
});

export default router;
