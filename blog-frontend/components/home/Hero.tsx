"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.35),transparent_40%)]" />

      {/* Secondary Glow */}
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl font-black leading-tight tracking-tight text-white md:text-8xl"
        >
          Constuye el futuro
          <br />
          con tus ideas.        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400"
        >
          Una plataforma moderna para que desarrolladores, creadores y emprendedores compartan pensamientos, historias y productos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >

          <Link href="/register" className="rounded-full bg-white px-8 py-4 font-semibold text-black transition hover:scale-105">
            Comenzar a escribir
          </Link>

          <Link href="/login" className="rounded-full border border-white/20 px-8 py-4 font-semibold text-white transition hover:bg-white/10">
            Explorar publicaciones
          </Link>
        </motion.div>
      </div>
    </section>
  );
}