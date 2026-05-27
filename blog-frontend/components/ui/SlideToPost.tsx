"use client";

import {
    motion,
    useMotionValue,
    animate,
} from "framer-motion";

import {
    useEffect,
    useRef,
    useState,
} from "react";

type SlideToPostProps = {
    onComplete: () => Promise<boolean>;
    loading?: boolean;
};

export default function SlideToPost({
    onComplete,
    loading = false,
}: SlideToPostProps) {

    const x = useMotionValue(0);

    const containerRef =
        useRef<HTMLDivElement>(null);

    const [maxDrag, setMaxDrag] = useState(240);

    // =========================
    // CALCULAR WIDTH REAL
    // =========================
    useEffect(() => {

        const updateWidth = () => {

            if (!containerRef.current) return;

            const containerWidth =
                containerRef.current.offsetWidth;

            // 48 = w-12
            // 8 padding aprox
            setMaxDrag(containerWidth - 64);
        };

        updateWidth();

        window.addEventListener(
            "resize",
            updateWidth
        );

        return () =>
            window.removeEventListener(
                "resize",
                updateWidth
            );

    }, []);

    // =========================
    // RESET
    // =========================
    const resetSlider = () => {

        animate(x, 0, {
            type: "spring",
            stiffness: 300,
            damping: 25,
        });
    };

    // =========================
    // DRAG END
    // =========================
    const handleDragEnd = async () => {

        if (loading) return;

        const currentX = x.get();

        // llegó al 90%
        if (currentX > maxDrag * 0.9) {

            const success = await onComplete();

            if (!success) {
                resetSlider();
            }

        } else {

            resetSlider();
        }
    };

    return (
        <div
            ref={containerRef}
            className="
                relative
                w-full
                h-16
                rounded-full
                bg-white/5
                border border-white/10
                overflow-hidden
                flex items-center
                px-2
            "
        >

            {/* TEXTO */}
            <div
                className="
                    absolute
                    inset-0
                    flex items-center justify-center
                    text-zinc-400
                    font-medium
                    pointer-events-none
                    select-none
                "
            >
                {loading
                    ? "Publicando..."
                    : "Deslizá para publicar"}
            </div>

            {/* SLIDER */}
            <motion.div
                drag={loading ? false : "x"}
                dragConstraints={{
                    left: 0,
                    right: maxDrag,
                }}
                dragElastic={0.05}
                style={{ x }}
                onDragEnd={handleDragEnd}
                whileTap={{
                    scale: 1.05,
                }}
                className="
                    z-10
                    h-12
                    w-12
                    rounded-full
                    bg-white
                    flex items-center justify-center
                    shadow-lg
                    text-black
                    text-xl
                    select-none
                    cursor-grab
                    active:cursor-grabbing
                "
            >
                →
            </motion.div>
        </div>
    );
}