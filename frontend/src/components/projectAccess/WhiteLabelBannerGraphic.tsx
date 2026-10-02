import React from 'react';
import { Palette, Globe, Shield, Lock, Users, Tag, Image as ImageIcon, Star } from 'lucide-react';

export const WhiteLabelBannerGraphic: React.FC = () => {
  return (
    <div className="relative w-[470px] h-[195px] flex items-center justify-center select-none overflow-visible">
      {/* Sleek Scaled Wrapper: Keeps all SVG vectors & card alignment 100% intact */}
      <div className="transform scale-[0.68] sm:scale-[0.74] origin-center shrink-0 w-[600px] h-[290px] relative flex items-center justify-center">
        {/* Background Ambient Glow & Sparkle Particles (Fast-Slow Glow Loop - 3.2s) */}
        <div className="absolute inset-0 pointer-events-none">
        {/* Soft Background Radial Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[250px] bg-gradient-to-r from-purple-600/30 via-indigo-600/35 to-cyan-500/30 rounded-full blur-3xl animate-laptop-glow-fast" />

        {/* Twinkling Sparkle Stars (Fast Twinkle 0% == 100% Seamless) */}
        <div className="absolute top-2 left-36 animate-star-fast-a text-cyan-300 text-sm font-bold">✦</div>
        <div className="absolute top-4 right-40 animate-star-fast-b text-purple-300 text-xs font-bold">✦</div>
        <div className="absolute bottom-6 left-40 animate-star-fast-b text-blue-300 text-sm font-bold">★</div>
        <div className="absolute top-16 right-10 animate-star-fast-a text-indigo-300 text-[11px] font-bold">✦</div>
        <div className="absolute bottom-10 right-32 animate-star-fast-b text-cyan-200 text-sm font-bold">★</div>
      </div>

      {/* SVG Animated Connection Lines (Fast Electric Energy Pulses) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 600 290"
        fill="none"
      >
        {/* Left Card 1 (Custom Branding) -> Laptop Left Screen */}
        <path
          d="M 148 80 C 164 80, 168 95, 178 95"
          stroke="url(#lineGradientLeft)"
          strokeWidth="2"
          className="animate-connection-line-fast opacity-80"
        />

        {/* Left Card 2 (Custom Domain) -> Laptop Mid-Left Screen */}
        <path
          d="M 148 185 C 164 185, 168 160, 178 160"
          stroke="url(#lineGradientLeft)"
          strokeWidth="2"
          className="animate-connection-line-fast opacity-80"
        />

        {/* Right Card 1 (Logo & Identity) -> Laptop Top-Right Screen */}
        <path
          d="M 452 60 C 436 60, 432 82, 422 82"
          stroke="url(#lineGradientRight)"
          strokeWidth="2"
          className="animate-connection-line-fast opacity-80"
        />

        {/* Right Card 2 (Module Access) -> Laptop Mid-Right Screen */}
        <path
          d="M 452 135 C 436 135, 432 128, 422 128"
          stroke="url(#lineGradientRight)"
          strokeWidth="2"
          className="animate-connection-line-fast opacity-80"
        />

        {/* Right Card 3 (Tenant Control) -> Laptop Lower-Right Screen */}
        <path
          d="M 452 208 C 436 208, 432 172, 422 172"
          stroke="url(#lineGradientRight)"
          strokeWidth="2"
          className="animate-connection-line-fast opacity-80"
        />

        {/* Gradients for Connection Lines */}
        <defs>
          <linearGradient id="lineGradientLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="lineGradientRight" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* LEFT SIDE FLOATING CARDS */}
      <div className="absolute left-0 flex flex-col gap-10 z-20">
        {/* Card 1: Custom Branding */}
        <div className="animate-card-float-a-fast flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
            <Palette className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11.5px] font-extrabold text-slate-100 tracking-tight whitespace-nowrap">
            Custom Branding
          </span>
        </div>

        {/* Card 2: Custom Domain */}
        <div className="animate-card-float-b-fast flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0 shadow-xs">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11.5px] font-extrabold text-slate-100 tracking-tight whitespace-nowrap">
            Custom Domain
          </span>
        </div>
      </div>

      {/* CENTER: THE LAPTOP WITH WHITE-LABEL UI (Enlarged & High Glow) */}
      <div className="relative z-20 flex flex-col items-center">
        {/* Laptop Screen Unit */}
        <div className="relative w-[248px] h-[166px] bg-slate-950 rounded-t-2xl border-[3px] border-slate-700 shadow-2xl p-3 flex flex-col justify-between overflow-hidden">
          {/* Top Bezel Webcam Dot */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-500" />

          {/* Diagonal Neon Light Sweep Overlay across Laptop Screen (Fast-Slow Glare) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
            <div className="animate-neon-sweep-fast w-[100px] h-full bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent blur-sm" />
          </div>

          {/* Screen Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-800/90 pb-2 pt-0.5">
            {/* "★ YOUR BRAND" Pill Badge */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-400/60 text-[9px] font-black text-cyan-300 shadow-xs">
              <Star className="w-2.5 h-2.5 fill-cyan-400 text-cyan-400" />
              <span>YOUR BRAND</span>
            </div>

            {/* Wireframe Navigation Bars */}
            <div className="hidden sm:flex items-center gap-1 opacity-50">
              <div className="w-3.5 h-0.5 rounded-full bg-slate-400" />
              <div className="w-5 h-0.5 rounded-full bg-slate-400" />
              <div className="w-3.5 h-0.5 rounded-full bg-slate-400" />
            </div>

            {/* 3 Window Indicator Dots */}
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500 shadow-xs" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-xs" />
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-xs" />
            </div>
          </div>

          {/* Main Screen Content Grid */}
          <div className="grid grid-cols-2 gap-2.5 items-center my-auto">
            {/* Left Box: Logo Upload Area with Breathing Fast-Slow Glow */}
            <div className="animate-logo-upload-fast rounded-xl border-2 border-dashed border-cyan-400/50 bg-slate-900/80 p-2.5 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/40 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-md mb-1.5">
                <ImageIcon className="w-4 h-4" />
              </div>
              <span className="text-[8.5px] font-black text-white leading-tight">
                Upload Your Logo
              </span>
            </div>

            {/* Right Box: Wireframe bars and Color Dots Tray */}
            <div className="flex flex-col justify-center space-y-2 pl-0.5">
              {/* Wireframe text bars */}
              <div className="w-20 h-1.5 rounded-full bg-slate-800" />
              <div className="w-14 h-1.5 rounded-full bg-slate-800/80" />

              {/* Color Dots Tray with Dynamic Fast Ripple Wave Glow */}
              <div className="flex items-center justify-between px-2 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-inner">
                <div className="animate-dot-glow-fast-1 w-2 h-2 rounded-full bg-[#8B5CF6]" />
                <div className="animate-dot-glow-fast-2 w-2 h-2 rounded-full bg-[#06B6D4]" />
                <div className="animate-dot-glow-fast-3 w-2 h-2 rounded-full bg-[#3B82F6]" />
                <div className="animate-dot-glow-fast-4 w-2 h-2 rounded-full bg-[#10B981]" />
                <div className="animate-dot-glow-fast-5 w-2 h-2 rounded-full bg-[#F59E0B]" />
                <div className="animate-dot-glow-fast-6 w-2 h-2 rounded-full bg-[#EC4899]" />
                <div className="animate-dot-glow-fast-7 w-2 h-2 rounded-full bg-[#D946EF]" />
              </div>
            </div>
          </div>
        </div>

        {/* Laptop Deck / Keyboard Base with Intense Neon Under-Glow Strip */}
        <div className="relative w-[285px] h-[17px]">
          {/* Metallic Top Base Plate */}
          <div className="w-full h-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 rounded-b-2xl border-t border-slate-600 shadow-lg relative overflow-hidden">
            {/* Trackpad Indentation */}
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-14 h-1 rounded bg-slate-600/70" />
          </div>

          {/* Under-Glow Neon Strip (Fast Bloom & Slow Radiant Glow) */}
          <div className="animate-laptop-glow-fast absolute -bottom-1.5 left-4 right-4 h-[4px] bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500 rounded-full blur-[2px]" />
        </div>

        {/* Floating "White Label" Pill Tag near Laptop Base */}
        <div className="animate-card-float-a-fast absolute -bottom-3 -left-6 z-40 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-2 border-cyan-400/80 shadow-xl shadow-cyan-500/30 backdrop-blur-md">
          <Tag className="w-3.5 h-3.5 text-cyan-300" />
          <span className="text-[11px] font-black text-white tracking-wide">
            White Label
          </span>
        </div>
      </div>

      {/* RIGHT SIDE FLOATING CARDS */}
      <div className="absolute right-0 flex flex-col gap-4 z-20">
        {/* Card 1: Logo & Identity */}
        <div className="animate-card-float-a-fast flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-xs">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11.5px] font-extrabold text-slate-100 tracking-tight whitespace-nowrap">
            Logo & Identity
          </span>
        </div>

        {/* Card 2: Module Access */}
        <div className="animate-card-float-b-fast flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-xs">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11.5px] font-extrabold text-slate-100 tracking-tight whitespace-nowrap">
            Module Access
          </span>
        </div>

        {/* Card 3: Tenant Control */}
        <div className="animate-card-float-a-fast flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md">
          <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shrink-0 shadow-xs">
            <Users className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11.5px] font-extrabold text-slate-100 tracking-tight whitespace-nowrap">
            Tenant Control
          </span>
        </div>
      </div>
    </div>
  </div>
);
};
