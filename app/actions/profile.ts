"use server";

import { db } from "@/db";
import { users, follows } from "@/db/schema";
import { updateProfileSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: FormData) {
  try {
    // cuma user yg udh login yg bisa ganti profil
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to update profile" };
    }

    // ngambil input dari formny
    const data = {
      displayName: formData.get("displayName") as string,
      bio: formData.get("bio") as string,
    };

    // validasi isi pake zod
    const validated = updateProfileSchema.parse(data);

    // update record user di neon db
    await db
      .update(users)
      .set({
        displayName: validated.displayName,
        bio: validated.bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.userId));

    // update ui
    revalidatePath("/profile");
    revalidatePath(`/user/${user.username}`);

    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { error: error.message || "Failed to update profile" };
  }
}

export async function followUserAction(targetUserId: string) {
  try {
    // cuma user yg udh login yg bisa follow
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to follow users" };
    }

    // gaboleh follow diri sndiri wkwkkw
    if (user.userId === targetUserId) {
      return { error: "You cannot follow yourself" };
    }

    // cek udh pernah follow akun itu blm
    const [existingFollow] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, user.userId),
          eq(follows.followingId, targetUserId)
        )
      )
      .limit(1);

    if (existingFollow) {
      // klo udh penah follow, bisa unfollow
      await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, user.userId),
            eq(follows.followingId, targetUserId)
          )
        );
    } else {
      // klo blm pernah follow, gas follow
      await db.insert(follows).values({
        followerId: user.userId,
        followingId: targetUserId,
      });
    }

    // update ui lg/ sinkronisasi cache
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/users");

    return { success: true };
  } catch (error: any) {
    console.error("Follow user error:", error);
    return { error: error.message || "Failed to follow user" };
  }
}