'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronDown, Shield, Users, FileText, Award, Database, Cpu } from 'lucide-react';
import type { UseCase, CaseStudy, CaseStudyUseCase } from '@/app/types';
import Explorer from './Explorer';

// ─── Particle Network (light-mode) ────────────────────────────────────────────

function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctxRaw = canvas.getContext('2d');
    if (!ctxRaw) return () => {};
    const ctx = ctxRaw!;

    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    type Pt = { x: number; y: number; vx: number; vy: number; r: number; base: number; phase: number; green: boolean };

    const count = Math.min(70, Math.round((w * h) / 14000));
    const MAX = 150;

    const pts: Pt[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 2 + 1,
      base: Math.random() * 0.4 + 0.2,
      phase: Math.random() * Math.PI * 2,
      green: Math.random() > 0.55,
    }));

    let raf = 0;
    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.005;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const pulse = p.base * (0.5 + 0.5 * Math.sin(t + p.phase));
        // green = AI4M brand green, blue = accent blue
        const hue = p.green ? 155 : 215;
        const sat = p.green ? '65%' : '75%';
        const lit = p.green ? '40%' : '50%';

        // glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grd.addColorStop(0, `hsla(${hue},${sat},${lit},${(pulse * 0.7).toFixed(2)})`);
        grd.addColorStop(1, `hsla(${hue},${sat},${lit},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue},${sat},${lit},${pulse.toFixed(2)})`;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX) {
            const a = ((1 - dist / MAX) * 0.15 * pulse).toFixed(3);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(21,101,232,${a})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    draw();

    const resize = () => {
      cancelAnimationFrame(raf);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
      draw();
    };
    window.addEventListener('resize', resize, { passive: true });
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => { const cleanup = init(); return cleanup; }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.55 }}
    />
  );
}

// ─── Animated counter ──────────────────────────────────────────────────────────

function useCounter(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
}

function StatTile({ value, label, delay = 0 }: { value: number; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCounter(value, 1600, active);

  useEffect(() => {
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setActive(true); obs.disconnect(); } },
        { threshold: 0.2 },
      );
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div ref={ref} className="stat-tile rounded-xl p-5 flex flex-col items-center gap-1.5 select-none cursor-default">
      <span className="text-4xl font-bold font-mono tracking-tight text-[#0B1D3A] tabular-nums">{count}</span>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8AAAC4]">{label}</span>
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────────

function Nav({ onExplore }: { onExplore: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="https://ai4manufacturing.ca/_uploads/63487557e9b92.png"
            alt="AI4M Canada"
            height={30}
            width={122}
            className="object-contain object-left"
            unoptimized
          />
          <div className="h-4 w-px bg-[#0B1D3A]/15" />
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#8AAAC4]">
            Use Case Explorer
          </span>
        </div>
        <button
          onClick={onExplore}
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#1AAB6D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#128050] transition-colors duration-200 shadow-md shadow-[#1AAB6D]/25"
        >
          Explore Use Cases
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}

// ─── Value Props ───────────────────────────────────────────────────────────────

const VALUE_PROPS = [
  {
    Icon: Award,
    color: '#8A6800', bg: 'rgba(200,160,32,0.10)', border: 'rgba(200,160,32,0.25)',
    title: 'AI4M Certified Only',
    desc: 'Every use case is validated by the AI for Manufacturing program — sourced from real Canadian manufacturers.',
  },
  {
    Icon: Users,
    color: '#1565E8', bg: 'rgba(21,101,232,0.08)', border: 'rgba(21,101,232,0.20)',
    title: 'Role-Based Navigation',
    desc: 'Filter by your stakeholder role — Business Owner, Quality Owner, Process Owner, and 7 more manufacturing roles.',
  },
  {
    Icon: FileText,
    color: '#1AAB6D', bg: 'rgba(26,171,109,0.08)', border: 'rgba(26,171,109,0.22)',
    title: 'Real Case Studies',
    desc: 'Validated implementations with ROI data from AI4M member companies, nested directly inside each use case.',
  },
] as const;

// ─── HomePage ──────────────────────────────────────────────────────────────────

export default function HomePage({
  useCases, caseStudies, links,
}: { useCases: UseCase[]; caseStudies: CaseStudy[]; links: CaseStudyUseCase[] }) {
  const explorerRef = useRef<HTMLDivElement>(null);
  const scrollToExplorer = () =>
    explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const ai4mCases = useCases.filter((u) => u.is_ai4m && !u.is_archived);
  const total     = ai4mCases.length;
  const deptCount = new Set(ai4mCases.map((u) => u.department)).size;

  return (
    <div className="min-h-screen bg-[#F2F6FF] text-[#0B1D3A] overflow-x-hidden">
      <Nav onExplore={scrollToExplorer} />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">

        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none" />

        {/* Particle network */}
        <ParticleNetwork />

        {/* Radial spotlight — lighten centre so particles don't compete with text */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 65% at 50% 48%, rgba(242,246,255,0.72) 0%, rgba(242,246,255,0.10) 60%, transparent 100%)',
          }}
        />

        {/* Bottom fade to page bg */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #F2F6FF)' }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

          {/* Logo — no filter needed on light bg */}
          <div className="animate-fade-in-up mb-10">
            <Image
              src="https://ai4manufacturing.ca/_uploads/63487557e9b92.png"
              alt="AI4M Canada"
              height={56}
              width={224}
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up delay-100 font-bold tracking-tight leading-[1.04] mb-6">
            <span className="block text-4xl sm:text-5xl md:text-6xl text-[#0B1D3A]/50 font-medium mb-2">
              Industrial AI,
            </span>
            <span className="block text-6xl sm:text-7xl md:text-8xl headline-gradient">
              Certified.
            </span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up delay-200 text-base md:text-lg text-[#4A6480] max-w-xl leading-relaxed mb-10">
            {total} AI4M-certified use cases for Canadian manufacturers — filter by department,
            stakeholder role, and strategic goal with real case studies inside every entry.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-300 flex flex-wrap items-center justify-center gap-3 mb-14">
            <button
              onClick={scrollToExplorer}
              className="group relative overflow-hidden inline-flex items-center gap-2.5 rounded-xl bg-[#1AAB6D] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#128050] hover:shadow-xl hover:shadow-[#1AAB6D]/30 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1AAB6D]"
            >
              <span className="shimmer absolute inset-0 pointer-events-none" />
              <span className="relative">Explore Use Cases</span>
              <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={scrollToExplorer}
              className="inline-flex items-center gap-2 rounded-xl border border-[#0B1D3A]/15 bg-white px-7 py-3.5 text-sm font-semibold text-[#0B1D3A]/60 shadow-sm transition-all duration-300 hover:border-[#0B1D3A]/25 hover:shadow-md hover:text-[#0B1D3A]/80"
            >
              View Case Studies
            </button>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up delay-400 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
            <StatTile value={total}              label="Certified Use Cases" delay={0}   />
            <StatTile value={deptCount}          label="Departments"         delay={100} />
            <StatTile value={caseStudies.length} label="Case Studies"        delay={200} />
            <StatTile value={10}                 label="Stakeholder Roles"   delay={300} />
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={scrollToExplorer}
          aria-label="Scroll to explorer"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#0B1D3A]/20 hover:text-[#0B1D3A]/45 transition-colors duration-300"
        >
          <span className="text-[9px] font-bold tracking-[0.28em] uppercase font-mono">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </section>

      {/* ─── Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════════ VALUE PROPS ═══════════════════════ */}
      <section className="relative py-24 bg-[#F2F6FF]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#1AAB6D]/40" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#1AAB6D]/70 font-mono">
                Platform Overview
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#1AAB6D]/40" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUE_PROPS.map(({ Icon, color, bg, border, title, desc }) => (
              <div key={title} className="value-card rounded-2xl p-7">
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-base font-bold text-[#0B1D3A] mb-2">{title}</h3>
                <p className="text-sm text-[#4A6480] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI4M info band */}
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <div
            className="rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center gap-6 justify-between"
            style={{ background: 'rgba(26,171,109,0.06)', border: '1px solid rgba(26,171,109,0.18)' }}
          >
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-3 shrink-0">
                <Cpu className="w-5 h-5 text-[#1AAB6D]" />
                <Database className="w-5 h-5 text-[#1AAB6D]/50" />
                <Shield className="w-5 h-5 text-[#1AAB6D]/25" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0B1D3A]">About AI4M Canada</p>
                <p className="text-xs text-[#4A6480] mt-0.5 max-w-xl leading-relaxed">
                  AI for Manufacturing (AI4M) is a Canadian industry non-profit leading AI adoption
                  in manufacturing across 9 strategic pillars.
                </p>
              </div>
            </div>
            <a
              href="https://ai4manufacturing.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-[#1AAB6D]/30 bg-white px-4 py-2 text-xs font-semibold text-[#1AAB6D] hover:border-[#1AAB6D] hover:bg-[#1AAB6D]/05 transition-colors duration-200"
            >
              Visit AI4M.ca <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Divider ─── */}
      <div className="section-divider" />

      {/* ═══════════════════════ EXPLORER ═══════════════════════ */}
      <div ref={explorerRef} className="scroll-mt-0">
        <Explorer useCases={useCases} caseStudies={caseStudies} links={links} />
      </div>
    </div>
  );
}
