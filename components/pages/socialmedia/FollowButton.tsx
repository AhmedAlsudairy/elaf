"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";

interface FollowButtonProps {
  companyId: string;
  initialIsFollowing: boolean;
  currentUserId: string;
}

export default function FollowButton({
  companyId,
  initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleToggleFollow = async () => {
    const previousState = isFollowing;
    setIsFollowing(!isFollowing);

    try {                         
      const response = await fetch(`/api/socialMedia/follow/${companyId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle follow");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setIsFollowing(previousState);
      console.error("Follow error:", error);
    }
  };

  return (
    <Button
      onClick={handleToggleFollow}
      disabled={isPending}
      variant={isFollowing ? "outline" : "default"}
      className="mt-4"
    >
      {isPending ? "..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
}