"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-white"
        >
          EpicBlog
        </Link>

        <div className="flex items-center gap-6">
          
          <Link
            href="/"
            className="text-sm text-zinc-300 transition hover:text-white"
          >
            Inicio
          </Link>

          <Link
            href="/login"
            className="text-sm text-zinc-300 transition hover:text-white"
          >
            Iniciar sesion
          </Link>

          <Link href="/register" className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:scale-105">
            Empezar
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}