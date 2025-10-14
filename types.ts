import { ReactNode } from 'react';

export enum AppState {
  INITIAL = 'INITIAL',
  ANALYZING = 'ANALYZING',
  REPORT = 'REPORT',
  BATCH_ANALYZING = 'BATCH_ANALYZING',
  BATCH_RESULTS = 'BATCH_RESULTS',
}

export enum LogoStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
}

export enum ReportViewMode {
  QUICK = 'QUICK',
  FULL = 'FULL',
  COMPARATIVE = 'COMPARATIVE',
}

export interface DataSource {
  id: string;
  name: string;
  logo: ReactNode;
  description: string;
}

export interface AnalysisStep {
  action: string;
  purpose: string;
  result: string;
  sourceId: string;
  latency?: number;
}

export interface ReportField {
  label: string;
  value: string;
  source: string;
  tooltip?: string;
  isNew?: boolean;
  category?: string;
}