
import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import KPIManager from './KPIManager';
import HotSpotMap from './HotSpotMap';
import { KPI, StateUpdater } from '../types';

interface SafetyManagementProps {
  kpis: KPI[];
  onUpdate: StateUpdater<KPI[]>;
  mainValue: { days: number; change: number };
}

const SafetyManagement: React.FC<SafetyManagementProps> = ({ kpis, onUpdate, mainValue }) => {
  const [activeSubTab, setActiveSubTab] = useState<'kpi' | 'monitoring'>('monitoring');

  return (
    <div className="space-y-8 h-full overflow-y-auto pr-4">
      <div className="bg-white rounded-5xl p-10 shadow-sm border border-gray-50 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-0.5 bg-pink-50 text-pink-500 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-pink-100">Safety Control</span>
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accident-Free Days</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-6xl font-black tracking-tighter text-[#1A1D1F]">{mainValue.days}</h2>
            <span className="text-2xl font-bold text-gray-300 uppercase">Days</span>
          </div>
          <div className="flex items-center gap-2 mt-4">
             <div className="px-3 py-1 bg-emerald-50 text-emerald-500 rounded-full text-xs font-black">↗ Success Rate 98.2%</div>
             <span className="text-xs font-bold text-gray-400">Target: 1,000 Days Milestone</span>
          </div>
        </div>
        
        <div className="w-full md:w-80 flex flex-col gap-4">
          <div className="bg-gray-50/50 p-6 rounded-4xl border border-gray-100 flex items-center justify-between hover:bg-white transition-all cursor-pointer group">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Weekly Alerts</p>
              <h4 className="text-lg font-black leading-tight text-pink-500">2 Critical</h4>
              <p className="text-[10px] font-bold text-gray-400 mt-1">Updated 10m ago</p>
            </div>
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 group-hover:bg-pink-500 group-hover:text-white transition-all">
              <ShieldCheck size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
          <button onClick={() => setActiveSubTab('kpi')} className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all ${activeSubTab === 'kpi' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>KPI Reports</button>
          <button onClick={() => setActiveSubTab('monitoring')} className={`px-8 py-2.5 rounded-full text-xs font-bold transition-all ${activeSubTab === 'monitoring' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>Monitoring</button>
        </div>
      </div>

      {activeSubTab === 'kpi' ? (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <KPIManager sectionTitle="Safety Index" kpis={kpis} onUpdate={onUpdate} accentColor="orange" />
          </div>
          
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-5xl shadow-sm border border-gray-50 h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-lg">Real-time Alerts</h3>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></div>
              </div>
              <div className="space-y-6">
                {[
                  { title: 'Zone C: Safety perimeter breach', time: '10m ago', type: 'Critical', color: 'text-pink-500', bg: 'bg-pink-50' },
                  { title: 'Heavy rain alert: Inspect drainage', time: '1h ago', type: 'Warning', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { title: 'Equipment check: Crane #04', time: '3h ago', type: 'Normal', color: 'text-gray-400', bg: 'bg-gray-50' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-500 group-hover:text-black transition-colors block leading-tight">{item.title}</span>
                        <span className="text-[10px] font-bold text-gray-300 uppercase">{item.time}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-200 group-hover:text-black transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ height: 'calc(100vh - 300px)' }}>
          <HotSpotMap />
        </div>
      )}
    </div>
  );
};

export default SafetyManagement;
