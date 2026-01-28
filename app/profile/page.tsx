import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, posts, likes, comments, follows } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { PostCard } from "@/components/post-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EditProfileForm } from "./edit-profile-form";
import { Users, FileText } from "lucide-react";
import { PageReadyWrapper } from "@/components/page-ready-wrapper";

// pastiin data profil selalu paling update pas dibuka
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // cek user udah login apa belom, klo belom suruh login aowkoaw
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  // ngambil detail info user dari database
  const [userDetails] = await db
    .select()
    .from(users)
    .where(eq(users.id, currentUser.userId))
    .limit(1);

  // ngambil semua post punyanya user ini, diurutin dari yang paling baru
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
    .leftJoin(users, eq(posts.userId, users.id)) // join ke tabel user buat dapet info author
    .where(eq(posts.userId, currentUser.userId))
    .orderBy(desc(posts.createdAt));

  // ambil data likes ama komen global (nanti di-filter buat tiap post)
  const postLikes = await db.select().from(likes);
  const postComments = await db.select().from(comments);

  // itung jumlah follower (orang yg follow kita)
  const followerCount = await db
    .select()
    .from(follows)
    .where(eq(follows.followingId, currentUser.userId));

  // itung jumlah following (orang yg kita follow)
  const followingCount = await db
    .select()
    .from(follows)
    .where(eq(follows.followerId, currentUser.userId));

  // nyusun ulang data post biar lengkap ama detail likes & komennya
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

  return (
    // pake wrapper biar loading overlay ilang pas konten profil udah siap
    <PageReadyWrapper>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            {/* kartu info Profil utama */}
            <Card className="animate-fade-in border-white/20 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
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
                </div>

                {/* statistik follower ama following*/}
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

            {/* form edit profil */}
            <div className="animate-fade-in">
              <EditProfileForm
                currentDisplayName={userDetails.displayName || ""}
                currentBio={userDetails.bio || ""}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">My Posts ({userPosts.length})</h2>
            </div>

            {/* cek klo user belom pernah posting apa2 */}
            {postsWithDetails.length === 0 ? (
              <Card className="bg-white/5 border-dashed border-white/20">
                <CardContent className="p-8 text-center text-muted-foreground">
                  You haven't posted anything yet. Start sharing!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* loop semua post punya user */}
                {postsWithDetails.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <PostCard post={post} currentUserId={currentUser.userId} />
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