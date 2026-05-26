"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 backdrop-blur-xl">
      
      {/* BRAND */}
      <Link href="/" className="text-xl font-bold">
        EpicBlog
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">

        {isAuthenticated ? (
          <>
            {/* PROFILE */}
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10 transition"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>

              <span className="text-sm text-white">
                {user?.name}
              </span>
            </Link>

            {/* LOGOUT */}
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full bg-red-500/10 text-red-400 px-3 py-1 hover:bg-red-500/20 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-zinc-300 hover:text-white"
            >
              Iniciar sesión
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:scale-105 transition"
            >
              Empezar
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}