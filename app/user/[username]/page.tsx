import { db } from "@/db";
import { users, posts, likes, comments, follows } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, desc, and } from "drizzle-orm";
import { PostCard } from "@/components/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { FollowButton } from "./follow-button";
import { PageReadyWrapper } from "@/components/page-ready-wrapper";

// pastiin data selalu fresh tiap kali page dibuka
export const dynamic = "force-dynamic";

export default async function UserProfilePage({
  params,
}: {
  // pake promise buat params biar sesuai standar nextjs15 yang asinkron
  params: Promise<{ username: string }>;
}) {
  // ngambil username dari URL secara asinkron
  const { username } = await params; 
  
  // ngambil data user yg login (klo ada) utk keperluan tombol follow
  const currentUser = await getCurrentUser();

  // nyari detail user di database berdasarkan username dari URL
  const [userDetails] = await db
    .select()
    .from(users)
    .where(eq(users.username, username)) 
    .limit(1);

  // klo usernya ga ada di database, tampilin page 404
  if (!userDetails) {
    notFound();
  }

  // ngambil semua post punya user 
  const userPosts = await db
    .select({
      id: posts.id,
      content: posts.content,
      createdAt: posts.createdAt,
      authorId: users.id,
      authorUsername: users.username,
      authorDisplayName: users.displayName,
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id)) // join tabel biar dapet info lengkap author
    .where(eq(posts.userId, userDetails.id))
    .orderBy(desc(posts.createdAt));

  // ambil data likes ama komen global buat difilter nanti
  const postLikes = await db.select().from(likes);
  const postComments = await db.select().from(comments);

  // itung jumlah follower & following user ini
  const followerCount = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userDetails.id));

  const followingCount = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userDetails.id));

  // cek apakah kita (user yg login) udh follow user ini ato blm
  let isFollowing = false;
  if (currentUser) {
    const [follow] = await db
      .select()
      .from(follows)
      .where(
        and(
          eq(follows.followerId, currentUser.userId),
          eq(follows.followingId, userDetails.id)
        )
      )
      .limit(1);
    isFollowing = !!follow; // ubah hasil query jadi boolean 
  }

  // nyusun data post biar bisa dipake di komponen postcard
  const postsWithDetails = userPosts.map((post) => ({
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

  // cek apakah ini profil kita sendiri biar ga muncul tombol follow di akun sendiri
  const isOwnProfile = currentUser?.userId === userDetails.id;

  return (
    <PageReadyWrapper>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="animate-fade-in border-white/20 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                      {userDetails.displayName?.[0]?.toUpperCase() ||
                        userDetails.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">
                      {userDetails.displayName || userDetails.username}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      @{userDetails.username}
                    </p>
                  </div>
                  {userDetails.bio && (
                    <p className="text-sm text-muted-foreground italic">"{userDetails.bio}"</p>
                  )}

                  {/* Tombol Follow:*/}
                  {!isOwnProfile && currentUser && (
                    <FollowButton
                      targetUserId={userDetails.id}
                      isFollowing={isFollowing}
                      initialFollowerCount={followerCount.length}
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Followers</span>
                    </div>
                    <p className="text-2xl font-bold">{followerCount.length}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Following</span>
                    </div>
                    <p className="text-2xl font-bold">{followingCount.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                Posts ({userPosts.length})
              </h2>
            </div>

            {postsWithDetails.length === 0 ? (
              <Card className="bg-white/5 border-dashed border-white/20">
                <CardContent className="p-8 text-center text-muted-foreground">
                  No posts yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* loop daftar postingan user itu */}
                {postsWithDetails.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PostCard post={post} currentUserId={currentUser?.userId} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageReadyWrapper>
  );
}