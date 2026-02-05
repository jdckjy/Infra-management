
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import SafetyManagement from './components/SafetyManagement';
import LeaseRecruitment from './components/LeaseRecruitment';
import AssetManagement from './components/AssetManagement';
import InfraDevelopment from './components/InfraDevelopment';
import CustomPage from './components/CustomPage';
import TabModal from './components/TabModal';
import { MenuKey, KPI, TaskItem, SummaryStats, CustomTab, Tenant, Facility } from './types';

const STORAGE_KEYS = {
  TASKS: 'complex-mgt-v4-tasks',
  SAFETY: 'complex-mgt-v4-safety',
  LEASE: 'complex-mgt-v4-lease',
  TENANTS: 'complex-mgt-v4-tenants',
  FACILITIES: 'complex-mgt-v4-facilities', // 새로운 키
  ASSET: 'complex-mgt-v4-asset',
  INFRA: 'complex-mgt-v4-infra',
  CUSTOM_TABS: 'complex-mgt-v4-custom-tabs',
  DYNAMIC_DATA: 'complex-mgt-v4-dynamic-data',
};

// LocalStorage 관련 함수
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const saved = localStorage.getItem(key);
  if (saved && saved !== "undefined" && saved !== "null") {
    try {
      return JSON.parse(saved) as T;
    } catch (e) {
      console.error(`Failed to parse storage key: ${key}`, e);
    }
  }
  return defaultValue;
};

// 기본 데이터 정의
const BASELINE_KPIS: Record<string, KPI[]> = {
  // ... (기존 KPI 데이터)
};

const BASELINE_TENANTS: Tenant[] = [
  // ... (기존 Tenant 데이터)
];

const BASELINE_FACILITIES: Facility[] = [
  { id: 'facility-1', category: '공공편익시설', name: '도로', area: 160666, ratio: 0, content: '도로', buildingArea: 0, bcr: 0, gfa: 0, far: 0, usage: '-', height: '-', notes: '' },
  { id: 'facility-2', category: '공공편익시설', name: '보행자전용도로', area: 7670, ratio: 0, content: '보행자전용도로', buildingArea: 0, bcr: 0, gfa: 0, far: 0, usage: '-', height: '-', notes: '' },
  { id: 'facility-3', category: '공공편익시설', name: '중앙관리센터', area: 11743, ratio: 0, content: '-', buildingArea: 4267.51, bcr: 36.34, gfa: 9000.00, far: 76.64, usage: '업무시설, 근린생활시설', height: '12m(3층이하)', notes: '' },
  { id: 'facility-4', category: '숙박시설', name: '휴양콘도미니엄1', area: 30474, ratio: 0, content: '휴양콘도미니엄1', buildingArea: 9334.82, bcr: 30.63, gfa: 36922.55, far: 121.16, usage: '숙박시설, 근린생활시설', height: '12m(4층이하)', notes: '' },
  { id: 'facility-5', category: '상가시설', name: '웰니스몰1', area: 12475, ratio: 2.9, content: '웰니스몰1', buildingArea: 5590.00, bcr: 44.81, gfa: 11700.00, far: 93.79, usage: '근린생활시설, 판매시설', height: '-', notes: '' },
  { id: 'facility-6', category: '기타시설(의료,연구)', name: '헬스케어센터', area: 15737, ratio: 0, content: '헬스케어센터', buildingArea: 6000.00, bcr: 38.13, gfa: 30000.00, far: 190.63, usage: '의료시설, 근린생활시설', height: '15m(5층이하)', notes: '' },
];

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('dashboard');
  const [isTabModalOpen, setIsTabModalOpen] = useState(false);

  // 상태 관리
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadFromStorage(STORAGE_KEYS.TASKS, []));
  const [customTabs, setCustomTabs] = useState<CustomTab[]>(() => {
    const tabs = loadFromStorage<CustomTab[]>(STORAGE_KEYS.CUSTOM_TABS, []);
    return tabs.map(tab => tab.label === '공통관리' ? { ...tab, label: '단지시설정보' } : tab);
  });
  const [facilities, setFacilities] = useState<Facility[]>(() => loadFromStorage(STORAGE_KEYS.FACILITIES, BASELINE_FACILITIES));
  const [safetyKPIs, setSafetyKPIs] = useState<KPI[]>(() => loadFromStorage(STORAGE_KEYS.SAFETY, BASELINE_KPIS.safety || []));
  const [leaseKPIs, setLeaseKPIs] = useState<KPI[]>(() => loadFromStorage(STORAGE_KEYS.LEASE, BASELINE_KPIS.lease || []));
  const [tenants, setTenants] = useState<Tenant[]>(() => loadFromStorage(STORAGE_KEYS.TENANTS, BASELINE_TENANTS));
  const [assetKPIs, setAssetKPIs] = useState<KPI[]>(() => loadFromStorage(STORAGE_KEYS.ASSET, BASELINE_KPIS.asset || []));
  const [infraKPIs, setInfraKPIs] = useState<KPI[]>(() => loadFromStorage(STORAGE_KEYS.INFRA, BASELINE_KPIS.infra || []));
  const [dynamicKpis, setDynamicKpis] = useState<Record<string, KPI[]>>(() => loadFromStorage(STORAGE_KEYS.DYNAMIC_DATA, {}));

  // 데이터 저장 Effect
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CUSTOM_TABS, JSON.stringify(customTabs)); }, [customTabs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(facilities)); }, [facilities]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SAFETY, JSON.stringify(safetyKPIs)); }, [safetyKPIs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LEASE, JSON.stringify(leaseKPIs)); }, [leaseKPIs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants)); }, [tenants]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ASSET, JSON.stringify(assetKPIs)); }, [assetKPIs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INFRA, JSON.stringify(infraKPIs)); }, [infraKPIs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DYNAMIC_DATA, JSON.stringify(dynamicKpis)); }, [dynamicKpis]);
  
  // 임대율 계산 Effect
  useEffect(() => {
    const rentalTarget = tenants.filter(t => t.status !== 'public');
    const totalArea = rentalTarget.reduce((acc, t) => acc + (Number(t.area) || 0), 0);
    const occupiedArea = rentalTarget.filter(t => t.status === 'occupied').reduce((acc, t) => acc + (Number(t.area) || 0), 0);
    const newRate = totalArea > 0 ? Number(((occupiedArea / totalArea) * 100).toFixed(1)) : 0;
    setLeaseKPIs(prev => prev.map(k => k.id === 'default-lease' ? { ...k, current: newRate } : k));
  }, [tenants]);

  const summaryStats: SummaryStats = useMemo(() => ({
    safety: { days: safetyKPIs[0]?.current || 0, change: 0 },
    lease: { rate: leaseKPIs[0]?.current || 0, change: 0 },
    asset: { value: assetKPIs[0]?.current || 0, change: 0 },
    infra: { progress: infraKPIs[0]?.current || 0, change: 0 },
  }), [safetyKPIs, leaseKPIs, assetKPIs, infraKPIs]);

  const handleAddTab = (newTab: CustomTab) => {
    setCustomTabs(prev => [...prev, newTab]);
    setActiveMenu(newTab.key);
    setIsTabModalOpen(false);
  };

  const renderContent = () => {
    const customTab = customTabs.find(t => t.key === activeMenu);
    if (customTab) {
        if (customTab.label === '단지시설정보') {
            return <CustomPage title={customTab.label} facilities={facilities} setFacilities={setFacilities} />;
        }
        return <CustomPage title={customTab.label} />;
    }

    switch (activeMenu) {
      case 'dashboard': return <Dashboard tasks={tasks} onTasksUpdate={setTasks} summaryStats={summaryStats} />;
      case 'safety': return <SafetyManagement kpis={safetyKPIs} onUpdate={setSafetyKPIs} mainValue={summaryStats.safety} />;
      case 'lease': return <LeaseRecruitment kpis={leaseKPIs} onUpdate={setLeaseKPIs} tenants={tenants} onTenantsUpdate={setTenants} mainValue={summaryStats.lease} />;
      case 'asset': return <AssetManagement kpis={assetKPIs} onUpdate={setAssetKPIs} mainValue={summaryStats.asset} />;
      case 'infra': return <InfraDevelopment kpis={infraKPIs} onUpdate={setInfraKPIs} mainValue={summaryStats.infra} />;
      default: return <Dashboard tasks={tasks} onTasksUpdate={setTasks} summaryStats={summaryStats} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8F7F4] text-[#1A1D1F] font-sans">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} customTabs={customTabs} onAddTabOpen={() => setIsTabModalOpen(true)} />
      <main className="flex-1 flex flex-col overflow-hidden p-6 md:px-12 md:py-6 space-y-4">
        <Header activeMenu={activeMenu} customTabs={customTabs} />
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {renderContent()}
        </div>
      </main>
      {isTabModalOpen && <TabModal onClose={() => setIsTabModalOpen(false)} onSave={handleAddTab} />}
    </div>
  );
};

export default App;
