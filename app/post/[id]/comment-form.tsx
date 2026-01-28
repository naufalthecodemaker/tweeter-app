"use client";

import { useState, useRef } from "react";
import { createCommentAction } from "@/app/actions/posts";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLoading } from "@/lib/loading-context";
import { useRouter } from "next/navigation";

interface CommentFormProps {
  postId: string; // id post yg bakal dikomen
}

export function CommentForm({ postId }: CommentFormProps) {
  // kelola isi teks, status error, ama status loading di browser
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // utk reset input form setelah berhasil posting
  const formRef = useRef<HTMLFormElement>(null);

  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  // kirim data ke server
  const handleSubmit = async (formData: FormData) => {
    setError(""); // reset pesan error 
    setLoading(true); // aktifin loading 
    startLoading(); // tampilin loading overlay

    // jalanin server action pake ID postingan dan data form
    const result = await createCommentAction(postId, formData);

    if (result.error) {
      // tampilin notif gagal 
      setError(result.error);
      toast.error(result.error);
      stopLoading(); // sembunyiin overlay
    } else {
      // tampilin notif sukses
      setContent("");
      formRef.current?.reset();
      toast.success(result.message);
       // refresh page buat nunjukkin komen baru
      router.refresh();
    }

     // stop loading abis refresh
      setTimeout(() => {
        setLoading(false);
        stopLoading();
      }, 1000);
  };

  return (
    // pake prop action yg kehubung dgn sistem server action Next.js
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <Textarea
        name="content"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[80px] resize-none"
        maxLength={280} // batesnya 280 karakter
        required
        disabled={loading} // user gabisa ubah teks pas proses ngirim 
      />

      {/* tampilin notif error */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        // button ga aktif klo lg loading/teks cuma isinya spasi kosong
        disabled={loading || !content.trim()} 
        size="sm" 
        className="cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </>
        )}
      </Button>
    </form>
  );
}