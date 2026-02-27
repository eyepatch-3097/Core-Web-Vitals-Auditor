export type PageCategory = 'cms' | 'main' | 'other';

export interface PageInsight {
  title: string;
  description: string;
  score: number;
}

export interface PageVitals {
  url: string;
  category: PageCategory;
  lcp?: number; // ms
  inp?: number; // ms
  cls?: number;
  performanceScore?: number;
  insights?: PageInsight[];
  status: 'pending' | 'loading' | 'success' | 'error';
}

export interface AdminStats {
  totalAudits: number;
  totalPagesAnalyzed: number;
  emails: string[];
}

export type Severity = 'good' | 'needs-improvement' | 'poor';

export const getLCPSeverity = (value: number): Severity => {
  if (value <= 2500) return 'good';
  if (value <= 4000) return 'needs-improvement';
  return 'poor';
};

export const getINPSeverity = (value: number): Severity => {
  if (value <= 200) return 'good';
  if (value <= 500) return 'needs-improvement';
  return 'poor';
};

export const getCLSSeverity = (value: number): Severity => {
  if (value <= 0.1) return 'good';
  if (value <= 0.25) return 'needs-improvement';
  return 'poor';
};
