
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomTab, KPI, Tenant, Facility, HotSpot, BusinessActivity } from '../types';
import { 
  mockSafetyKPIs,
  mockFacilities, 
  mockHotspots,
  mockLeaseKPIs,
  mockTenants,
  mockAssetKPIs,
  mockInfraKPIs,
} from './mockData';

interface UnifiedDataContextType {
  customTabs: CustomTab[];
  setCustomTabs: React.Dispatch<React.SetStateAction<CustomTab[]>>;
  safetyKPIs: KPI[];
  setSafetyKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  facilities: Facility[];
  hotspots: HotSpot[];
  setHotspots: React.Dispatch<React.SetStateAction<HotSpot[]>>;
  leaseKPIs: KPI[];
  setLeaseKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  assetKPIs: KPI[];
  setAssetKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  infraKPIs: KPI[];
  setInfraKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  selectedMonth: number;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  updateKpiActivity: (kpiId: string, updatedActivity: BusinessActivity) => void;
  totalMonthlyPlans: number;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const UnifiedDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
    const [safetyKPIs, setSafetyKPIs] = useState<KPI[]>(mockSafetyKPIs);
    const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
    const [hotspots, setHotspots] = useState<HotSpot[]>(mockHotspots);
    const [leaseKPIs, setLeaseKPIs] = useState<KPI[]>(mockLeaseKPIs);
    const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
    const [assetKPIs, setAssetKPIs] = useState<KPI[]>(mockAssetKPIs);
    const [infraKPIs, setInfraKPIs] = useState<KPI[]>(mockInfraKPIs);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

    const updateKpiActivity = (kpiId: string, updatedActivity: BusinessActivity) => {
      const allKpis = [safetyKPIs, leaseKPIs, assetKPIs, infraKPIs];
      const allSetters = [setSafetyKPIs, setLeaseKPIs, setAssetKPIs, setInfraKPIs];

      allKpis.forEach((kpiList, index) => {
        const kpiIndex = kpiList.findIndex(k => k.id === kpiId);
        if (kpiIndex !== -1) {
          const setter = allSetters[index];
          setter(prevKpis => {
            const newKpis = [...prevKpis];
            const targetKpi = { ...newKpis[kpiIndex] };
            const activityIndex = targetKpi.activities.findIndex(a => a.id === updatedActivity.id);
            if (activityIndex !== -1) {
              targetKpi.activities[activityIndex] = updatedActivity;
              newKpis[kpiIndex] = targetKpi;
              return newKpis;
            }
            return prevKpis;
          });
        }
      });
    };

    const [totalMonthlyPlans, setTotalMonthlyPlans] = useState(0);

    useEffect(() => {
        const allKpis = [...safetyKPIs, ...leaseKPIs, ...assetKPIs, ...infraKPIs];
        let count = 0;
        allKpis.forEach(kpi => {
            kpi.activities.forEach(activity => {
                const monthRecord = activity.monthlyRecords.find(r => r.month === selectedMonth + 1);
                if (monthRecord) {
                    count += monthRecord.plans.length;
                }
            });
        });
        setTotalMonthlyPlans(count);
    }, [selectedMonth, safetyKPIs, leaseKPIs, assetKPIs, infraKPIs]);
    
    const value = {
        customTabs,
        setCustomTabs,
        safetyKPIs, setSafetyKPIs,
        facilities,
        hotspots, setHotspots,
        leaseKPIs, setLeaseKPIs,
        tenants, setTenants,
        assetKPIs, setAssetKPIs,
        infraKPIs, setInfraKPIs,
        selectedMonth,
        setSelectedMonth,
        updateKpiActivity,
        totalMonthlyPlans,
    };

    return (
        <UnifiedDataContext.Provider value={value}>
            {children}
        </UnifiedDataContext.Provider>
    );
};

export const useUnifiedData = () => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
  }
  return context;
};
