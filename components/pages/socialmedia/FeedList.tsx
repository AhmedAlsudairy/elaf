"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  content: string;
  postType: "POST" | "NEWS";
  title?: string;
  summary?: string;
  featuredImage?: string;
  mediaUrls: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  company: {
    id: string;
    companyTitle: string;
    profileImage?: string;
  };
  isLiked: boolean;
  isBookmarked: boolean;
}

interface FeedListProps {
  feedType: "fyp" | "following" | "news";
}

export default function FeedList({ feedType }: FeedListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();

  const fetchPosts = async (pageNum: number) => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Build URL based on feed type
      let url = `/api/socialMedia/posts?page=${pageNum}&limit=10`;
      
      if (feedType === "following") {
        url += "&filter=following";
      } else if (feedType === "news") {
        url += "&filter=news";
      }
      
      const res = await fetch(url);
      
      if (!res.ok) throw new Error("Failed to fetch posts");
      
      const data = await res.json();
      
      if (data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset when feed type changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [feedType]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  }, [inView]);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/socialMedia/posts/${postId}/like`, {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Failed to like post");
      
      const data = await res.json();
      
      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: data.liked,
                likesCount: data.liked
                  ? post.likesCount + 1
                  : post.likesCount - 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      const res = await fetch(`/api/socialMedia/posts/${postId}/bookmark`, {
        method: "POST",
      });
      
      if (!res.ok) throw new Error("Failed to bookmark post");
      
      const data = await res.json();
      
      // Update local state
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, isBookmarked: data.bookmarked }
            : post
        )
      );
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {feedType === "following"
            ? "No posts from companies you follow yet."
            : feedType === "news"
            ? "No news articles yet."
            : "No posts yet. Be the first to post!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isLiked={post.isLiked}
          isBookmarked={post.isBookmarked}
          onLike={() => handleLike(post.id)}
          onBookmark={() => handleBookmark(post.id)}
          onComment={() => {
            // TODO: Open comment modal
            console.log("Comment on post:", post.id);
          }}
          onShare={() => {
            // TODO: Open share modal
            console.log("Share post:", post.id);
          }}
        />
      ))}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && !loading && <div ref={ref} className="h-10" />}

      {/* End of feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You&apos;ve reached the end!</p>
        </div>
      )}
    </div>
  );
}