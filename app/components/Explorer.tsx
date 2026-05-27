'use client';

import { useState, useMemo } from 'react';
import {
  Search, X, ChevronDown, ChevronUp, Clock, TrendingUp,
  BarChart3, Building2, Target, Leaf, Zap,
  CheckCircle2, XCircle, FileText,
  LayoutGrid, List,
} from 'lucide-react';
import type { UseCase, CaseStudy, CaseStudyUseCase } from '@/app/types';

// ─── Colour tokens per department ─────────────────────────────────────────────
const DEPT_ACCENT: Record<string, { glow: string; border: string; pill: string; text: string }> = {
  'Production & Operations':        { glow: 'hover:shadow-blue-950',    border: 'border-l-blue-500',    pill: 'bg-blue-500/10 text-blue-300 ring-blue-500/20',    text: 'text-blue-400' },
  'Quality & Maintenance':          { glow: 'hover:shadow-violet-950',  border: 'border-l-violet-500',  pill: 'bg-violet-500/10 text-violet-300 ring-violet-500/20', text: 'text-violet-400' },
  'Supply Chain & Procurement':     { glow: 'hover:shadow-orange-950',  border: 'border-l-orange-500',  pill: 'bg-orange-500/10 text-orange-300 ring-orange-500/20', text: 'text-orange-400' },
  'Engineering & R&D':              { glow: 'hover:shadow-cyan-950',    border: 'border-l-cyan-500',    pill: 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/20',      text: 'text-cyan-400' },
  'Finance & Administration':       { glow: 'hover:shadow-emerald-950', border: 'border-l-emerald-500', pill: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/20', text: 'text-emerald-400' },
  'Human Resources':                { glow: 'hover:shadow-pink-950',    border: 'border-l-pink-500',    pill: 'bg-pink-500/10 text-pink-300 ring-pink-500/20',      text: 'text-pink-400' },
  'Marketing':                      { glow: 'hover:shadow-rose-950',    border: 'border-l-rose-500',    pill: 'bg-rose-500/10 text-rose-300 ring-rose-500/20',      text: 'text-rose-400' },
  'Sales':                          { glow: 'hover:shadow-indigo-950',  border: 'border-l-indigo-500',  pill: 'bg-indigo-500/10 text-indigo-300 ring-indigo-500/20',text: 'text-indigo-400' },
  'Information Technology':         { glow: 'hover:shadow-sky-950',     border: 'border-l-sky-500',     pill: 'bg-sky-500/10 text-sky-300 ring-sky-500/20',         text: 'text-sky-400' },
  'Customer Service / After-Sales': { glow: 'hover:shadow-teal-950',    border: 'border-l-teal-500',    pill: 'bg-teal-500/10 text-teal-300 ring-teal-500/20',      text: 'text-teal-400' },
};

const COST_META: Record<string, { symbol: string; label: string; color: string }> = {
  '$':   { symbol: '$',   label: 'Low',  color: 'text-emerald-400' },
  '$$':  { symbol: '$$',  label: 'Med',  color: 'text-amber-400' },
  '$$$': { symbol: '$$$', label: 'High', color: 'text-red-400' },
};

const FALLBACK = { glow: '', border: 'border-l-zinc-600', pill: 'bg-zinc-800 text-zinc-300 ring-zinc-700', text: 'text-zinc-400' };

// ─── Small helpers ─────────────────────────────────────────────────────────────

function CanadaFlag() {
  return (
    <svg viewBox="0 0 900 600" className="w-3.5 h-2.5 rounded-[2px] shrink-0" aria-hidden>
      <rect width="900" height="600" fill="#fff"/>
      <rect width="225" height="600" fill="#d80621"/>
      <rect x="675" width="225" height="600" fill="#d80621"/>
      <path fill="#d80621" d="M450 75l-37 112-118 0 95 70-36 112 96-69 96 69-36-112 95-70-118 0z"/>
    </svg>
  );
}

function Mono({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`font-mono ${className}`}>{children}</span>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500">{children}</span>;
}

// ─── Use-case card ─────────────────────────────────────────────────────────────

function UseCaseCard({ uc, linkedCaseStudies, compact }: {
  uc: UseCase;
  linkedCaseStudies: CaseStudy[];
  compact: boolean;
}) {
  const [open, setOpen] = useState(false);
  const acc = DEPT_ACCENT[uc.department] ?? FALLBACK;
  const cost = COST_META[uc.cost_tier];

  if (compact) {
    return (
      <div
        className={`group flex flex-col bg-zinc-900 border border-zinc-800 border-l-2 ${acc.border} rounded-xl transition-all duration-150 hover:border-zinc-700 hover:bg-zinc-800/60 cursor-pointer`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{uc.use_case}</p>
            <p className={`text-xs truncate mt-0.5 ${acc.text}`}>{uc.department}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-semibold text-emerald-400 font-mono`}>{uc.results.split(' ')[0]}</span>
            {uc.is_ai4m && <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 rounded px-1.5 py-0.5 ring-1 ring-violet-500/20">AI4M</span>}
            <span className={`text-xs font-mono ${cost.color}`}>{cost.symbol}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {open && (
          <div className="px-4 pb-4 pt-1 border-t border-zinc-800 flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
            <ExpandedDetail uc={uc} linkedCaseStudies={linkedCaseStudies} />
          </div>
        )}
      </div>
    );
  }

  return (
    <article className={`group flex flex-col bg-zinc-900 border border-zinc-800 border-l-2 ${acc.border} rounded-2xl shadow-lg hover:shadow-2xl ${acc.glow} transition-all duration-200 hover:border-zinc-700 overflow-hidden`}>
      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Dept + cost row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${acc.pill}`}>
            <Building2 className="w-2.5 h-2.5" />
            {uc.department}
          </span>
          <span className={`font-mono text-sm font-bold ${cost.color}`} title={cost.label + ' cost'}>
            {cost.symbol}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-zinc-100 text-sm leading-snug group-hover:text-white transition-colors">
          {uc.use_case}
        </h3>

        {/* Goal / Results */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <Label><Target className="w-2 h-2 inline mr-1" />Goal</Label>
            <p className="text-xs text-zinc-400 leading-snug">{uc.goal}</p>
          </div>
          <div className="flex flex-col gap-1">
            <Label><TrendingUp className="w-2 h-2 inline mr-1" />Results</Label>
            <p className="text-xs font-semibold text-emerald-400 leading-snug">{uc.results}</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="flex flex-col gap-1">
          <Label><BarChart3 className="w-2 h-2 inline mr-1" />KPIs</Label>
          <p className="text-xs text-zinc-500 leading-snug">{uc.kpis}</p>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock className="w-3 h-3 text-zinc-600" />
            <Mono>{uc.time_to_value}</Mono>
          </span>
          <div className="flex items-center gap-1.5">
            {uc.is_ai4m && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-400 ring-1 ring-violet-500/20">
                <Zap className="w-2.5 h-2.5" />AI4M
              </span>
            )}
            {uc.canadian_context && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-300 ring-1 ring-white/10">
                <CanadaFlag />CA
              </span>
            )}
            {uc.sustainability_focus && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                <Leaf className="w-2.5 h-2.5" />ESG
              </span>
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="flex flex-wrap gap-1.5">
          {uc.strategic_goals.map((g) => (
            <span key={g} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-400 ring-1 ring-zinc-700">
              {g}
            </span>
          ))}
        </div>

        {/* Expanded */}
        {open && (
          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-4 text-xs">
            <ExpandedDetail uc={uc} linkedCaseStudies={linkedCaseStudies} />
          </div>
        )}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 border-t border-zinc-800 transition-colors"
      >
        {open
          ? <><ChevronUp className="w-3 h-3" /> Less</>
          : <><ChevronDown className="w-3 h-3" /> More detail</>}
      </button>
    </article>
  );
}

function ExpandedDetail({ uc, linkedCaseStudies }: { uc: UseCase; linkedCaseStudies: CaseStudy[] }) {
  return (
    <>
      <div>
        <Label>Example</Label>
        <p className="mt-1 text-zinc-400 leading-relaxed text-xs">{uc.example}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
          <div>
            <Label>Good fit when</Label>
            <p className="mt-1 text-zinc-400 leading-relaxed text-xs">{uc.fit_criteria}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-500" />
          <div>
            <Label>Not a fit when</Label>
            <p className="mt-1 text-zinc-400 leading-relaxed text-xs">{uc.not_fit_when}</p>
          </div>
        </div>
      </div>
      {uc.is_ai4m && uc.ai4m_companies && (
        <div>
          <Label>AI4M Companies</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {uc.ai4m_companies.map((c) => (
              <span key={c} className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-[11px] text-violet-300 ring-1 ring-violet-500/20">{c}</span>
            ))}
          </div>
        </div>
      )}
      {linkedCaseStudies.length > 0 && (
        <div>
          <Label>Case Studies</Label>
          <div className="mt-1.5 flex flex-col gap-2">
            {linkedCaseStudies.map((cs) => (
              <div key={cs.id} className="flex gap-2.5 rounded-xl bg-zinc-800 p-3 ring-1 ring-zinc-700">
                <FileText className="w-4 h-4 shrink-0 mt-0.5 text-zinc-500" />
                <div>
                  <p className="font-medium text-zinc-200 text-xs">{cs.title}</p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">{cs.company_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Filter pill ───────────────────────────────────────────────────────────────

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-150 ${
        active
          ? 'bg-violet-600 text-white shadow-md shadow-violet-900'
          : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Stat chip in header ───────────────────────────────────────────────────────

function StatChip({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Mono className="text-2xl font-bold text-white tracking-tight">{value}</Mono>
      <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">{label}</span>
    </div>
  );
}

// ─── Case Study Card ──────────────────────────────────────────────────────────

const PDF_BASE = 'https://usecases.agentimpact.ai';

function CaseStudyCard({ cs, related }: { cs: CaseStudy; related: UseCase[] }) {
  const [open, setOpen] = useState(false);
  const pdfUrl = cs.pdf_path ? `${PDF_BASE}/${cs.pdf_path}` : null;

  return (
    <article className="flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 overflow-hidden cursor-pointer group">
      {/* Clickable header */}
      <div className="flex items-start gap-4 p-6 pb-4" onClick={() => setOpen((v) => !v)}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
          <FileText className="w-4.5 h-4.5 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-zinc-100 leading-snug text-sm group-hover:text-white transition-colors">
            {cs.title}
          </h3>
          <p className="text-xs font-medium text-violet-400 mt-0.5">{cs.company_name}</p>
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 mt-0.5 text-zinc-600 group-hover:text-zinc-400 transition-all duration-200 ${open ? 'rotate-180' : ''}`} />
      </div>

      {/* Description — always visible but clamped when closed */}
      <div className="px-6 pb-4" onClick={() => setOpen((v) => !v)}>
        <p className={`text-xs text-zinc-400 leading-relaxed transition-all ${open ? '' : 'line-clamp-2'}`}>
          {cs.brief_description}
        </p>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="px-6 pb-4 flex flex-col gap-4 border-t border-zinc-800 pt-4">
          {related.length > 0 && (
            <div>
              <Label>Related Use Cases</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {related.map((u) => (
                  <span key={u.id} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] text-zinc-400 ring-1 ring-zinc-700">
                    {u.use_case}
                  </span>
                ))}
              </div>
            </div>
          )}

          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/40"
            >
              <FileText className="w-3.5 h-3.5" />
              View PDF
            </a>
          )}
        </div>
      )}
    </article>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function Explorer({ useCases, caseStudies, links }: {
  useCases: UseCase[];
  caseStudies: CaseStudy[];
  links: CaseStudyUseCase[];
}) {
  const [search, setSearch] = useState('');
  const [depts, setDepts] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [costs, setCosts] = useState<string[]>([]);
  const [ai4mOnly, setAi4mOnly] = useState(false);
  const [caOnly, setCaOnly] = useState(false);
  const [esgOnly, setEsgOnly] = useState(false);
  const [compact, setCompact] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'dept' | 'goal' | 'cost' | 'tags'>('all');

  const allDepts = useMemo(() => [...new Set(useCases.map((u) => u.department))].sort(), [useCases]);
  const allGoals = useMemo(() => [...new Set(useCases.flatMap((u) => u.strategic_goals))].sort(), [useCases]);

  const toggle = <T,>(val: T, list: T[], set: (v: T[]) => void) =>
    set(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return useCases.filter((u) => {
      if (u.is_archived) return false;
      if (q &&
        !u.use_case.toLowerCase().includes(q) &&
        !u.department.toLowerCase().includes(q) &&
        !u.goal.toLowerCase().includes(q) &&
        !u.results.toLowerCase().includes(q) &&
        !u.strategic_goals.some((g) => g.toLowerCase().includes(q))) return false;
      if (depts.length && !depts.includes(u.department)) return false;
      if (goals.length && !goals.some((g) => u.strategic_goals.includes(g))) return false;
      if (costs.length && !costs.includes(u.cost_tier)) return false;
      if (ai4mOnly && !u.is_ai4m) return false;
      if (caOnly && !u.canadian_context) return false;
      if (esgOnly && !u.sustainability_focus) return false;
      return true;
    });
  }, [useCases, search, depts, goals, costs, ai4mOnly, caOnly, esgOnly]);

  const csMap = useMemo(() => {
    const m: Record<number, CaseStudy[]> = {};
    for (const l of links) {
      if (!m[l.use_case_id]) m[l.use_case_id] = [];
      const cs = caseStudies.find((c) => c.id === l.case_study_id);
      if (cs) m[l.use_case_id].push(cs);
    }
    return m;
  }, [caseStudies, links]);

  const activeCount = depts.length + goals.length + costs.length + (ai4mOnly ? 1 : 0) + (caOnly ? 1 : 0) + (esgOnly ? 1 : 0);
  const total = useCases.filter((u) => !u.is_archived).length;

  const clearAll = () => {
    setSearch(''); setDepts([]); setGoals([]); setCosts([]);
    setAi4mOnly(false); setCaOnly(false); setEsgOnly(false);
  };

  const filterTabs = [
    { id: 'all' as const,  label: 'All' },
    { id: 'dept' as const, label: 'Department' },
    { id: 'goal' as const, label: 'Goal' },
    { id: 'cost' as const, label: 'Cost' },
    { id: 'tags' as const, label: 'Tags' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* ── Hero ── */}
      <header className="relative overflow-hidden border-b border-zinc-900">
        {/* Gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute -top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-fuchsia-600/8 blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12">

          {/* Title */}
          <h1 className="text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              AI Use Case
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Explorer
            </span>
          </h1>

          <p className="text-zinc-400 text-base max-w-lg leading-relaxed mb-10">
            Discover proven AI applications built for manufacturers — filtered by department, strategic goal, and implementation cost.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 divide-x divide-zinc-800">
            <StatChip value={total} label="Use Cases" />
            <div className="pl-8"><StatChip value={allDepts.length} label="Departments" /></div>
            <div className="pl-8"><StatChip value={allGoals.length} label="Goals" /></div>
            <div className="pl-8"><StatChip value={useCases.filter((u) => u.is_ai4m).length} label="AI4M" /></div>
            <div className="pl-8"><StatChip value={caseStudies.length} label="Case Studies" /></div>
          </div>
        </div>
      </header>

      {/* ── Sticky search + filter bar ── */}
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur border-b border-zinc-900">
        <div className="max-w-6xl mx-auto px-6">

          {/* Search row */}
          <div className="flex items-center gap-3 py-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="text"
                placeholder="Search use cases, goals, departments…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
              <button
                onClick={() => setCompact(false)}
                className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${!compact ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCompact(true)}
                className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${compact ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Result count */}
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span><Mono className="font-semibold text-zinc-200">{filtered.length}</Mono> / {total}</span>
              {activeCount > 0 && (
                <button onClick={clearAll} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" />Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs row */}
          <div className="flex items-center gap-1 border-b border-zinc-900 -mx-6 px-6 overflow-x-auto">
            {filterTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`pb-3 px-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === t.id
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.label}
                {t.id === 'dept' && depts.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-violet-500 px-1.5 py-0.5 text-[9px] font-bold text-white">{depts.length}</span>
                )}
                {t.id === 'goal' && goals.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-violet-500 px-1.5 py-0.5 text-[9px] font-bold text-white">{goals.length}</span>
                )}
                {t.id === 'cost' && costs.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-violet-500 px-1.5 py-0.5 text-[9px] font-bold text-white">{costs.length}</span>
                )}
                {t.id === 'tags' && (ai4mOnly || caOnly || esgOnly) && (
                  <span className="ml-1.5 rounded-full bg-violet-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {(ai4mOnly ? 1 : 0) + (caOnly ? 1 : 0) + (esgOnly ? 1 : 0)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Filter pill drawer */}
          {activeTab !== 'all' && (
            <div className="py-3 flex flex-wrap gap-2">
              {activeTab === 'dept' && allDepts.map((d) => (
                <Pill key={d} label={d} active={depts.includes(d)} onClick={() => toggle(d, depts, setDepts)} />
              ))}
              {activeTab === 'goal' && allGoals.map((g) => (
                <Pill key={g} label={g} active={goals.includes(g)} onClick={() => toggle(g, goals, setGoals)} />
              ))}
              {activeTab === 'cost' && (['$', '$$', '$$$'] as const).map((c) => (
                <Pill key={c} label={`${c} — ${COST_META[c].label}`} active={costs.includes(c)} onClick={() => toggle(c, costs, setCosts)} />
              ))}
              {activeTab === 'tags' && (
                <>
                  <Pill label="⚡ AI4M Certified" active={ai4mOnly} onClick={() => setAi4mOnly((v) => !v)} />
                  <Pill label="🍁 Canadian Context" active={caOnly} onClick={() => setCaOnly((v) => !v)} />
                  <Pill label="🌱 ESG Focus" active={esgOnly} onClick={() => setEsgOnly((v) => !v)} />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-600">
              <Search className="w-7 h-7" />
            </div>
            <p className="text-lg font-semibold text-zinc-300">Nothing matches</p>
            <p className="mt-1 text-sm text-zinc-600">Try different filters or clear your search</p>
            <button onClick={clearAll} className="mt-6 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/50">
              Clear all filters
            </button>
          </div>
        ) : compact ? (
          <div className="flex flex-col gap-1">
            {filtered.map((uc) => (
              <UseCaseCard key={uc.id} uc={uc} linkedCaseStudies={csMap[uc.id] ?? []} compact />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((uc) => (
              <UseCaseCard key={uc.id} uc={uc} linkedCaseStudies={csMap[uc.id] ?? []} compact={false} />
            ))}
          </div>
        )}

        {/* ── Case Studies ── */}
        {caseStudies.length > 0 && (
          <section className="mt-20 mb-16">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Case Studies</h2>
              <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-400 ring-1 ring-zinc-700">
                {caseStudies.length}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mb-8">Real-world AI implementations submitted by AI4M member companies.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseStudies.map((cs) => {
                const ucIds = links.filter((l) => l.case_study_id === cs.id).map((l) => l.use_case_id);
                const related = useCases.filter((u) => ucIds.includes(u.id));
                return (
                  <CaseStudyCard key={cs.id} cs={cs} related={related} />
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-zinc-900 py-8 text-center text-xs text-zinc-600">
        AI Use Case Explorer
      </footer>
    </div>
  );
}
