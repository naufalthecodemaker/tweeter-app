import { db } from "@/db";
import { posts, users, likes, comments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { PostCard } from "@/components/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { CommentForm } from "./comment-form";

// pastiin data selalu fresh tiap kali halaman dibuka
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>; // pake Promise utk optimasi rendering yang lebih efisien. 
  // krn params asinkron, app bisa persiapan rendernya lebih awal
}

export default async function PostDetailPage({ params }: PageProps) {
  // ngambil id post dari URL secara asinkron
  const { id } = await params;
  
  // ngambil data user yg udh login utk fitur like/comment
  const currentUser = await getCurrentUser();

  // fetching data dgn melakukan Join antara tabel posts dan users
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

  // eror handling
  if (!post) {
    notFound();
  }

  // dapetin likes ama komen dari post dgn id tersebut
  const postLikes = await db.select().from(likes).where(eq(likes.postId, id));

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
    .leftJoin(users, eq(comments.userId, users.id)) // // ngambil info user untuk tiap komen
    .where(eq(comments.postId, id))
    .orderBy(comments.createdAt); // diurut dri yg pling lama 

  // nyusun ulang data biat sesuai ama props komponen PostCard
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

        <Card className="animate-fade-in hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Comments ({postComments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                    className="flex gap-3 p-4 bg-muted/50 rounded-lg animate-fade-in hover:bg-muted/70 transition-all cursor-default"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Avatar className="h-8 w-8 hover-avatar cursor-pointer">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {comment.displayName?.[0]?.toUpperCase() ||
                          comment.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          {comment.displayName || comment.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          @{comment.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          •{" "}
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
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