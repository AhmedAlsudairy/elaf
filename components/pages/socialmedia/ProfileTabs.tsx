"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TenderCard from "./TenderCard";

interface ProfileTabsProps {
  posts: any[];
  tenders: any[];
  savedPosts: any[];
  isOwnCompany: boolean;
  currentUserId: string;
}

export default function ProfileTabs({
  posts,
  tenders,
  savedPosts,
  isOwnCompany,
  currentUserId,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="mt-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none bg-white">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="tenders">Tenders</TabsTrigger>
          {isOwnCompany && <TabsTrigger value="saved">Saved</TabsTrigger>}
        </TabsList>

        <TabsContent value="posts" className="space-y-4 mt-6">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border p-6">
                <h3 className="font-semibold">{post.content}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {post._count.likes} likes · {post._count.comments} comments
                </p>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="tenders" className="space-y-4 mt-6">
          {tenders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No tenders posted</p>
            </div>
          ) : (
            tenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))
          )}
        </TabsContent>

        {isOwnCompany && (
          <TabsContent value="saved" className="space-y-4 mt-6">
            {savedPosts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No saved posts</p>
              </div>
            ) : (
              savedPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg border p-6">
                  <h3 className="font-semibold">{post.content}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {post._count.likes} likes · {post._count.comments} comments
                  </p>
                </div>
              ))
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}