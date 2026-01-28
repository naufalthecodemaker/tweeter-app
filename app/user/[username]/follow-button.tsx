"use client";

import { useOptimistic, useTransition } from "react";
import { followUserAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  targetUserId: string;
  isFollowing: boolean;
  initialFollowerCount: number;
}

export function FollowButton({ 
  targetUserId, 
  isFollowing: initialIsFollowing,
  initialFollowerCount 
}: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();

  // optimistic state utk follow
  const [optimisticState, setOptimisticState] = useOptimistic(
    { isFollowing: initialIsFollowing, count: initialFollowerCount },
    (state, newIsFollowing: boolean) => ({
      isFollowing: newIsFollowing,
      count: newIsFollowing ? state.count + 1 : state.count - 1,
    })
  );

  const handleFollow = () => {
    startTransition(async () => {
      // update UI 
      setOptimisticState(!optimisticState.isFollowing);
      
      // kirim ke server
      await followUserAction(targetUserId);
    });
  };

  return (
    <div className="w-full space-y-2">
      <Button
        variant={optimisticState.isFollowing ? "outline" : "default"}
        onClick={handleFollow}
        disabled={isPending}
        className="w-full cursor-pointer transition-all"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading...
          </>
        ) : optimisticState.isFollowing ? (
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
      <p className="text-xs text-center text-muted-foreground">
        {optimisticState.count} followers
      </p>
    </div>
  );
}