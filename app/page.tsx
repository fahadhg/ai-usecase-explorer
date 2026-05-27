import { readFileSync } from 'fs';
import { join } from 'path';
import HomePage from '@/app/components/HomePage';
import type { UseCase, CaseStudy, CaseStudyUseCase } from '@/app/types';

function loadJSON<T>(filename: string): T {
  const filePath = join(process.cwd(), 'public', filename);
  return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
}

export default function Home() {
  const useCases    = loadJSON<UseCase[]>('use_cases.json');
  const caseStudies = loadJSON<CaseStudy[]>('case_studies.json');
  const links       = loadJSON<CaseStudyUseCase[]>('case_study_use_cases.json');

  return <HomePage useCases={useCases} caseStudies={caseStudies} links={links} />;
}
