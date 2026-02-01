import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { pusherServer } from "@/lib/pusher-server";
import { prisma } from "@/lib/prisma";


// GET /api/socialMedia/posts/[id]/comments
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id: postId } = await context.params; // ✅ await here

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentCommentId: null,
      },
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, profileImage: true } },
            replies: {
              include: {
                user: { select: { id: true, name: true, profileImage: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST /api/socialMedia/posts/[id]/comments
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id: postId } = await context.params; // ✅ await here

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      select: { id: true, name:true },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const { content, parentCommentId } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId, 
        userId: userProfile.id,
        parentCommentId: parentCommentId || null,
      },
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
      },
    });
    const post = await prisma.post.findUnique({
  where: { id: postId },
  include: { company: true },
});

if (post) {
  const recipients = await prisma.userProfile.findMany({
    where: { companyId: post.companyId, id: { not: userProfile.id } },
    select: { id: true , name: true },
  });
    for (const recipient of recipients) {
    const notification = await prisma.notification.create({
      data: {
        userId: recipient.id,
        actorId: userProfile.id,
        type: "COMMENT",
        content: `${userProfile.name} commented on a post.`,
        postId,
      },
    });
    await pusherServer.trigger(
      `private-user-${recipient.id}`,
      "new-notification",
      notification
    );
  }
}
    // Update post comment count
    await prisma.post.update({
      where: { id: postId },
      data: { commentsCount: { increment: 1 } },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
