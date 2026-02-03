
import React from 'react';
import { Landmark, ArrowUpRight } from 'lucide-react';
import KPIManager from './KPIManager';
import { KPI, StateUpdater } from '../types';

interface AssetManagementProps {
  kpis: KPI[];
  onUpdate: StateUpdater<KPI[]>;
  mainValue: { value: number; change: number };
}

const AssetManagement: React.FC<AssetManagementProps> = ({ kpis, onUpdate, mainValue }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Landmark size={36} />
            </div>
            <div>
              <p className="text-emerald-100 font-bold text-sm uppercase tracking-wider">총 자산 가치</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">{mainValue.value}조원</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
            <ArrowUpRight size={24} className="text-emerald-300" />
            <div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase">전분기 대비</p>
              <p className="text-xl font-black">+{mainValue.change}조원</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <KPIManager sectionTitle="자산관리" kpis={kpis} onUpdate={onUpdate} accentColor="emerald" />
      </div>
    </div>
  );
};

export default AssetManagement;
