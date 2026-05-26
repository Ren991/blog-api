"use client";

import { useAuth } from "./context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import PostFeed from "@/components/posts/PostFeed";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      {isAuthenticated ? (
        <PostFeed />
      ) : (
        <div className="flex items-center justify-center h-[80vh] text-white">
          Iniciá sesión para ver el feed
        </div>
      )}
    </main>
  );
}