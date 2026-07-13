'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search, X, ChevronDown, ChevronUp, Clock,
  TrendingUp, BarChart3, Building2, Target,
  CheckCircle2, XCircle, FileText,
  LayoutGrid, List, SlidersHorizontal, Users,
  Shield, Cpu, Settings2, Wrench, Globe,
  Award, Database, AlertTriangle, BookOpen,
} from 'lucide-react';
import type { UseCase, CaseStudy, CaseStudyUseCase } from '@/app/types';

// ─── Department colour system ──────────────────────────────────────────────────

const ALL_DEPARTMENTS = [
  'Manufacturing Operations',
  'Process Engineering',
  'Maintenance & Facilities',
  'Continuous Improvement & Operational Excellence',
  'Supply Chain & Logistics',
  'Quality Management',
  'Energy Management, Sustainability & ESG',
  'Finance & Cost Management',
  'Research, Product Development & Innovation',
  'IT, OT & Cybersecurity',
  'Data, Analytics & Governance',
  'Human Resources & Safety',
] as const;

const DEPT: Record<string, { border: string; pill: string; text: string; dot: string }> = {
  'Manufacturing Operations':                        { border: 'border-l-blue-500',    pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',         text: 'text-blue-600',    dot: 'bg-blue-400'    },
  'Process Engineering':                             { border: 'border-l-cyan-500',    pill: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',          text: 'text-cyan-600',    dot: 'bg-cyan-500'    },
  'Maintenance & Facilities':                        { border: 'border-l-amber-500',   pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       text: 'text-amber-600',   dot: 'bg-amber-400'   },
  'Continuous Improvement & Operational Excellence': { border: 'border-l-lime-600',    pill: 'bg-lime-50 text-lime-700 ring-1 ring-lime-200',          text: 'text-lime-700',    dot: 'bg-lime-500'    },
  'Supply Chain & Logistics':                        { border: 'border-l-orange-500',  pill: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',    text: 'text-orange-600',  dot: 'bg-orange-400'  },
  'Quality Management':                              { border: 'border-l-violet-500',  pill: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',    text: 'text-violet-600',  dot: 'bg-violet-400'  },
  'Energy Management, Sustainability & ESG':         { border: 'border-l-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', text: 'text-emerald-600', dot: 'bg-emerald-400' },
  'Finance & Cost Management':                       { border: 'border-l-yellow-500',  pill: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',    text: 'text-yellow-600',  dot: 'bg-yellow-500'  },
  'Research, Product Development & Innovation':      { border: 'border-l-indigo-500',  pill: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',    text: 'text-indigo-600',  dot: 'bg-indigo-400'  },
  'IT, OT & Cybersecurity':                          { border: 'border-l-sky-500',     pill: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',             text: 'text-sky-600',     dot: 'bg-sky-400'     },
  'Data, Analytics & Governance':                    { border: 'border-l-teal-500',    pill: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',          text: 'text-teal-600',    dot: 'bg-teal-400'    },
  'Human Resources & Safety':                        { border: 'border-l-pink-500',    pill: 'bg-pink-50 text-pink-700 ring-1 ring-pink-200',          text: 'text-pink-600',    dot: 'bg-pink-400'    },
};

const DEPT_FALLBACK = {
  border: 'border-l-slate-400',
  pill:   'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
  text:   'text-slate-500',
  dot:    'bg-slate-400',
};

const COST_META: Record<string, { symbol: string; label: string; color: string }> = {
  '$':   { symbol: '$',   label: 'Low Investment',  color: 'text-emerald-600' },
  '$$':  { symbol: '$$',  label: 'Med Investment',  color: 'text-amber-600'   },
  '$$$': { symbol: '$$$', label: 'High Investment', color: 'text-red-600'     },
};

// ─── Stakeholder roles — mapped exactly to user-provided table ─────────────────

type StakeholderRole = { role: string; short: string; Icon: React.ElementType; depts: string[] };

const STAKEHOLDER_ROLES: StakeholderRole[] = [
  { role: 'Business Owner',      short: 'Business',    Icon: Building2,     depts: ['Manufacturing Operations'] },
  { role: 'Technical Owner',     short: 'Technical',   Icon: Cpu,           depts: ['IT, OT & Cybersecurity'] },
  { role: 'Data Owner',          short: 'Data',        Icon: Database,      depts: ['Data, Analytics & Governance'] },
  { role: 'Process Owner',       short: 'Process',     Icon: Settings2,     depts: ['Process Engineering'] },
  { role: 'Maintenance Owner',   short: 'Maintenance', Icon: Wrench,        depts: ['Maintenance & Facilities'] },
  { role: 'Quality Owner',       short: 'Quality',     Icon: Shield,        depts: ['Quality Management'] },
  { role: 'People Owner',        short: 'People',      Icon: Users,         depts: ['Human Resources & Safety'] },
  { role: 'Safety & Compliance', short: 'Safety',      Icon: AlertTriangle, depts: ['Human Resources & Safety', 'Energy Management, Sustainability & ESG'] },
  { role: 'Financial Owner',     short: 'Finance',     Icon: TrendingUp,    depts: ['Finance & Cost Management'] },
  { role: 'Commercial Owner',    short: 'Commercial',  Icon: Globe,         depts: ['Research, Product Development & Innovation'] },
];

// ─── Shared helpers ────────────────────────────────────────────────────────────

function getPdfUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://usecases.agentimpact.ai/${path}`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#8AAAC4]">
      {children}
    </span>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`filter-pill rounded-lg px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${active ? 'active' : ''}`}
    >
      {label}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// USE CASES VIEW — original expandable cards with nested case studies
// ═══════════════════════════════════════════════════════════════════════════════

function NestedCaseStudyCard({ cs, parentUc }: { cs: CaseStudy; parentUc: UseCase }) {
  const pdfUrl = getPdfUrl(cs.pdf_path);
  const cost   = COST_META[parentUc.cost_tier];

  return (
    <div className="cs-child-card rounded-xl overflow-hidden">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3 justify-between">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 ring-1 ring-amber-200">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#0B1D3A] leading-snug">{cs.title}</p>
              <p className="text-[11px] text-amber-600 mt-0.5 font-medium">{cs.company_name}</p>
            </div>
          </div>
          {cost && <span className={`font-mono text-sm font-bold shrink-0 ${cost.color}`}>{cost.symbol}</span>}
        </div>

        <p className="text-[11px] text-[#4A6480] leading-relaxed line-clamp-2">{cs.brief_description}</p>

        <div className="grid grid-cols-2 gap-3 border-t border-[#1AAB6D]/12 pt-3">
          <div>
            <FieldLabel>Results</FieldLabel>
            <p className="mt-0.5 text-[11px] font-semibold text-emerald-600 leading-snug">
              {cs.results ?? parentUc.results}
            </p>
          </div>
          <div>
            <FieldLabel>KPIs</FieldLabel>
            <p className="mt-0.5 text-[11px] text-[#4A6480] leading-snug">
              {cs.kpis ?? parentUc.kpis}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] text-[#8AAAC4] font-mono">
            <Clock className="w-3 h-3" />
            {cs.time_to_value ?? parentUc.time_to_value}
          </span>
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-colors"
            >
              <FileText className="w-3 h-3" />
              View PDF
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function UseCaseExpandedDetail({ uc, linkedCaseStudies }: { uc: UseCase; linkedCaseStudies: CaseStudy[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Example</FieldLabel>
        <p className="mt-1.5 text-[#4A6480] text-xs leading-relaxed">{uc.example}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
          <div>
            <FieldLabel>Good fit when</FieldLabel>
            <p className="mt-1.5 text-[#4A6480] text-xs leading-relaxed">{uc.fit_criteria}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
          <div>
            <FieldLabel>Not a fit when</FieldLabel>
            <p className="mt-1.5 text-[#4A6480] text-xs leading-relaxed">{uc.not_fit_when}</p>
          </div>
        </div>
      </div>

      {uc.ai4m_companies && uc.ai4m_companies.length > 0 && (
        <div>
          <FieldLabel>AI4M Member Companies</FieldLabel>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {uc.ai4m_companies.map((c) => (
              <span key={c} className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] text-blue-700 ring-1 ring-blue-200">{c}</span>
            ))}
          </div>
        </div>
      )}

      {linkedCaseStudies.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FieldLabel>Case Studies</FieldLabel>
            <span className="ai4m-badge rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide">
              {linkedCaseStudies.length} {linkedCaseStudies.length === 1 ? 'Implementation' : 'Implementations'}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {linkedCaseStudies.map((cs) => (
              <NestedCaseStudyCard key={cs.id} cs={cs} parentUc={uc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UseCaseCard({ uc, linkedCaseStudies, compact }: {
  uc: UseCase;
  linkedCaseStudies: CaseStudy[];
  compact: boolean;
}) {
  const [open, setOpen] = useState(false);
  const d = DEPT[uc.department] ?? DEPT_FALLBACK;

  if (compact) {
    return (
      <div className={`uc-card border-l-2 ${d.border} rounded-xl cursor-pointer`} onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0B1D3A] truncate">{uc.use_case}</p>
            <p className={`text-xs truncate mt-0.5 ${d.text}`}>{uc.department}</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {linkedCaseStudies.length > 0 && (
              <span className="ai4m-badge rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide">
                {linkedCaseStudies.length} CS
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 text-[#8AAAC4] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {open && (
          <div className="px-4 pb-4 pt-1 border-t border-[#0B1D3A]/08" onClick={(e) => e.stopPropagation()}>
            <UseCaseExpandedDetail uc={uc} linkedCaseStudies={linkedCaseStudies} />
          </div>
        )}
      </div>
    );
  }

  return (
    <article className={`uc-card border-l-2 ${d.border} rounded-2xl flex flex-col overflow-hidden`}>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${d.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
            {uc.department}
          </span>
          {linkedCaseStudies.length > 0 && (
            <span className="ai4m-badge rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wide">
              {linkedCaseStudies.length} {linkedCaseStudies.length === 1 ? 'Case Study' : 'Case Studies'}
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-[#0B1D3A] leading-snug">{uc.use_case}</h3>

        <div>
          <FieldLabel><Target className="w-2 h-2 inline mr-1 -mt-px" />Goal</FieldLabel>
          <p className="mt-1.5 text-xs text-[#4A6480] leading-snug">{uc.goal}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {uc.strategic_goals.map((g) => (
            <span key={g} className="rounded-md bg-[#0B1D3A]/05 px-2 py-0.5 text-[10px] text-[#4A6480] ring-1 ring-[#0B1D3A]/08">{g}</span>
          ))}
        </div>

        <div className="pt-3 border-t border-[#0B1D3A]/08 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-[#8AAAC4] font-mono">
            <Clock className="w-3 h-3" />
            {uc.time_to_value}
          </span>
          {uc.sustainability_focus && (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">ESG</span>
          )}
        </div>

        {open && (
          <div className="pt-3 border-t border-[#0B1D3A]/08">
            <UseCaseExpandedDetail uc={uc} linkedCaseStudies={linkedCaseStudies} />
          </div>
        )}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-1.5 w-full py-2.5 text-[11px] font-medium text-[#8AAAC4] hover:text-[#4A6480] hover:bg-[#0B1D3A]/02 border-t border-[#0B1D3A]/08 transition-colors duration-200"
      >
        {open ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> More detail</>}
      </button>
    </article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CASE STUDIES VIEW — each case study as its own primary card
// ═══════════════════════════════════════════════════════════════════════════════

function CaseStudyCard({ cs, linkedUseCases, compact }: {
  cs: CaseStudy;
  linkedUseCases: UseCase[];
  compact: boolean;
}) {
  const [open, setOpen] = useState(false);
  const d      = DEPT[cs.department ?? ''] ?? DEPT_FALLBACK;
  const pdfUrl = getPdfUrl(cs.pdf_path);

  // Use case study's own fields first, fall back to primary linked use case
  const primaryUc        = linkedUseCases[0] ?? null;
  const results          = cs.results       ?? primaryUc?.results       ?? null;
  const kpis             = cs.kpis          ?? primaryUc?.kpis          ?? null;
  const goal             = cs.goal          ?? primaryUc?.goal          ?? null;
  const fitCriteria      = cs.fit_criteria  ?? primaryUc?.fit_criteria  ?? null;
  const notFitWhen       = cs.not_fit_when  ?? primaryUc?.not_fit_when  ?? null;
  const timeToValue      = cs.time_to_value ?? primaryUc?.time_to_value ?? null;
  const costTier         = cs.cost_tier     ?? primaryUc?.cost_tier     ?? null;
  const strategicGoals   = cs.strategic_goals ?? [...new Set(linkedUseCases.flatMap((u) => u.strategic_goals))];
  const isEsg            = cs.sustainability_focus ?? linkedUseCases.some((u) => u.sustainability_focus);
  const cost             = costTier ? COST_META[costTier] : null;

  if (compact) {
    return (
      <div className={`uc-card border-l-2 ${d.border} rounded-xl cursor-pointer`} onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0B1D3A] truncate">{cs.title}</p>
            <p className={`text-xs truncate mt-0.5 font-medium ${d.text}`}>{cs.company_name}</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {cost && <span className={`font-mono text-sm font-bold ${cost.color}`}>{cost.symbol}</span>}
            {isEsg && <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">ESG</span>}
            <ChevronDown className={`w-3.5 h-3.5 text-[#8AAAC4] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {open && (
          <div className="px-4 pb-4 pt-1 border-t border-[#0B1D3A]/08" onClick={(e) => e.stopPropagation()}>
            <CaseStudyExpandedDetail
              cs={cs} linkedUseCases={linkedUseCases} pdfUrl={pdfUrl}
              goal={goal} fitCriteria={fitCriteria} notFitWhen={notFitWhen}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <article className={`uc-card border-l-2 ${d.border} rounded-2xl flex flex-col overflow-hidden`}>
      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Dept + badges */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${d.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${d.dot}`} />
            {cs.department ?? 'General'}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {isEsg && <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">ESG</span>}
            {cost && <span className={`font-mono text-sm font-bold ${cost.color}`}>{cost.symbol}</span>}
          </div>
        </div>

        {/* Company */}
        {cs.logo_path ? (
          <div className="h-7 w-28 relative">
            <Image src={cs.logo_path} alt={cs.company_name} fill className="object-contain object-left" unoptimized />
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-[#8AAAC4]" />
            <span className="text-[11px] font-semibold text-[#4A6480]">
              {cs.client_name ? `${cs.company_name} × ${cs.client_name}` : cs.company_name}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-[#0B1D3A] leading-snug">{cs.title}</h3>

        {/* Description */}
        <p className="text-xs text-[#4A6480] leading-relaxed line-clamp-3">{cs.brief_description}</p>

        {/* Results + KPIs */}
        {(results || kpis) && (
          <div className="grid grid-cols-2 gap-3 border-t border-[#0B1D3A]/08 pt-3">
            {results && (
              <div>
                <FieldLabel>Results</FieldLabel>
                <p className="mt-0.5 text-[11px] font-semibold text-emerald-600 leading-snug">{results}</p>
              </div>
            )}
            {kpis && (
              <div>
                <FieldLabel>KPIs</FieldLabel>
                <p className="mt-0.5 text-[11px] text-[#4A6480] leading-snug">{kpis}</p>
              </div>
            )}
          </div>
        )}

        {/* Time to value + strategic goals */}
        <div className="flex items-center justify-between pt-1 gap-2">
          {timeToValue && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#8AAAC4] font-mono shrink-0">
              <Clock className="w-3 h-3" />
              {timeToValue}
            </span>
          )}
          <div className="flex flex-wrap gap-1 justify-end">
            {strategicGoals.map((g) => (
              <span key={g} className="rounded-md bg-[#0B1D3A]/05 px-2 py-0.5 text-[10px] text-[#4A6480] ring-1 ring-[#0B1D3A]/08">{g}</span>
            ))}
          </div>
        </div>

        {/* Expanded detail */}
        {open && (
          <div className="pt-3 border-t border-[#0B1D3A]/08">
            <CaseStudyExpandedDetail
              cs={cs} linkedUseCases={linkedUseCases} pdfUrl={pdfUrl}
              goal={goal} fitCriteria={fitCriteria} notFitWhen={notFitWhen}
            />
          </div>
        )}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-1.5 w-full py-2.5 text-[11px] font-medium text-[#8AAAC4] hover:text-[#4A6480] hover:bg-[#0B1D3A]/02 border-t border-[#0B1D3A]/08 transition-colors duration-200"
      >
        {open ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> More detail</>}
      </button>
    </article>
  );
}

function CaseStudyExpandedDetail({ cs, linkedUseCases, pdfUrl, goal, fitCriteria, notFitWhen }: {
  cs: CaseStudy;
  linkedUseCases: UseCase[];
  pdfUrl: string | null;
  goal: string | null;
  fitCriteria: string | null;
  notFitWhen: string | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      {goal && (
        <div>
          <FieldLabel><Target className="w-2 h-2 inline mr-1 -mt-px" />Goal</FieldLabel>
          <p className="mt-1.5 text-[#4A6480] text-xs leading-relaxed">{goal}</p>
        </div>
      )}

      {cs.example && (
        <div>
          <FieldLabel>Example</FieldLabel>
          <p className="mt-1.5 text-[#4A6480] text-xs leading-relaxed">{cs.example}</p>
        </div>
      )}

      {(fitCriteria || notFitWhen) && (
        <div className="grid grid-cols-2 gap-4">
          {fitCriteria && (
            <div className="flex gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />
              <div>
                <FieldLabel>Good fit when</FieldLabel>
                <p className="mt-1.5 text-[#4A6480] text-xs leading-relaxed">{fitCriteria}</p>
              </div>
            </div>
          )}
          {notFitWhen && (
            <div className="flex gap-2">
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
              <div>
                <FieldLabel>Not a fit when</FieldLabel>
                <p className="mt-1.5 text-[#4A6480] text-xs leading-relaxed">{notFitWhen}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {linkedUseCases.length > 0 && (
        <div>
          <FieldLabel>Linked Use Cases</FieldLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {linkedUseCases.map((uc) => (
              <span key={uc.id} className="rounded-md bg-blue-50 px-2.5 py-1 text-[11px] text-blue-700 ring-1 ring-blue-200">
                {uc.use_case}
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
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-[11px] font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
        >
          <FileText className="w-3 h-3" />
          View PDF
        </a>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPLORER
// ═══════════════════════════════════════════════════════════════════════════════

export default function Explorer({
  useCases, caseStudies, links,
}: { useCases: UseCase[]; caseStudies: CaseStudy[]; links: CaseStudyUseCase[] }) {

  const [activeView, setActiveView]           = useState<'use-cases' | 'case-studies'>('use-cases');
  const [search, setSearch]                   = useState('');
  const [depts, setDepts]                     = useState<string[]>([]);
  const [goals, setGoals]                     = useState<string[]>([]);
  const [costs, setCosts]                     = useState<string[]>([]);
  const [stakeholderRole, setStakeholderRole] = useState<string | null>(null);
  const [esgOnly, setEsgOnly]                 = useState(false);
  const [compact, setCompact]                 = useState(false);
  const [activeTab, setActiveTab]             = useState<'all' | 'dept' | 'goal' | 'cost' | 'stakeholder'>('all');

  const ai4mCases = useMemo(() => useCases.filter((u) => u.is_ai4m && !u.is_archived), [useCases]);

  // csMap: use_case_id → CaseStudy[] (for nesting inside use case cards)
  const csMap = useMemo(() => {
    const m: Record<number, CaseStudy[]> = {};
    for (const l of links) {
      if (!m[l.use_case_id]) m[l.use_case_id] = [];
      const cs = caseStudies.find((c) => c.id === l.case_study_id);
      if (cs) m[l.use_case_id].push(cs);
    }
    return m;
  }, [caseStudies, links]);

  // ucMap: case_study_id → UseCase[] (for tags on case study cards)
  const ucMap = useMemo(() => {
    const m: Record<string, UseCase[]> = {};
    for (const l of links) {
      if (!m[l.case_study_id]) m[l.case_study_id] = [];
      const uc = useCases.find((u) => u.id === l.use_case_id);
      if (uc) m[l.case_study_id].push(uc);
    }
    return m;
  }, [useCases, links]);

  const allGoalsUC = useMemo(
    () => [...new Set(ai4mCases.flatMap((u) => u.strategic_goals))].sort(),
    [ai4mCases],
  );

  const allGoalsCS = useMemo(() => {
    const s = new Set<string>();
    for (const cs of caseStudies) {
      for (const g of cs.strategic_goals ?? []) s.add(g);
      for (const uc of ucMap[cs.id] ?? []) for (const g of uc.strategic_goals) s.add(g);
    }
    return [...s].sort();
  }, [caseStudies, ucMap]);

  const deptCountsUC = useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of ALL_DEPARTMENTS) m[d] = 0;
    for (const u of ai4mCases) m[u.department] = (m[u.department] ?? 0) + 1;
    return m;
  }, [ai4mCases]);

  const deptCountsCS = useMemo(() => {
    const m: Record<string, number> = {};
    for (const d of ALL_DEPARTMENTS) m[d] = 0;
    for (const cs of caseStudies) {
      if (cs.department) m[cs.department] = (m[cs.department] ?? 0) + 1;
    }
    return m;
  }, [caseStudies]);

  const toggle = <T,>(val: T, list: T[], set: (v: T[]) => void) =>
    set(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);

  const stakeholderDepts = useMemo(() => {
    if (!stakeholderRole) return null;
    return STAKEHOLDER_ROLES.find((r) => r.role === stakeholderRole)?.depts ?? null;
  }, [stakeholderRole]);

  const filteredUC = useMemo(() => {
    const q = search.toLowerCase();
    return ai4mCases.filter((u) => {
      if (q && !u.use_case.toLowerCase().includes(q) && !u.department.toLowerCase().includes(q) &&
          !u.goal.toLowerCase().includes(q) && !u.strategic_goals.some((g) => g.toLowerCase().includes(q))) return false;
      if (depts.length && !depts.includes(u.department)) return false;
      if (goals.length && !goals.some((g) => u.strategic_goals.includes(g))) return false;
      if (costs.length && !costs.includes(u.cost_tier)) return false;
      if (stakeholderDepts && !stakeholderDepts.includes(u.department)) return false;
      if (esgOnly && !u.sustainability_focus) return false;
      return true;
    });
  }, [ai4mCases, search, depts, goals, costs, stakeholderDepts, esgOnly]);

  const filteredCS = useMemo(() => {
    const q = search.toLowerCase();
    return caseStudies.filter((cs) => {
      if (q && !cs.title.toLowerCase().includes(q) && !cs.company_name.toLowerCase().includes(q) &&
          !cs.brief_description.toLowerCase().includes(q)) return false;
      if (depts.length && !depts.includes(cs.department ?? '')) return false;
      if (stakeholderDepts && !stakeholderDepts.includes(cs.department ?? '')) return false;
      const linked = ucMap[cs.id] ?? [];
      const csGoals = [...(cs.strategic_goals ?? []), ...linked.flatMap((u) => u.strategic_goals)];
      const csCost  = cs.cost_tier ?? linked[0]?.cost_tier;
      if (goals.length && !goals.some((g) => csGoals.includes(g))) return false;
      if (costs.length && !costs.includes(csCost ?? '')) return false;
      if (esgOnly && !(cs.sustainability_focus ?? linked.some((u) => u.sustainability_focus))) return false;
      return true;
    });
  }, [caseStudies, ucMap, search, depts, goals, costs, stakeholderDepts, esgOnly]);

  const activeCount = depts.length + goals.length + costs.length + (stakeholderRole ? 1 : 0) + (esgOnly ? 1 : 0);
  const deptCounts  = activeView === 'use-cases' ? deptCountsUC : deptCountsCS;
  const allGoals    = activeView === 'use-cases' ? allGoalsUC   : allGoalsCS;
  const filtered    = activeView === 'use-cases' ? filteredUC   : filteredCS;
  const total       = activeView === 'use-cases' ? ai4mCases.length : caseStudies.length;

  const clearAll = () => { setSearch(''); setDepts([]); setGoals([]); setCosts([]); setStakeholderRole(null); setEsgOnly(false); };

  const FILTER_TABS = [
    { id: 'all'         as const, label: 'All Filters',    badge: null },
    { id: 'dept'        as const, label: 'Department',     badge: depts.length || null },
    { id: 'goal'        as const, label: 'Strategic Goal', badge: goals.length || null },
    { id: 'cost'        as const, label: 'Investment',     badge: costs.length || null },
    { id: 'stakeholder' as const, label: 'My Role',        badge: stakeholderRole ? 1 : null },
  ];

  return (
    <div className="bg-[#F2F6FF] text-[#0B1D3A]">

      {/* ── Section heading + view tabs ── */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-0">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-3.5 h-3.5 text-[#C8A020]" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#8A6800] font-mono">
                AI4M Certified Database
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0B1D3A]">
              Explore AI for Manufacturing
            </h2>
            <p className="text-[#4A6480] text-sm mt-2">
              Browse certified use cases or real-world implementations from AI4M member companies.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-[#8AAAC4] shrink-0">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
            Live
          </div>
        </div>

        {/* View toggle tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#0B1D3A]/08 shadow-sm w-fit">
          <button
            onClick={() => setActiveView('use-cases')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeView === 'use-cases'
                ? 'bg-[#0B1D3A] text-white shadow-sm'
                : 'text-[#4A6480] hover:text-[#0B1D3A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Use Cases
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${
              activeView === 'use-cases' ? 'bg-white/20 text-white' : 'bg-[#0B1D3A]/08 text-[#0B1D3A]/50'
            }`}>
              {ai4mCases.length}
            </span>
          </button>
          <button
            onClick={() => setActiveView('case-studies')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeView === 'case-studies'
                ? 'bg-[#1AAB6D] text-white shadow-sm'
                : 'text-[#4A6480] hover:text-[#0B1D3A]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Case Studies
            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold leading-none ${
              activeView === 'case-studies' ? 'bg-white/20 text-white' : 'bg-[#0B1D3A]/08 text-[#0B1D3A]/50'
            }`}>
              {caseStudies.length}
            </span>
          </button>
        </div>
      </div>

      {/* ── Sticky filter bar ── */}
      <div className="sticky top-0 z-20 explorer-bar mt-0">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex items-center gap-3 py-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8AAAC4]" />
              <input
                type="text"
                placeholder={activeView === 'use-cases' ? 'Search use cases, departments…' : 'Search case studies, companies…'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#0B1D3A]/10 bg-white pl-10 pr-4 py-2.5 text-sm text-[#0B1D3A] placeholder:text-[#8AAAC4] focus:outline-none focus:border-[#1565E8]/50 focus:ring-1 focus:ring-[#1565E8]/20 transition-colors shadow-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8AAAC4] hover:text-[#0B1D3A]">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <SlidersHorizontal className="w-4 h-4 text-[#8AAAC4]" />

            <div className="flex items-center gap-0.5 rounded-lg border border-[#0B1D3A]/10 bg-white p-1 shadow-sm">
              <button onClick={() => setCompact(false)} title="Grid view" className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${!compact ? 'bg-[#1565E8] text-white' : 'text-[#8AAAC4] hover:text-[#4A6480]'}`}>
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setCompact(true)} title="List view" className={`flex items-center justify-center w-7 h-7 rounded-md transition-colors ${compact ? 'bg-[#1565E8] text-white' : 'text-[#8AAAC4] hover:text-[#4A6480]'}`}>
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold font-mono text-[#0B1D3A] tabular-nums">{filtered.length}</span>
              <span className="text-[#8AAAC4]">/ {total}</span>
              {activeCount > 0 && (
                <button onClick={clearAll} className="flex items-center gap-1 text-xs text-[#8AAAC4] hover:text-red-500 transition-colors ml-1">
                  <X className="w-3 h-3" />Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-0 -mx-6 px-6 overflow-x-auto border-b border-[#0B1D3A]/08 scrollbar-none">
            {FILTER_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 pb-3 px-4 text-xs font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === t.id ? 'border-[#1565E8] text-[#0B1D3A]' : 'border-transparent text-[#8AAAC4] hover:text-[#4A6480]'
                }`}
              >
                {t.id === 'stakeholder' && <Users className="w-3 h-3" />}
                {t.label}
                {t.badge != null && (
                  <span className="rounded-full bg-[#1565E8] px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">{t.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Filter panels */}
          {activeTab !== 'all' && (
            <div className="py-4">
              {activeTab === 'dept' && (
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DEPARTMENTS.map((dep) => {
                    const count = deptCounts[dep] ?? 0;
                    const ds    = DEPT[dep];
                    return (
                      <button
                        key={dep}
                        onClick={() => count > 0 && toggle(dep, depts, setDepts)}
                        className={`filter-pill rounded-lg px-3 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${count === 0 ? 'opacity-35 cursor-not-allowed' : ''} ${depts.includes(dep) ? 'active' : ''}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${ds?.dot ?? 'bg-slate-400'}`} />
                        {dep}
                        <span className={`ml-0.5 text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none ${depts.includes(dep) ? 'bg-white/30 text-white' : count > 0 ? 'bg-[#0B1D3A]/08 text-[#0B1D3A]/50' : 'bg-[#0B1D3A]/05 text-[#0B1D3A]/25'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {activeTab === 'goal' && (
                <div className="flex flex-wrap gap-1.5">
                  {allGoals.map((g) => (
                    <FilterPill key={g} label={g} active={goals.includes(g)} onClick={() => toggle(g, goals, setGoals)} />
                  ))}
                </div>
              )}

              {activeTab === 'cost' && (
                <div className="flex flex-wrap gap-1.5">
                  {(['$', '$$', '$$$'] as const).map((c) => (
                    <FilterPill key={c} label={`${c}  ${COST_META[c].label}`} active={costs.includes(c)} onClick={() => toggle(c, costs, setCosts)} />
                  ))}
                </div>
              )}

              {activeTab === 'stakeholder' && (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] uppercase tracking-widest text-[#8AAAC4] font-mono font-bold">
                    Select your role — filters results relevant to your mandate
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {STAKEHOLDER_ROLES.map(({ role, short, Icon }) => (
                      <button
                        key={role}
                        onClick={() => setStakeholderRole((v) => v === role ? null : role)}
                        className={`role-card rounded-xl p-3 flex flex-col items-center gap-2 text-center ${stakeholderRole === role ? 'active' : ''}`}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${stakeholderRole === role ? 'bg-[#1565E8] text-white' : 'bg-[#F2F6FF] text-[#4A6480]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[11px] font-semibold leading-tight ${stakeholderRole === role ? 'text-[#1AAB6D]' : 'text-[#4A6480]'}`}>
                          {short}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => setEsgOnly((v) => !v)}
                      className={`role-card rounded-xl p-3 flex flex-col items-center gap-2 text-center ${esgOnly ? 'active' : ''}`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${esgOnly ? 'bg-emerald-600 text-white' : 'bg-[#F2F6FF] text-[#4A6480]'}`}>
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-semibold leading-tight ${esgOnly ? 'text-[#1AAB6D]' : 'text-[#4A6480]'}`}>ESG</span>
                    </button>
                  </div>
                  {stakeholderRole && (
                    <p className="text-[11px] text-[#1565E8]/70">
                      Showing departments: {STAKEHOLDER_ROLES.find((r) => r.role === stakeholderRole)?.depts.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Grid / list ── */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#0B1D3A]/08 text-[#8AAAC4] shadow-sm">
              <Search className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold text-[#0B1D3A]/70">No results found</p>
            <p className="mt-1 text-sm text-[#8AAAC4]">Adjust your filters or clear the search</p>
            <button onClick={clearAll} className="mt-6 rounded-xl bg-[#1565E8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1253C0] transition-colors shadow-md shadow-[#1565E8]/20">
              Clear all filters
            </button>
          </div>
        ) : compact ? (
          <div className="flex flex-col gap-1.5">
            {activeView === 'use-cases'
              ? (filteredUC as UseCase[]).map((uc) => <UseCaseCard key={uc.id} uc={uc} linkedCaseStudies={csMap[uc.id] ?? []} compact />)
              : (filteredCS as CaseStudy[]).map((cs) => <CaseStudyCard key={cs.id} cs={cs} linkedUseCases={ucMap[cs.id] ?? []} compact />)
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeView === 'use-cases'
              ? (filteredUC as UseCase[]).map((uc) => <UseCaseCard key={uc.id} uc={uc} linkedCaseStudies={csMap[uc.id] ?? []} compact={false} />)
              : (filteredCS as CaseStudy[]).map((cs) => <CaseStudyCard key={cs.id} cs={cs} linkedUseCases={ucMap[cs.id] ?? []} compact={false} />)
            }
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#0B1D3A]/08 py-12 bg-[#F2F6FF]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-[#8AAAC4]">AI4M Use Case Explorer</span>
            <span className="text-[#C8D8F0]">·</span>
            <span className="text-[10px] font-mono text-[#8AAAC4]">© {new Date().getFullYear()} AI4M Canada</span>
          </div>
          <a href="https://ai4manufacturing.ca" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-[#8AAAC4] hover:text-[#1565E8] transition-colors">
            ai4manufacturing.ca
          </a>
        </div>
      </footer>
    </div>
  );
}
