"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

        {/* AVATAR */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-2xl font-bold">
            {user.name}
          </h1>

          <p className="text-zinc-400">
            {user.email}
          </p>
        </div>

        {/* INFO BOX */}
        <div className="mt-8 space-y-3 text-sm text-zinc-300">
          <div className="flex justify-between border-b border-white/10 py-2">
            <span>Usuario</span>
            <span>{user.name}</span>
          </div>

          <div className="flex justify-between border-b border-white/10 py-2">
            <span>Email</span>
            <span>{user.email}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Status</span>
            <span className="text-green-400">Activo</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-col gap-3">

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-400 py-3 hover:bg-red-500/20 transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>

          <button
            onClick={() => router.push("/")}
            className="rounded-xl border border-white/10 py-3 hover:bg-white/5 transition"
          >
            Volver al inicio
          </button>

        </div>
      </div>
    </main>
  );
}