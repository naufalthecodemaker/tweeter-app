"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { registerSchema, loginSchema } from "@/lib/validations";
import { signToken, setAuthCookie, removeAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  try {
    // mengambil input dari form
    const data = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      displayName: formData.get("displayName") as string,
    };

    // validasi skema Zod utk mastiin data sesuai format
    const validated = registerSchema.parse(data);

    // mastiin email & username belum terdaftar di neon db biar gada data duplikat
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { error: "User with this email already exists" };
    }

    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, validated.username))
      .limit(1);

    if (existingUsername.length > 0) {
      return { error: "Username is already taken" };
    }

    // amanin password pake bcrypt
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // nyimpen user baru ke tabel users pake drizzle orm
    const [newUser] = await db
      .insert(users)
      .values({
        username: validated.username,
        email: validated.email,
        password: hashedPassword,
        displayName: validated.displayName || validated.username,
      })
      .returning();

    // bikin token akses dan disimpen di cookies
    const token = signToken({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });

    await setAuthCookie(token);

    return { success: true, message: "Account created successfully! Welcome to Tweeter!" };
  } catch (error: any) {
    console.error("Register error:", error);
    return { error: error.message || "Failed to register. Please try again." };
  }
}

export async function loginAction(formData: FormData) {
  try {
    // ngambil input dari form
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // validasi input login
    const validated = loginSchema.parse(data);

    // cari user berdasarkan email di db
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validated.email))
      .limit(1);

    if (!user) {
      return { error: "Invalid email or password" };
    }

    //bandingin password input dengan hash di db
    const isValidPassword = await bcrypt.compare(validated.password, user.password);
    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    // generate JWT token biar user tetap login 
    const token = signToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    await setAuthCookie(token);

    return { success: true, message: `Welcome back, ${user.username}!` };
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: error.message || "Failed to login. Please try again." };
  }
}

export async function logoutAction() {
  // apus token dari browser user
  await removeAuthCookie();
  
  redirect("/login");
}