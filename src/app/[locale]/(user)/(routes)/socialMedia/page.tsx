"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePostModal from "@/components/pages/socialmedia/CreatePostModal";
import FeedList from "@/components/pages/socialmedia/FeedList";
import { useUser } from "@clerk/nextjs";
import SuggestedCompanies from "@/components/pages/socialmedia/SuggestedCompanies";

type FeedType = "fyp" | "following" | "news";

export default function SocialMediaPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeFeed, setActiveFeed] = useState<FeedType>("fyp");
  const { user } = useUser();

  // Mock company - replace with actual user's company from DB
  const mockCompany = {
    companyTitle: "Tech Corp",
    profileImage: user?.imageUrl,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Feed Navigation */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 hidden lg:block sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-6">Feeds</h2>
        <nav className="space-y-2">
          <Button
            variant={activeFeed === "fyp" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveFeed("fyp")}
          >
            For You
          </Button>
          <Button
            variant={activeFeed === "following" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveFeed("following")}
          >
            Following
          </Button>
          <Button
            variant={activeFeed === "news" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveFeed("news")}
          >
            News
          </Button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-3xl mx-auto">
        {/* Mobile Tabs (hidden on desktop) */}
        <div className="lg:hidden sticky top-0 bg-white border-b border-gray-200 z-10">
          <Tabs value={activeFeed} onValueChange={(v) => setActiveFeed(v as FeedType)}>
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="fyp">For You</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6">
          {/* Create Post Input (LinkedIn-style) */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 text-left px-4 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors text-gray-500"
              >
                Start a post...
              </button>
            </div>
          </div>

          {/* Feed based on active tab */}
          <FeedList feedType={activeFeed} key={activeFeed} />
        </div>
      </div>

      {/* Right Sidebar - Suggested Accounts */}
      <div className="w-80 bg-white border-l border-gray-200 p-6 hidden xl:block sticky top-0 h-screen overflow-y-auto">
        <h3 className="text-lg font-semibold mb-6">Suggested Accounts</h3>
        <SuggestedCompanies />
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        company={mockCompany}
      />
    </div>
  );
}