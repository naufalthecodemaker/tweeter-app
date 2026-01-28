import { db } from "@/db";
import { posts, users, likes, comments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { PostCard } from "@/components/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item"; 

// pastiin data selalu fresh tiap kali halaman dibuka
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>; // pake Promise biar rendering lebih efisien
}

export default async function PostDetailPage({ params }: PageProps) {
  // ngambil id post secara asinkron
  const { id } = await params;
  
  // ngambil data user yg udh login buat fitur like/comment/delete
  const currentUser = await getCurrentUser();

  // fetching data post utama dgn Join ke tabel users buat tau siapa authornya
  const [post] = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      authorId: users.id,
      authorUsername: users.username,
      authorDisplayName: users.displayName,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, id))
    .limit(1);

  // eror handling klo post ga ketemu
  if (!post) {
    notFound();
  }

  // dapetin jumlah likes buat ditampilin di PostCard
  const postLikes = await db.select().from(likes).where(eq(likes.postId, id));

  // ngambil semua komen dari post ini, diurutin dari yg paling lama
  const postComments = await db
    .select({
      id: comments.id,
      content: comments.content,
      createdAt: comments.createdAt,
      userId: users.id,
      username: users.username,
      displayName: users.displayName,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.postId, id))
    .orderBy(comments.createdAt);

  // nyusun ulang data biar pas masuk ke props PostCard ga berantakan
  const postWithDetails = {
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    author: {
      id: post.authorId!,
      username: post.authorUsername!,
      displayName: post.authorDisplayName,
    },
    likes: postLikes,
    comments: postComments.map((c) => ({ id: c.id })),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="animate-fade-in">
          {/* render kartu post utama */}
          <PostCard post={postWithDetails} currentUserId={currentUser?.userId} />
        </div>

        <Card className="animate-fade-in hover:shadow-lg transition-all border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Comments ({postComments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* form buat ngetik komen yg cuma muncul klo udh login */}
            {currentUser && <CommentForm postId={id} />}

            {!currentUser && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Please log in to comment
              </p>
            )}

            {postComments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-4 mt-6">
                {postComments.map((comment, index) => (
                  <div
                    key={comment.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* panggil CommentItem biar bisa apus komen */}
                    <CommentItem
                      comment={comment}
                      postId={id}
                      currentUserId={currentUser?.userId}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}