export interface UseCase {
  id: number;
  department: string;
  use_case: string;
  goal: string;
  kpis: string;
  results: string;
  example: string;
  fit_criteria: string;
  not_fit_when: string;
  time_to_value: string;
  cost_tier: string;
  strategic_goals: string[];
  time_to_value_min: number;
  time_to_value_max: number;
  is_ai4m: boolean;
  ai4m_companies: string[] | null;
  ai4m_case_study_urls: string[] | null;
  canadian_context: boolean;
  sustainability_focus: boolean;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  archived_at: string | null;
  archived_by_case_study_id: string | null;
  use_case_references: { reference_number: string }[];
}

export interface CaseStudy {
  id: string;
  title: string;
  company_name: string;
  client_name?: string;
  pdf_path: string;
  brief_description: string;
  logo_path: string | null;
  logo_status: string | null;
  department?: string;
  goal?: string;
  results?: string;
  kpis?: string;
  example?: string;
  fit_criteria?: string;
  not_fit_when?: string;
  time_to_value?: string;
  cost_tier?: string;
  strategic_goals?: string[];
  sustainability_focus?: boolean;
}

export interface CaseStudyUseCase {
  case_study_id: string;
  use_case_id: number;
}
