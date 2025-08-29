"use client";
import { useState } from "react";
import { Home, Search, PlusSquare, Bell, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MemeVilla() {
  const [activeTab, setActiveTab] = useState("home");

  const BottomNav = () => (
    <div className="fixed bottom-0 w-full flex justify-around bg-gradient-to-r from-orange-300 via-pink-300 to-sky-300 p-2 shadow-lg rounded-t-2xl">
      <Button variant="ghost" onClick={() => setActiveTab("home")}>
        <Home className={activeTab === "home" ? "text-orange-600" : "text-gray-700"} />
      </Button>
      <Button variant="ghost" onClick={() => setActiveTab("search")}>
        <Search className={activeTab === "search" ? "text-orange-600" : "text-gray-700"} />
      </Button>
      <Button variant="ghost" onClick={() => setActiveTab("create")}>
        <PlusSquare className={activeTab === "create" ? "text-orange-600" : "text-gray-700"} />
      </Button>
      <Button variant="ghost" onClick={() => setActiveTab("notifications")}>
        <Bell className={activeTab === "notifications" ? "text-orange-600" : "text-gray-700"} />
      </Button>
      <Button variant="ghost" onClick={() => setActiveTab("profile")}>
        <User className={activeTab === "profile" ? "text-orange-600" : "text-gray-700"} />
      </Button>
    </div>
  );

  const HomeFeed = () => (
    <div className="space-y-4 pb-20">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="rounded-2xl shadow-md overflow-hidden">
          <img
            src={`https://picsum.photos/400/300?random=${i}`}
            alt="meme"
            className="w-full h-64 object-cover"
          />
          <CardContent className="p-3">
            <p className="text-gray-700 text-sm">Funny caption #{i}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const SearchPage = () => (
    <div className="p-4 pb-20">
      <input
        type="text"
        placeholder="Search memes..."
        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );

  const CreatePage = () => (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center p-4">
      <p className="text-lg font-bold text-gray-800 mb-2">Create a Meme or Video</p>
      <Button className="rounded-2xl bg-orange-400 text-white px-6 py-3">Upload</Button>
    </div>
  );

  const NotificationsPage = () => (
    <div className="p-4 pb-20">
      <p className="text-gray-600">No new notifications 🎉</p>
    </div>
  );

  const ProfilePage = () => (
    <div className="p-4 pb-20 flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-sky-200 mb-3"></div>
      <p className="text-lg font-bold">@username</p>
      <div className="flex justify-around w-full my-4">
        <div className="text-center">
          <p className="font-bold">12</p>
          <p className="text-xs text-gray-500">Posts</p>
        </div>
        <div className="text-center">
          <p className="font-bold">1.2k</p>
          <p className="text-xs text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold">300</p>
          <p className="text-xs text-gray-500">Following</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <img
            key={i}
            src={`https://picsum.photos/200?random=${i}`}
            alt="post"
            className="rounded-xl"
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {activeTab === "home" && <HomeFeed />}
      {activeTab === "search" && <SearchPage />}
      {activeTab === "create" && <CreatePage />}
      {activeTab === "notifications" && <NotificationsPage />}
      {activeTab === "profile" && <ProfilePage />}
      <BottomNav />
    </div>
  );
}
