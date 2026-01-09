import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/posts - Fetch feed
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter"); // "following" or "news"
    const skip = (page - 1) * limit;

    // Get user profile for following filter
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      select: { 
        id: true,
        following: {
          select: { followingId: true }
        }
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Build query based on filter
    let whereClause: any = {};
    
    if (filter === "following") {
      const followingIds = userProfile.following.map(f => f.followingId);
      whereClause.companyId = { in: followingIds };
    } else if (filter === "news") {
      whereClause.postType = "NEWS";
    }

    // Fetch posts with company info
    const posts = await prisma.post.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        company: {
          select: {
            id: true,
            companyTitle: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            shares: true,
          },
        },
      },
    });

    const postIds = posts.map((p) => p.id);

    const [userLikes, userBookmarks] = await Promise.all([
      prisma.like.findMany({
        where: {
          userId: userProfile.id,
          postId: { in: postIds },
        },
        select: { postId: true },
      }),
      prisma.bookmark.findMany({
        where: {
          userId: userProfile.id,
          postId: { in: postIds },
        },
        select: { postId: true },
      }),
    ]);

    const likedPostIds = new Set(userLikes.map((l) => l.postId));
    const bookmarkedPostIds = new Set(userBookmarks.map((b) => b.postId));

    // Format response
    const formattedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      postType: post.postType,
      title: post.title,
      summary: post.summary,
      featuredImage: post.featuredImage,
      mediaUrls: post.mediaUrls,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      sharesCount: post._count.shares,
      createdAt: post.createdAt.toISOString(),
      company: post.company,
      isLiked: likedPostIds.has(post.id),
      isBookmarked: bookmarkedPostIds.has(post.id),
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create post
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's company
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      select: { companyId: true },
    });

    if (!userProfile?.companyId) {
      return NextResponse.json(
        { error: "User must belong to a company to post" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      content,
      postType = "POST",
      title,
      summary,
      featuredImage,
      mediaUrls = [],
    } = body;

    // Validation
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (postType === "NEWS" && !title) {
      return NextResponse.json(
        { error: "News posts require a title" },
        { status: 400 }
      );
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        content,
        postType,
        title,
        summary,
        featuredImage,
        mediaUrls,
        companyId: userProfile.companyId,
      },
      include: {
        company: {
          select: {
            id: true,
            companyTitle: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}