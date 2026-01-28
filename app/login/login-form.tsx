"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useLoading } from "@/lib/loading-context";

export function LoginForm() {
  // kelola status error dan loading secara lokal
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // hook buat referensi elemen form & navigasi halaman
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const { startLoading, stopLoading } = useLoading();

  // nanganin submit
  const handleSubmit = async (formData: FormData) => {
    // reset status tiap tombol diklik
    setError("");
    setLoading(true);
    startLoading(); // tampilin loading overlay

    // panggil 
    const result = await loginAction(formData);

    if (result.error) {
      // klo gagal, ada notif gagal
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      stopLoading(); // sembunyiin loading overlay
    } else {
      // klo berhasil, ada notif sukses
      toast.success(result.message);
      router.push("/");
      router.refresh();

      setTimeout(() => {
          stopLoading();
      }, 4000);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-center text-center space-y-1.5">
        <CardTitle className="text-2xl font-black bg-gradient-to-r from-indigo-950 to-purple-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent">
          Sign In
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="charliekirk67@gmail.com"
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}