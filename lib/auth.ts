import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ambil secret dari .env biar aman
const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_NAME = "auth-token"; // nama cookie yg bakal disimpen di browser user

export interface JWTPayload {
  userId: string; // id unik dari neon db (uuid)
  username: string;
  email: string;
}

// buat bikin token pas user berhasil login ato register
export function signToken(payload: JWTPayload): string {
  // token berlaku slama 7 hari
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// buat ngecek apakah token dari browser msh valid ato ngga
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    // klo error, suruh user login lg
    return null;
  }
}

// buat nyimpen token ke cookie browser secara aman
export async function setAuthCookie(token: string) {
  //cookies() diaawait biar asinkronnya lancar
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true, // biar token gabisa dicuri (xss proteksi)
    secure: process.env.NODE_ENV === "production", // cuma jalan di HTTPS klo udah online
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // expired otomatis dalam 7 hari
    path: "/",
  });
}

// buat apus token pas user klik logout
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

// buat ngambil token mentah dari cookie
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);
  return token?.value || null;
}

// ngambil info user yg lg login buat dipake di page web
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (!token) return null; 
  
  //verifikasi isi (id, username, email)
  return verifyToken(token);
}