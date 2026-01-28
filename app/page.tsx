import { db } from "@/db";
import { posts, users, likes, comments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { PostCard } from "@/components/post-card";
import { desc, eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { LoadingLink } from "@/components/loading-link";
import { PageReadyWrapper } from "@/components/page-ready-wrapper";

// data fresh tiap load
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // cek siapa user yg lagi login buat nyesuain tampilan UInya
  const currentUser = await getCurrentUser();

  // gw optimasi dgn narik semua data (posts, likes, comments) barengan biar gakena timeout
  const [allPosts, postLikes, postComments] = await Promise.all([
    db.select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      authorId: users.id,
      authorUsername: users.username,
      authorDisplayName: users.displayName,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(desc(posts.createdAt)),
    
    db.select().from(likes),
    db.select().from(comments)
  ]);

  // gabungin data post ama likes & komen yang udah difilter sesuai id postnya
  const postsWithDetails = allPosts.map((post) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    author: {
      id: post.authorId!,
      username: post.authorUsername!,
      displayName: post.authorDisplayName,
    },
    likes: postLikes.filter((like) => like.postId === post.id),
    comments: postComments.filter((comment) => comment.postId === post.id),
  }));

  return (
    <PageReadyWrapper>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          
          {/* Section Welcome: cek user udh login ato blm */}
          {currentUser ? (
            <div className="animate-fade-in text-center space-y-6 py-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight px-4">
                Hello, {currentUser.username}! 
              </h1>
              <p className="text-muted-foreground text-xl mt-6">
                What's happening today?
              </p>
              <LoadingLink href="/create">
                <Button size="lg" className="mt-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <PenSquare className="h-5 w-5 mr-2" />
                  Create New Post
                </Button>
              </LoadingLink>
            </div>
          ) : (
            <div className="bg-card/80 backdrop-blur-sm border-2 border-dashed rounded-xl p-12 text-center space-y-6 animate-fade-in hover:shadow-lg transition-all">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-tight">
                Welcome to Tweeter! 
              </h2>
              <p className="text-muted-foreground text-xl mt-4">
                Join our community to share your thoughts and connect with others.
              </p>
              <div className="flex gap-4 justify-center mt-8">
                <LoadingLink href="/register">
                  <Button size="lg" className="shadow-lg">Get Started</Button>
                </LoadingLink>
                <LoadingLink href="/login">
                  <Button variant="outline" size="lg" className="shadow-lg">Sign In</Button>
                </LoadingLink>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-bold">Recent Posts</h2>
              <p className="text-sm text-muted-foreground">{postsWithDetails.length} posts</p>
            </div>
        
            {postsWithDetails.length === 0 ? (
              <div className="bg-card/80 backdrop-blur-sm border rounded-xl p-12 text-center text-muted-foreground hover:shadow-lg transition-all">
                <p className="text-lg">No posts yet.</p>
                <p className="text-sm mt-2">Be the first to share something!</p>
              </div>
            ) : (
              // looping semua postingan yg ada dgn efek delay per item
              postsWithDetails.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PostCard post={post} currentUserId={currentUser?.userId} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageReadyWrapper>
  );
}