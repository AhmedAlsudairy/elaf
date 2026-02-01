"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Loader2 } from "lucide-react";

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

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply?: (newReply: Comment) => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  postId,
  onReply,
  depth = 0,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/socialMedia/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          parentCommentId: comment.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to post reply");

      const data = await res.json();
      onReply?.(data.comment);
      setReplyContent("");
      setShowReplyInput(false);
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={depth > 0 ? "ml-12" : ""}>
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.user.profileImage || ""} alt={comment.user.name} />
          <AvatarFallback>{comment.user.name[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3">
            <p className="font-semibold text-sm">{comment.user.name}</p>
            <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <span>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="font-semibold hover:underline"
            >
              Reply
            </button>
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                }}
              />
              <div className="flex flex-col gap-2">
                <Button onClick={handleSubmitReply} disabled={submitting} size="sm">
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Reply"
                  )}
                </Button>
                <Button
                  onClick={() => setShowReplyInput(false)}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}