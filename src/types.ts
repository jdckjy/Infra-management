
export type MenuKey = 'dashboard' | 'safety' | 'lease' | 'asset' | 'infra' | string;

export interface CustomTab {
    key: string;
    label: string;
    color: 'orange' | 'blue' | 'emerald' | 'purple';
}

export interface KPI {
    id: string;
    name: string;
    target: number;
    current: number;
    unit: string;
    activities: BusinessActivity[];
}

export interface BusinessActivity {
    id: string;
    content: string;
    status: 'ongoing' | 'completed' | 'paused';
    date: string;
    monthlyRecords: { month: number; plans: { content: string; completed: boolean }[] }[];
}

export interface Tenant {
    id: string;
    name: string;
    businessType: string;
    space: string;
    entryDate: string;
    contact: string;
}

export interface Facility {
    id: string;
    name: string;
    type: string;
    location: string;
    status: 'Operational' | 'Under Maintenance' | 'Offline';
    lastInspection: string;
}

export interface HotSpot {
    id: string;
    lat: number;
    lng: number;
    type: 'Safety Concern' | 'High Traffic' | 'Maintenance';
    description: string;
}

export interface SummaryStats {
    totalTenants: number;
    totalRevenue: number;
    occupancyRate: number;
    maintenanceRequests: number;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
}
