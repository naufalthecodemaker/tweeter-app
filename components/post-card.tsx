"use client";

import { useState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePostAction, likePostAction } from "@/app/actions/posts";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "./alert-dialog";
import { Heart, Trash2, MessageCircle, Loader2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { LoadingLink } from "./loading-link";

interface PostCardProps {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      username: string;
      displayName: string | null;
    };
    likes: { userId: string }[];
    comments: { id: string }[];
  };
  currentUserId?: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  // state buat kelola loading hapus ama dialog confirm
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // useTransition biar UI tetep responsif pas proses async
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  // cek apakah kita yg pnya post itu
  const isAuthor = currentUserId === post.author.id;
  
  // pake optimistic biar icon hatinya langsung merah pas diklik tanpa nunggu db
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    {
      likes: post.likes,
      isLiked: post.likes.some((like) => like.userId === currentUserId),
    },
    (state, newIsLiked: boolean) => ({
      // simulasi nambah/ngurangin jumlah like di ui secara instant
      likes: newIsLiked
        ? [...state.likes, { userId: currentUserId! }]
        : state.likes.filter((like) => like.userId !== currentUserId),
      isLiked: newIsLiked,
    })
  );

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // hapus postingan
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setShowDeleteDialog(false);
    
    // panggil server action buat hapus data di neon db
    const result = await deletePostAction(post.id);
    
    if (result.error) {
      toast.error(result.error);
      setDeleteLoading(false);
    } else {
      toast.success(result.message);
      router.refresh(); 
    }
  };

  // krim like ke server
  const handleLike = async () => {
    if (!currentUserId) return;

    startTransition(async () => {
      // ubah warna hati di ui 
      setOptimisticLikes(!optimisticLikes.isLiked);
      // kirim request ke backend
      await likePostAction(post.id);
    });
  };

  const commentCount = post.comments.length;

  return (
    <>
      <Card className="hover:shadow-lg transition-all cursor-default border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <LoadingLink 
                href={`/user/${post.author.username}`} 
                className="cursor-pointer" 
                loadingDuration={1000}
              >
                <Avatar className="hover-avatar cursor-pointer border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    {post.author.displayName?.[0]?.toUpperCase() ||
                      post.author.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </LoadingLink>
              <div>
                <LoadingLink
                  href={`/user/${post.author.username}`}
                  className="font-bold hover:text-primary hover:underline cursor-pointer transition-colors"
                  loadingDuration={1000}
                >
                  {post.author.displayName || post.author.username}
                </LoadingLink>
                <p className="text-xs text-muted-foreground">
                  @{post.author.username} •{" "}
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {/* tombol hapus cuma muncul klo kita yg bikin postnya */}
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteClick}
                disabled={deleteLoading}
                className="text-destructive hover:text-white hover:bg-destructive transition-all cursor-pointer"
              >
                {deleteLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!currentUserId || isPending}
              className={`cursor-pointer transition-all hover:bg-red-500/10 ${
                optimisticLikes.isLiked ? "text-red-500 font-bold" : ""
              }`}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 mr-1 transition-all ${
                    optimisticLikes.isLiked ? "fill-current scale-125" : ""
                  }`}
                />
              )}
              {optimisticLikes.likes.length}
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push(`/post/${post.id}`)}
              className="cursor-pointer hover:bg-primary/10 transition-all"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {commentCount}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* konfirmasi hapus buat user biar jaga2 klo kepencet apus */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">Delete Post?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base italic">
            "Are you sure you want to delete this post? This action cannot be undone."
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(false)}
            disabled={deleteLoading}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            className="rounded-full shadow-lg"
          >
            {deleteLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialog>
    </>
  );
}