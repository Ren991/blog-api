"use client";

import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth.service";

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const { login: setAuth } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {

        if (!email || !password) {
            toast.error("Completá todos los campos");
            return;
        }

        try {

            setLoading(true);

            const response = await login({
                email,
                password,
            });

            setAuth(response.token, response.user);

            toast.success("Bienvenid@ 🚀");

            router.push("/");

            // más adelante:
            // guardar token
            // redirect dashboard

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Credenciales inválidas"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen bg-black text-white">
            <Link
                href="/"
                className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
            >
                <ArrowLeft size={16} />
                Volver
            </Link>
            {/* LEFT SIDE */}
            <section className="relative hidden flex-1 overflow-hidden lg:flex">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.35),transparent_40%)]" />

                <div className="relative z-10 flex flex-col justify-center px-20">

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-7xl font-black leading-tight"
                    >
                        Bienvenido
                        <br />
                        nuevamente.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 max-w-md text-lg text-zinc-400"
                    >
                        Accedé a tu cuenta y continuá construyendo tus ideas.
                    </motion.p>
                </div>
            </section>

            {/* RIGHT SIDE */}
            <section className="flex flex-1 items-center justify-center px-6">

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
                >

                    <h2 className="text-4xl font-bold">
                        Inicie sesión
                    </h2>

                    <p className="mt-2 text-zinc-400">
                        Accede a tu cuenta
                    </p>

                    <div className="mt-8 space-y-5">

                        {/* EMAIL */}
                        <div>
                            <label className="mb-2 block text-sm text-zinc-400">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/30"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="mb-2 block text-sm text-zinc-400">
                                Contraseña
                            </label>

                            <div className="relative">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 pr-14 outline-none transition focus:border-white/30"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-white"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>

                            </div>
                        </div>

                        {/* BUTTON */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="w-full rounded-2xl bg-white py-4 font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Ingresando..."
                                : "Iniciar sesión"}
                        </button>

                        <div className="mt-6 text-center text-sm text-zinc-400">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                href="/register"
                                className="text-white font-semibold hover:underline"
                            >
                                Regístrate
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}