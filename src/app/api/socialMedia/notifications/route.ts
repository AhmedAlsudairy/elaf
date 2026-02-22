import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/notifications - fetch all notifications for the logged-in user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: userProfile.id },
      include: {
        user: { select: { id: true, name: true, profileImage: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - mark notifications as read
export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationIds }: { notificationIds: string[] } = body;

    if (!notificationIds || notificationIds.length === 0) {
      return NextResponse.json(
        { error: "No notifications specified" },
        { status: 400 }
      );
    }

    const updatedNotifications = await prisma.notification.updateMany({
      where: { id: { in: notificationIds }, userId },
      data: { read: true },
    });

    return NextResponse.json({ updatedNotifications });
  } catch (error) {
    console.error("Mark notifications read error:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 }
    );
  }
}