
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { KPI, BusinessActivity, CustomTab, HotSpot, Facility, NavigationState } from '../types';

interface UnifiedData {
  // Data states
  safetyKPIs: KPI[];
  leaseKPIs: KPI[];
  assetKPIs: KPI[];
  infraKPIs: KPI[];
  hotspots: HotSpot[];
  facilities: Facility[];
  customTabs: CustomTab[];
  
  // UI/Navigation states
  selectedMonth: number;
  totalMonthlyPlans: number;
  navigationState: NavigationState;

  // Setters and Actions
  setSafetyKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  setLeaseKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  setAssetKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  setInfraKPIs: React.Dispatch<React.SetStateAction<KPI[]>>;
  setHotspots: React.Dispatch<React.SetStateAction<HotSpot[]>>;
  setFacilities: React.Dispatch<React.SetStateAction<Facility[]>>;
  setSelectedMonth: React.Dispatch<React.SetStateAction<number>>;
  updateKpiActivity: (kpiId: string, updatedActivity: BusinessActivity) => void;
  addTab: (newTab: Omit<CustomTab, 'key'>) => void;
  navigateTo: (newState: Partial<NavigationState>) => void;
}

const UnifiedDataContext = createContext<UnifiedData | undefined>(undefined);

export const UnifiedDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Data states
  const [safetyKPIs, setSafetyKPIs] = useState<KPI[]>([]);
  const [leaseKPIs, setLeaseKPIs] = useState<KPI[]>([]);
  const [assetKPIs, setAssetKPIs] = useState<KPI[]>([]);
  const [infraKPIs, setInfraKPIs] = useState<KPI[]>([]);
  const [hotspots, setHotspots] = useState<HotSpot[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);

  // UI/Navigation states
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [totalMonthlyPlans, setTotalMonthlyPlans] = useState(0);
  const [navigationState, setNavigationState] = useState<NavigationState>({ menuKey: 'dashboard' });

  const navigateTo = useCallback((newState: Partial<NavigationState>) => {
    setNavigationState(prevState => ({ ...prevState, ...newState }));
  }, []);

  const addTab = useCallback((newTab: Omit<CustomTab, 'key'>) => {
    const key = `custom-${Date.now()}`;
    const tabWithKey = { ...newTab, key };
    setCustomTabs(prev => [...prev, tabWithKey]);
    navigateTo({ menuKey: key });
  }, [navigateTo]);


  const allKpiSetters: { [key: string]: React.Dispatch<React.SetStateAction<KPI[]>> } = {
    safety: setSafetyKPIs,
    lease: setLeaseKPIs,
    asset: setAssetKPIs,
    infra: setInfraKPIs,
  };

  const updateKpiActivity = useCallback((kpiId: string, updatedActivity: BusinessActivity) => {
    const kpiType = kpiId.split('-')[1];
    const setter = allKpiSetters[kpiType];
    if (setter) {
      setter(prevKpis =>
        prevKpis.map(kpi =>
          kpi.id === kpiId
            ? { ...kpi, activities: (kpi.activities || []).map(act => act.id === updatedActivity.id ? updatedActivity : act) }
            : kpi
        )
      );
    }
  }, []);

  useEffect(() => {
    const allKPIs = [...safetyKPIs, ...leaseKPIs, ...assetKPIs, ...infraKPIs];
    const count = allKPIs.reduce((acc, kpi) => {
        return acc + (kpi.activities || []).reduce((activityAcc, activity) => {
            const monthRecord = (activity.monthlyRecords || []).find(m => m.month === selectedMonth + 1);
            return activityAcc + (monthRecord?.plans?.length || 0);
        }, 0);
    }, 0);
    setTotalMonthlyPlans(count);
  }, [selectedMonth, safetyKPIs, leaseKPIs, assetKPIs, infraKPIs]);

  const value = {
    safetyKPIs, setSafetyKPIs,
    leaseKPIs, setLeaseKPIs,
    assetKPIs, setAssetKPIs,
    infraKPIs, setInfraKPIs,
    hotspots, setHotspots,
    facilities, setFacilities,
    customTabs, 
    selectedMonth, setSelectedMonth,
    totalMonthlyPlans,
    navigationState,
    updateKpiActivity,
    addTab,
    navigateTo,
  };

  return <UnifiedDataContext.Provider value={value}>{children}</UnifiedDataContext.Provider>;
};

export const useUnifiedData = (): UnifiedData => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
  }
  return context;
};
