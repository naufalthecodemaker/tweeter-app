"use client";

import { useState } from "react";
import { deleteCommentAction } from "@/app/actions/posts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/alert-dialog";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLoading } from "@/lib/loading-context";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    createdAt: Date;
    userId: string | null;
    username: string | null;
    displayName: string | null;
  };
  postId: string;
  currentUserId?: string;
}

export function CommentItem({ comment, postId, currentUserId }: CommentItemProps) {
  // state buat ngatur munculnya popup konfirmasi apus
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  
  // cek yg lg login itu yg punya komennya
  const isAuthor = currentUserId === comment.userId;

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // utk hapus komen ke database
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    setShowDeleteDialog(false);
    startLoading(); // nyalain overlay loading global

    const result = await deleteCommentAction(comment.id, postId);

    if (result.error) {
      toast.error(result.error);
      setDeleteLoading(false);
      stopLoading();
    } else {
      toast.success(result.message);
      router.refresh(); // refresh data biar komennya ilang dari list
      
      // kasih jeda biar transisinya alus
      setTimeout(() => {
        setDeleteLoading(false);
        stopLoading();
      }, 300);
    }
  };

  return (
    <>
      {/* tampilan item 1 komen */}
      <div className="flex gap-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-all cursor-default relative group">
        <Avatar className="h-8 w-8 hover-avatar cursor-pointer">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
            {comment.displayName?.[0]?.toUpperCase() ||
              comment.username?.[0]?.toUpperCase() ||
              "?"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {comment.displayName || comment.username || "Unknown User"}
            </span>
            <span className="text-xs text-muted-foreground">
              @{comment.username || "unknown"}
            </span>
            <span className="text-xs text-muted-foreground">
              •{" "}
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm mt-1 leading-relaxed">{comment.content}</p>
        </div>

        {/* button apus muncul pas dihover & cuma buat yg punya komen */}
        {isAuthor && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            disabled={deleteLoading}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer h-8 w-8"
          >
            {deleteLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {/* konfirmasi klo mau apus komen */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-bold">Delete Comment?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-muted-foreground">
            Are you sure you want to delete this comment? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            className="font-bold"
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