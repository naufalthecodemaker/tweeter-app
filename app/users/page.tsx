import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, follows } from "@/db/schema";
import { ne, eq } from "drizzle-orm";
import { UserCard } from "@/components/user-card";
import { Users } from "lucide-react";
import { PageReadyWrapper } from "@/components/page-ready-wrapper";

// data slalu fresh tiap diload
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  // ambil data user yg lg login buat filter data nanti
  const currentUser = await getCurrentUser();

  // ngambil semua user dari neon db
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      bio: users.bio,
    })
    .from(users)
    // filter -> klo lg login, jgn tampilin akun sendiri di daftar 
    .where(currentUser ? ne(users.id, currentUser.userId) : undefined)
    .orderBy(users.username); // urutin sesuai abjad username

  // siapin list id user yg udh kita follow
  let followingList: string[] = [];
  if (currentUser) {
    const following = await db
      .select()
      .from(follows)
      .where(eq(follows.followerId, currentUser.userId));
    
    // ambil ID targetnya biar gampang dicheck di UI
    followingList = following.map((f) => f.followingId);
  }

  return (
    <PageReadyWrapper>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3 animate-fade-in">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Discover Users</h1>
              <p className="text-muted-foreground">
                Connect with people in the community
              </p>
            </div>
          </div>

          {/* gaada user lain*/}
          {allUsers.length === 0 ? (
            <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground animate-fade-in">
              No other users yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {/* mapping daftar user ke dalam komponen usercard */}
              {allUsers.map((user, index) => (
                <div
                  key={user.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <UserCard
                    user={user}
                    // check status follow buat nentuin tampilan tombol
                    isFollowing={followingList.includes(user.id)}
                    currentUserId={currentUser?.userId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageReadyWrapper>
  );
}