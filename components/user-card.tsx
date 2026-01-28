"use client";

import { useOptimistic, useTransition } from "react";
import { followUserAction } from "@/app/actions/profile";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { LoadingLink } from "./loading-link"; 

interface UserCardProps {
  user: {
    id: string;
    username: string;
    displayName: string | null;
    bio: string | null;
  };
  isFollowing: boolean;
  currentUserId?: string;
}

export function UserCard({ user, isFollowing: initialIsFollowing, currentUserId }: UserCardProps) {
  // cek kartunya, buat profil kita ga
  const isCurrentUser = currentUserId === user.id;
  
  // useTransition utk handle proses asinkron biar UI ga freeze
  const [isPending, startTransition] = useTransition();

  // optimistic ui biar status follow berubah instant di layar tanpa nunggu db
  const [optimisticIsFollowing, setOptimisticIsFollowing] = useOptimistic(
    initialIsFollowing,
    (state, newValue: boolean) => newValue
  );

  // follow/unfollow
  const handleFollow = () => {
    startTransition(async () => {
      // langsung ubah tampilan tombol  
      setOptimisticIsFollowing(!optimisticIsFollowing);
      // request ke neon db
      await followUserAction(user.id);
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all cursor-default border-white/10 bg-white/5 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LoadingLink 
              href={`/user/${user.username}`} 
              className="cursor-pointer"
              loadingDuration={800}
            >
              <Avatar className="h-12 w-12 hover-avatar cursor-pointer border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                  {user.displayName?.[0]?.toUpperCase() ||
                    user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </LoadingLink>
            
            <div>
              <LoadingLink
                href={`/user/${user.username}`}
                className="font-semibold hover:text-primary hover:underline cursor-pointer transition-colors"
                loadingDuration={800}
              >
                {user.displayName || user.username}
              </LoadingLink>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-muted-foreground mt-1 italic line-clamp-1 italic">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          {!isCurrentUser && currentUserId && (
            <Button
              variant={optimisticIsFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollow}
              disabled={isPending} // biar gabisa spam klik pas lg proses
              className="cursor-pointer transition-all min-w-[100px] rounded-full font-bold shadow-md"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : optimisticIsFollowing ? (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}