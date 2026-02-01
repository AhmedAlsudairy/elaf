'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: {
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
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export default function PostCard({
  post,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: PostCardProps) {
  const params = useParams();
  const locale = params.locale as string;
  
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    onLike?.();
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.();
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
    onComment?.();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header - CLICKABLE */}
      <div className="flex items-start justify-between mb-4">
        <Link href={`/${locale}/profile/${post.company.id}`}>
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 -ml-2 -mt-2 p-2 rounded-lg transition-colors">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.company.profileImage} alt={post.company.companyTitle} />
              <AvatarFallback>{post.company.companyTitle[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 hover:underline">
                {post.company.companyTitle}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Hide post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* News Title (if NEWS post) */}
      {post.postType === "NEWS" && post.title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
      )}

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Featured Image (NEWS) or Media Gallery (POST) */}
      {post.postType === "NEWS" && post.featuredImage && (
        <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title || "News image"}
            fill
            className="object-cover"
          />
        </div>
      )}

      {post.postType === "POST" && post.mediaUrls.length > 0 && (
        <div className={`grid gap-2 mb-4 ${
          post.mediaUrls.length === 1 ? "grid-cols-1" : 
          post.mediaUrls.length === 2 ? "grid-cols-2" : 
          "grid-cols-2"
        }`}>
          {post.mediaUrls.slice(0, 4).map((url, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden ${
                post.mediaUrls.length === 3 && index === 0 ? "col-span-2" : ""
              } ${post.mediaUrls.length === 1 ? "h-96" : "h-64"}`}
            >
              {url.endsWith(".mp4") || url.endsWith(".mov") ? (
                <video src={url} controls className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={url}
                  alt={`Post media ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
              {index === 3 && post.mediaUrls.length > 4 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{post.mediaUrls.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button
            onClick={handleCommentClick}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors"
          >
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium">{post.sharesCount}</span>
          </button>
        </div>

        <button
          onClick={handleBookmark}
          className="text-gray-600 hover:text-yellow-500 transition-colors"
        >
          <Bookmark className={`h-5 w-5 ${bookmarked ? "fill-yellow-500 text-yellow-500" : ""}`} />
        </button>
      </div>

      {/* Comment Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          initialCommentsCount={post.commentsCount}
        />
      )}
    </div>
  );
}