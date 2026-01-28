"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useLoading } from "@/lib/loading-context";

export function RegisterForm() {
  // kelola status error ama loading lokal di browser
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // buat referensi form biar gampang diakses
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // hook buat kontrol loading overlay global
  const { startLoading, stopLoading } = useLoading();

  // fungsi buat kirim data pendaftaran ke server
  const handleSubmit = async (formData: FormData) => {
    setError(""); // reset pesan error tiap kali submit
    setLoading(true); // aktifin spinner di tombol
    startLoading(); // tampilin loading overlay biar transisinya mantap

    // panggil server action buat proses registrasi ke neon db
    const result = await registerAction(formData);

    if (result.error) {
      // klo gagal, tampilin error ama berhentiin loading
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      stopLoading(); // ilangin loading overlay
    } else {
      // klo sukses, notif sukse
      toast.success(result.message);
      router.push("/");
      router.refresh(); // refresh biar navbar lgsg berubah status loginnya

      // jeda buat transisi
      setTimeout(() => {
        stopLoading();
      }, 1000);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-center text-center space-y-1">
        <CardTitle className="text-2xl font-black bg-gradient-to-r from-indigo-950 to-purple-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* pake prop action biar kehubung ama server action */}
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username" // id unik buat user
              type="text"
              placeholder="charliekirk67"
              required
              minLength={3}
              maxLength={50}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email" // buat login nanti
              type="email"
              placeholder="charliekirk@gmail.com"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6} // minimal 6 char
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <Input
              id="displayName"
              name="displayName" // nama yg muncul di profil
              type="text"
              placeholder="Charlie Kirk"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}