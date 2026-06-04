"use client";

import { Hero } from "@/components/home/Hero";
import { useAuth } from "./context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import PostFeed from "@/components/posts/PostFeed";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      {isAuthenticated ? (
        <PostFeed />
      ) : (
          <Hero/>
      )}
      <Footer />
    </main>
  );
}


