import { z } from "zod";

// skema pendaftaran user baru
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore"),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
  displayName: z
    .string()
    .max(100, "Nama tampilan maksimal 100 karakter")
    .optional(),
});

// skema login
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

// skema post 
export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Postingan tidak boleh kosong")
    .max(280, "Maksimal 280 karakter"),
});

// skema komen
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Komentar tidak boleh kosong")
    .max(280, "Maksimal 280 karakter"),
});

// skema update profil
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .max(100, "Nama tampilan maksimal 100 karakter")
    .optional(),
  bio: z
    .string()
    .max(160, "Bio maksimal 160 karakter")
    .optional(),
});

// tipe ts
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;