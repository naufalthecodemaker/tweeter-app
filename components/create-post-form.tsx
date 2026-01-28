"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPostAction } from "@/app/actions/posts";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoading } from "@/lib/loading-context";

export function CreatePostForm() {
  // kelola isi teks, pesan error, ama status loading lokal
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // referensi buat ngereset form kalo udh sukses post
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // hook buat kontrol loading overlay global biar transisi antarpage mulus
  const { startLoading, stopLoading } = useLoading();

  // fungsi buat kirim postingan baru ke server
  const handleSubmit = async (formData: FormData) => {
    setError(""); // bersihin error lama
    setLoading(true); // aktifin status loading di button
    startLoading(); // overlay loading biar user tau lg proses

    // panggil server action buat simpan post ke neon db
    const result = await createPostAction(formData);

    if (result.error) {
      // klo gagal, kasih tau usernya lewat notif toast ama state error
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      stopLoading(); // matiin overlay loading
    } else {
      // klo sukses, bersihin input ama tampilin notif berhasil
      setContent("");
      formRef.current?.reset();
      toast.success(result.message);
      
      // arahin user balik ke halaman home buat liat postingan barunya
      router.push("/");
      
      // jeda 1 dtk
      setTimeout(() => {
        stopLoading();
      }, 1000);
    }
  };

  // itung jumlah karakter biar user tau sisa kuota karakter yg bisa dia ketik
  const charCount = content.length;
  const maxChars = 280; 

  return (
    <Card className="border-2 shadow-sm">
      <CardHeader>
        <CardTitle>What's on your mind?</CardTitle>
      </CardHeader>
      <CardContent>
        {/* hubungin form ke handleSubmit lewat server action */}
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              name="content" // dipake server action buat ambil teksnya
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] resize-none text-base"
              maxLength={maxChars}
              required
              autoFocus
              disabled={loading} // gabisa input pas lg proses posting
            />
            <div className="flex justify-between items-center">
              {/* indikator jumlah char -> bakal merah klo udh mepet batas */}
              <span
                className={`text-sm ${
                  charCount > maxChars * 0.9
                    ? "text-destructive font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {charCount}/{maxChars}
              </span>
            </div>
          </div>

          {/* tampilin box merah klo ada error dari server */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            // biar gabisa spam klik pas loading ato klo inputnya cuma spasi
            disabled={loading || !content.trim()} 
            className="w-full shadow-md" 
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}