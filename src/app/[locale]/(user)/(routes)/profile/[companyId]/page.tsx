import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CompanyProfileHeader from "@/components/pages/socialmedia/CompanyProfileHeader";
import ProfileTabs from "@/components/pages/socialmedia/ProfileTabs";

interface PageProps {
  params: Promise<{ companyId: string; locale: string }>;
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { companyId, locale } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect(`/${locale}/sign-in`);
  }

  // Get current user's profile
  const currentUser = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, companyId: true },
  });

  if (!currentUser) {
    redirect(`/${locale}/onboarding`);
  }

  // Fetch company data
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      _count: {
        select: {
          followers: true,
          posts: true,
          tenders: true,
        },
      },
    },
  });

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Company not found</h1>
          <p className="text-gray-500 mt-2">This company doesn not exist.</p>
        </div>
      </div>
    );
  }

  // Check if following
  const isFollowing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: companyId,
      },
    },
  });

  const isOwnCompany = currentUser.companyId === companyId;

  // Fetch initial posts
  const posts = await prisma.post.findMany({
    where: { companyId },
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
      likes: {
        where: { userId: currentUser.id },
        select: { id: true },
      },
      bookmarks: {
        where: { userId: currentUser.id },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Fetch tenders
  const tenders = await prisma.tender.findMany({
    where: { companyId },
    include: {
      company: {
        select: {
          companyTitle: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Fetch saved posts (only if own company)
  let savedPosts : any[]=[];
  if (isOwnCompany) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: currentUser.id },
      include: {
        post: {
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
            likes: {
              where: { userId: currentUser.id },
              select: { id: true },
            },
            bookmarks: {
              where: { userId: currentUser.id },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    savedPosts = bookmarks.map((b) => b.post);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <CompanyProfileHeader
          company={company}
          isFollowing={!!isFollowing}
          isOwnCompany={isOwnCompany}
          currentUserId={currentUser.id}
        />
        <ProfileTabs
          posts={posts}
          tenders={tenders}
          savedPosts={savedPosts}
          isOwnCompany={isOwnCompany}
          currentUserId={currentUser.id}
        />
      </div>
    </div>
  );
}