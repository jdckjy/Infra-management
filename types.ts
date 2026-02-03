
import React from 'react';

export type MenuKey = 'dashboard' | 'safety' | 'lease' | 'asset' | 'infra' | string;

export interface CustomTab {
  key: string;
  label: string;
  color: 'orange' | 'blue' | 'emerald' | 'purple';
}

export interface SummaryStats {
  safety: { days: number; change: number };
  lease: { rate: number; change: number };
  asset: { value: number; change: number };
  infra: { progress: number; change: number };
}

export interface StatItem {
  label: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  unit?: string;
}

export interface TaskItem {
  id: string;
  time: string;
  category: string;
  subject: string;
  assignee: string;
  status: 'pending' | 'completed' | 'urgent';
}

export interface PlanItem {
  id: string;
  text: string;
  isExecuted: boolean;
  week: number;
}

export interface MonthlyRecord {
  month: number;
  plans: PlanItem[];
}

export interface BusinessActivity {
  id: string;
  content: string;
  status: 'ongoing' | 'completed' | 'delayed';
  date: string;
  monthlyRecords?: MonthlyRecord[];
}

export interface KPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  activities?: BusinessActivity[];
}

export interface Tenant {
  id: string;
  name: string;
  usage: string; // 용도
  area: number;  // 면적 (m2)
  floor: number; // 층
  status: 'occupied' | 'vacant' | 'public'; // 임대/미임대/비임대 상태
}

export type StateUpdater<T> = React.Dispatch<React.SetStateAction<T>>;
