"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import CommentItem from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  initialCommentsCount: number;
}

export default function CommentSection({
  postId,
  initialCommentsCount,
}: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const commentsEndRef = useRef<HTMLDivElement>(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/socialMedia/posts/${postId}/comments`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/socialMedia/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();

      // Ensure comments are visible
      if (!showComments) setShowComments(true);

      // Add new comment to state
      setComments((prev) => [data.comment, ...prev]);
      setNewComment("");

      // Scroll to new comment
      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  // Fetch comments when showing for the first time
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments();
    }
  }, [showComments]);

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      {/* Toggle Comments Button */}
      {initialCommentsCount > 0 && (
        <button
          onClick={handleToggleComments}
          className="text-sm text-gray-600 hover:text-gray-900 mb-3"
        >
          {showComments
            ? "Hide comments"
            : `View ${initialCommentsCount} comment${initialCommentsCount !== 1 ? "s" : ""}`}
        </button>
      )}

      {/* Comment Input */}
      <div className="flex gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
          <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <div className="flex justify-end mt-2">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              size="sm"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {showComments && (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onReply={(newReply) => {
                    setComments((prev) =>
                      prev.map((c) =>
                        c.id === comment.id
                          ? { ...c, replies: [newReply, ...(c.replies || [])] }
                          : c
                      )
                    );
                  }}
                />
              ))}
              <div ref={commentsEndRef} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
