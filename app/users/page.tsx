import { getCurrentUser } from "@/lib/auth";
import { db } from "@/db";
import { users, follows } from "@/db/schema";
import { ne, eq } from "drizzle-orm";
import { Users as UsersIcon } from "lucide-react";
import { UsersList } from "./users-list";

// data user selalu fresh
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  // user yg lg login 
  const currentUser = await getCurrentUser();

  // ambil semua data user dari db
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      bio: users.bio,
    })
    .from(users)
    // klo lg login jgn tampilin akun sendiri di list 
    .where(currentUser ? ne(users.id, currentUser.userId) : undefined)
    .orderBy(users.username);

  // siapa aja yg udh kita follow
  let followingList: string[] = [];
  
  if (currentUser) {
    // ambil data dari tabel follows buat tau siapa aja yg udah dapet follow dri kita
    const following = await db
      .select()
      .from(follows)
      .where(eq(follows.followerId, currentUser.userId));
    
    // ambil id user biar gampang dicek 
    followingList = following.map((f) => f.followingId);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3 animate-fade-in">
          <UsersIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Discover Users</h1>
            <p className="text-muted-foreground">
              Connect with people in the community
            </p>
          </div>
        </div>

        {/* handle search ama tombol follow */}
        <UsersList
          users={allUsers}
          followingList={followingList}
          currentUserId={currentUser?.userId}
        />
      </div>
    </div>
  );
}