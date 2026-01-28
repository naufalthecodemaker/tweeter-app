"use server";

import { db } from "@/db";
import { posts, likes, comments } from "@/db/schema";
import { postSchema, commentSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createPostAction(formData: FormData) {
  try {
    // cuma user yg udh login yg bisa post
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to create a post" };
    }

    // ngambil input dari form
    const content = formData.get("content") as string;

    // validasi isinya pake zod
    const validated = postSchema.parse({ content });

    // nyimpen postingan ke tabel posts di neon db
    await db.insert(posts).values({
      userId: user.userId,
      content: validated.content,
    });

    // update UI home & profile secara instan
    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true, message: "Post created successfully!" };
  } catch (error: any) {
    console.error("Create post error:", error);
    return { error: error.message || "Failed to create post" };
  }
}

export async function deletePostAction(postId: string) {
  try {
    // cuma user yg udh login yg bisa apus postingan
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to delete a post" };
    }

    // ngambil data post utk dicek pemiliknya
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (!post) {
      return { error: "Post not found" };
    }

    // bandingin id pemilik post dengan id user yg sedang login
    if (post.userId !== user.userId) {
      return { error: "You can only delete your own posts" };
    }

    // apus data dri db
    await db.delete(posts).where(eq(posts.id, postId));

    // update ui lg secara instan
    revalidatePath("/");
    revalidatePath("/profile");

    return { success: true, message: "Post deleted successfully!" };
  } catch (error: any) {
    console.error("Delete post error:", error);
    return { error: error.message || "Failed to delete post" };
  }
}

export async function likePostAction(postId: string) {
  try {
    // cuma user yg udh login yg bisa like postingan
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to like a post" };
    }

    // cari apakah user udh pernah ngelike post 
    const [existingLike] = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postId, postId), eq(likes.userId, user.userId)))
      .limit(1);

    if (existingLike) {
      await db
        // klo udh pernah ngelike, bisa dislike
        .delete(likes)
        .where(and(eq(likes.postId, postId), eq(likes.userId, user.userId)));
    } else {
      // klo blm, tambahin ke tabel likes di neon db
      await db.insert(likes).values({
        postId,
        userId: user.userId,
      });
    }

    // update ui lg
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath(`/post/${postId}`);

    return { success: true };
  } catch (error: any) {
    console.error("Like post error:", error);
    return { error: error.message || "Failed to like post" };
  }
}

export async function createCommentAction(postId: string, formData: FormData) {
  try {
    // cuma user yg udh login yg bisa komen
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to comment" };
    }

    // ngambil input dari form
    const content = formData.get("content") as string;

    // validasi isinya pake zod
    const validated = commentSchema.parse({ content });

    // nyimpen komen ke tabel comment di neon db
    await db.insert(comments).values({
      postId,
      userId: user.userId,
      content: validated.content,
    });

    // update ui lg
    revalidatePath("/");
    revalidatePath(`/post/${postId}`);

    return { success: true, message: "Comment posted successfully!" };
  } catch (error: any) {
    console.error("Create comment error:", error);
    return { error: error.message || "Failed to create comment" };
  }
}

export async function deleteCommentAction(commentId: string, postId: string) {
  try {
    // cuma user yg udh login yg bisa komen
    const user = await getCurrentUser();
    if (!user) {
      return { error: "You must be logged in to delete a comment" };
    }

    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1);

    if (!comment) {
      return { error: "Comment not found" };
    }

    if (comment.userId !== user.userId) {
      return { error: "You can only delete your own comments" };
    }

    await db.delete(comments).where(eq(comments.id, commentId));

    revalidatePath("/");
    revalidatePath(`/post/${postId}`);

    return { success: true, message: "Comment deleted successfully!" };
  } catch (error: any) {
    console.error("Delete comment error:", error);
    return { error: error.message || "Failed to delete comment" };
  }
}