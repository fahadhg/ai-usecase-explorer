'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ArrowRight, Zap, Activity,
  Brain, Factory, Target, BarChart3, Layers, Network,
  Sparkles, Cpu,
} from 'lucide-react';
import type { UseCase, CaseStudy, CaseStudyUseCase } from '@/app/types';
import Explorer from './Explorer';

// ─── Animated counter ──────────────────────────────────────────────────────────

function useCounter(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
}

function AnimatedStat({
  value, label, delay = 0,
}: { value: number; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCounter(value, 1800, active);

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
    <div
      ref={ref}
      className="group flex flex-col items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-500 hover:border-sky-500/35 hover:bg-sky-950/20 cursor-default select-none"
    >
      <span className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-white group-hover:text-sky-300 transition-colors duration-500">
        {count}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 group-hover:text-sky-400/60 transition-colors duration-500">
        {label}
      </span>
    </div>
  );
}

// ─── Feature definitions ───────────────────────────────────────────────────────

const FEATURES = [
  {
    Icon: Brain,
    title: 'AI-Powered Intelligence',
    desc: '100+ vetted AI use cases purpose-built for manufacturing operations and strategy.',
    grad: 'from-violet-500 to-purple-700',
    hover: 'hover:border-violet-500/30 hover:shadow-violet-500/10',
  },
  {
    Icon: Factory,
    title: 'All Departments Covered',
    desc: 'Production, Quality, Supply Chain, Engineering, Finance, HR, Sales and more.',
    grad: 'from-sky-500 to-blue-700',
    hover: 'hover:border-sky-500/30 hover:shadow-sky-500/10',
  },
  {
    Icon: Target,
    title: 'Strategic Goal Alignment',
    desc: 'Map every AI initiative to cost reduction, efficiency, quality, or growth objectives.',
    grad: 'from-emerald-500 to-teal-700',
    hover: 'hover:border-emerald-500/30 hover:shadow-emerald-500/10',
  },
  {
    Icon: BarChart3,
    title: 'Proven ROI Metrics',
    desc: 'Quantified results and KPIs paired with realistic time-to-value estimates.',
    grad: 'from-amber-500 to-orange-700',
    hover: 'hover:border-amber-500/30 hover:shadow-amber-500/10',
  },
  {
    Icon: Layers,
    title: 'Budget-Tiered Options',
    desc: 'Cost tiers ($–$$$) let you filter by investment readiness and available resources.',
    grad: 'from-rose-500 to-pink-700',
    hover: 'hover:border-rose-500/30 hover:shadow-rose-500/10',
  },
  {
    Icon: Network,
    title: 'Real Case Studies',
    desc: 'Validated implementations from AI4M member companies across Canadian manufacturing.',
    grad: 'from-indigo-500 to-sky-700',
    hover: 'hover:border-indigo-500/30 hover:shadow-indigo-500/10',
  },
] as const;

// ─── HomePage ──────────────────────────────────────────────────────────────────

export default function HomePage({
  useCases, caseStudies, links,
}: { useCases: UseCase[]; caseStudies: CaseStudy[]; links: CaseStudyUseCase[] }) {
  const explorerRef = useRef<HTMLDivElement>(null);

  const total      = useCases.filter((u) => !u.is_archived).length;
  const deptCount  = new Set(useCases.map((u) => u.department)).size;
  const goalCount  = new Set(useCases.flatMap((u) => u.strategic_goals)).size;

  const scrollToExplorer = () =>
    explorerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-[#050510] text-white overflow-x-hidden">

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Moving grid */}
        <div className="hero-grid absolute inset-0 pointer-events-none" />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 25%, #050510 78%)' }}
        />

        {/* Animated orbs */}
        <div className="animate-orb-1 absolute top-[18%] left-[12%] w-[700px] h-[700px] rounded-full bg-sky-500/[0.09] blur-[140px] pointer-events-none" />
        <div className="animate-orb-2 absolute bottom-[18%] right-[10%] w-[550px] h-[550px] rounded-full bg-violet-600/[0.09] blur-[120px] pointer-events-none" />
        <div className="animate-orb-3 absolute top-1/2 left-1/2 w-[280px] h-[280px] rounded-full bg-cyan-400/[0.05] blur-[80px] pointer-events-none" />

        {/* Scan line */}
        <div className="scan-line" />

        {/* Corner brackets */}
        <div className="absolute top-7 left-7 w-14 h-14 border-l-2 border-t-2 border-sky-500/20 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-7 right-7 w-14 h-14 border-r-2 border-t-2 border-sky-500/20 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-7 left-7 w-14 h-14 border-l-2 border-b-2 border-sky-500/20 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-7 right-7 w-14 h-14 border-r-2 border-b-2 border-sky-500/20 rounded-br-xl pointer-events-none" />

        {/* ── Hero content ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">

          {/* Platform badge */}
          <div className="animate-fade-in-up mb-10 inline-flex items-center gap-2.5 rounded-full border border-sky-500/25 bg-sky-500/[0.07] px-5 py-2.5 backdrop-blur-sm">
            <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-sky-300">
              Industry 4.0 Intelligence Platform
            </span>
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0" />
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up animation-delay-100 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.06] mb-7">
            <span className="text-white/90">Transform Manufacturing</span>
            <br />
            <span className="hero-gradient-text">with Proven AI</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up animation-delay-200 text-base md:text-xl text-white/38 max-w-2xl leading-relaxed mb-12">
            Explore {total}+ battle-tested AI use cases for manufacturers — filtered by
            department, strategic goal, cost tier, and real-world validation.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up animation-delay-300 flex flex-wrap items-center justify-center gap-4 mb-16">
            <button
              onClick={scrollToExplorer}
              className="group relative overflow-hidden inline-flex items-center gap-2.5 rounded-xl bg-sky-600 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-sky-500 hover:shadow-2xl hover:shadow-sky-500/35 hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            >
              <span className="shimmer absolute inset-0 pointer-events-none" />
              <Zap className="relative w-4 h-4 shrink-0" />
              <span className="relative">Explore Use Cases</span>
              <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={scrollToExplorer}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-white/65 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <Activity className="w-4 h-4" />
              View Case Studies
            </button>
          </div>

          {/* Animated stat counters */}
          <div className="animate-fade-in-up animation-delay-400 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
            <AnimatedStat value={total}              label="Use Cases"    delay={0} />
            <AnimatedStat value={deptCount}          label="Departments"  delay={120} />
            <AnimatedStat value={goalCount}          label="AI Goals"     delay={240} />
            <AnimatedStat value={caseStudies.length} label="Case Studies" delay={360} />
          </div>
        </div>

        {/* Scroll cue */}
        <button
          onClick={scrollToExplorer}
          aria-label="Scroll to explorer"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/20 hover:text-white/45 transition-colors duration-300"
        >
          <span className="text-[9px] font-bold tracking-[0.25em] uppercase">Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </button>
      </section>

      {/* ═══════════════════════ FEATURES ═══════════════════════ */}
      <section className="relative py-28 border-t border-white/[0.04]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(14,165,233,0.04), transparent)' }}
        />
        <div className="relative max-w-6xl mx-auto px-6">

          {/* Section header */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 mb-6">
              <Sparkles className="w-3 h-3 text-white/30" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">
                Platform Features
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              <span className="text-white/88">Built for Modern</span>
              <br />
              <span className="bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                Manufacturing Leaders
              </span>
            </h2>
            <p className="text-white/32 max-w-lg text-base leading-relaxed">
              Identify, evaluate, and prioritize AI investments across your entire organization.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ Icon, title, desc, grad, hover }, i) => (
              <div
                key={title}
                className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-500 hover:shadow-2xl overflow-hidden ${hover}`}
              >
                {/* BG glow on hover */}
                <div
                  className={`absolute -top-8 -right-8 w-36 h-36 rounded-full bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-[0.08] blur-3xl transition-opacity duration-500 pointer-events-none`}
                />

                {/* Icon */}
                <div className={`relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${grad} shadow-lg shadow-black/40`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="relative font-semibold text-white/88 text-[15px] mb-2 group-hover:text-white transition-colors duration-300">
                  {title}
                </h3>
                <p className="relative text-sm text-white/32 leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                  {desc}
                </p>

                {/* Mini data bars decoration */}
                <div className="absolute bottom-5 right-5 flex items-end gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {[40, 70, 55, 85, 60].map((h, j) => (
                    <div
                      key={j}
                      className={`w-[3px] rounded-full bg-gradient-to-t ${grad} opacity-60`}
                      style={{ height: `${h * 0.22}px` }}
                    />
                  ))}
                </div>

                {/* Top-left ID */}
                <div className="absolute top-4 right-4 font-mono text-[9px] text-white/10 group-hover:text-white/20 transition-colors duration-300">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ EXPLORER ═══════════════════════ */}
      <div ref={explorerRef} className="border-t border-white/[0.04] scroll-mt-0">
        <Explorer useCases={useCases} caseStudies={caseStudies} links={links} />
      </div>

    </div>
  );
}
