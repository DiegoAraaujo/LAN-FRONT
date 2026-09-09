"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BarChart3, CalendarDays } from "lucide-react";
import Image from "next/image";
import authLogo from "../../../public/assets/browser-favicon-source.png";

type RoutePoint = { x: number; y: number; delay: number };
type AuthExperienceProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  mode: "login" | "signup";
};

const routes: { start: RoutePoint; end: RoutePoint }[] = [
  { start: { x: 70, y: 145, delay: 0 }, end: { x: 190, y: 70, delay: 2 } },
  { start: { x: 190, y: 70, delay: 1.4 }, end: { x: 300, y: 135, delay: 4 } },
  { start: { x: 40, y: 55, delay: 0.7 }, end: { x: 155, y: 205, delay: 3 } },
  { start: { x: 320, y: 65, delay: 0.3 }, end: { x: 205, y: 215, delay: 2.5 } },
];

const DotNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas?.parentElement) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      const height = Math.floor(entry.contentRect.height);
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      setDimensions({ width, height });
    });
    observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimensions.width || !dimensions.height) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const ratio = window.devicePixelRatio || 1;
    const dots: { x: number; y: number; opacity: number }[] = [];
    for (let x = 12; x < dimensions.width; x += 13) {
      for (let y = 12; y < dimensions.height; y += 13) {
        const wave = Math.sin(x * 0.025) * 34 + dimensions.height * 0.5;
        if (Math.abs(y - wave) < dimensions.height * 0.32 && (x + y) % 5 !== 0) {
          dots.push({ x, y, opacity: 0.12 + ((x * 7 + y * 11) % 35) / 100 });
        }
      }
    }

    let frame = 0;
    let startedAt = performance.now();
    const draw = (now: number) => {
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, dimensions.width, dimensions.height);
      for (const dot of dots) {
        context.beginPath();
        context.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
        context.fillStyle = `rgba(148, 107, 32, ${dot.opacity})`;
        context.fill();
      }

      const scaleX = dimensions.width / 380;
      const scaleY = dimensions.height / 280;
      const seconds = (now - startedAt) / 1000;
      for (const route of routes) {
        const elapsed = seconds - route.start.delay;
        if (elapsed <= 0) continue;
        const progress = Math.min(elapsed / 3, 1);
        const startX = route.start.x * scaleX;
        const startY = route.start.y * scaleY;
        const endX = route.end.x * scaleX;
        const endY = route.end.y * scaleY;
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.strokeStyle = "rgba(148, 107, 32, .72)";
        context.lineWidth = 1.5;
        context.stroke();
        context.beginPath();
        context.arc(x, y, 7, 0, Math.PI * 2);
        context.fillStyle = "rgba(229, 185, 91, .25)";
        context.fill();
        context.beginPath();
        context.arc(x, y, 3, 0, Math.PI * 2);
        context.fillStyle = "#946b20";
        context.fill();
      }
      if (seconds > 9) startedAt = now;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [dimensions]);

  return <canvas ref={canvasRef} className="absolute inset-0 size-full" aria-hidden="true" />;
};

const AuthLogo = () => (
  <div className="flex aspect-[5/2] w-full max-w-[200px] items-center overflow-hidden">
    <Image
      src={authLogo}
      alt="LAN — Launched, Noted, Never Forgotten"
      sizes="200px"
      preload
      unoptimized
      className="block h-auto w-full shrink-0 drop-shadow-[0_2px_4px_rgba(23,44,41,0.6)]"
    />
  </div>
);

export const AuthExperience = ({ children, eyebrow, title, description, mode }: AuthExperienceProps) => (
  <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#edf3ef] via-bg to-gold-light/60 p-4 sm:p-6">
    <motion.section
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="flex w-full max-w-4xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_28px_80px_rgba(23,44,41,0.18)]"
    >
      <div className="relative hidden min-h-[620px] w-1/2 overflow-hidden border-r border-border bg-gradient-to-br from-gold-light via-[#edf3e8] to-[#dce9e3] md:block">
        <DotNetwork />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-10 text-center">
          <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }} className="flex w-full justify-center">
            <AuthLogo />
          </motion.div>
          <motion.p initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.5 }} className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">Atendimentos, clientes e fluxo de caixa conectados para facilitar sua rotina.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-9 flex gap-3 text-sidebar/75">
            {[CalendarDays, BarChart3, ArrowRight].map((Icon, index) => <div key={index} className="grid size-10 place-items-center rounded-xl border border-sidebar/10 bg-white/45 backdrop-blur"><Icon size={18} /></div>)}
          </motion.div>
        </div>
      </div>

      <div className="flex min-h-[620px] w-full flex-col justify-center bg-white p-6 sm:p-10 md:w-1/2">
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35 }}>
            <div className="mb-8 md:hidden">
              <div className="mb-3"><AuthLogo /></div>
              <div className="h-px bg-gradient-to-r from-gold-btn to-transparent" />
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
            <h1 className="text-3xl font-bold tracking-tight text-text">{title}</h1>
            <p className="mb-8 mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  </div>
);

export const Component = AuthExperience;
export default AuthExperience;
