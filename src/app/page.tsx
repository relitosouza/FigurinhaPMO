"use client";

// UX Audit Help: label placeholder aria-label
import dynamic from "next/dynamic";
import { Trophy } from "lucide-react";

// Dynamically import client component with SSR disabled to prevent compilation warnings for WASM neural assets
const StickerGenerator = dynamic(() => import("@/components/StickerGenerator"), { ssr: false });

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-between relative min-h-screen">
      {/* Sporty dynamic line grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161B26_1px,transparent_1px),linear-gradient(to_bottom,#161B26_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center py-6">
        <StickerGenerator />
      </div>

      {/* Premium Sporty Footer */}
      <footer className="relative z-10 border-t border-card-border bg-card-bg/40 backdrop-blur-md py-6 text-center text-xs text-gray-500 font-medium mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-sport-yellow" />
            <span>Gerador de Figurinhas Personalizadas © 2026. Desenvolvido em Next.js & Canvas.</span>
          </div>
          <div className="flex gap-4">
            <span className="text-[10px] bg-card-border px-2 py-0.5 rounded-xs text-gray-400 font-bold uppercase select-none">
              Client WASM Model
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
