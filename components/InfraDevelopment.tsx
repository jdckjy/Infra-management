
import React from 'react';
import { HardHat, Compass, Layers, TrendingUp } from 'lucide-react';
import KPIManager from './KPIManager';
import { KPI, StateUpdater } from '../types';

interface InfraDevelopmentProps {
  kpis: KPI[];
  onUpdate: StateUpdater<KPI[]>;
  mainValue: { progress: number; change: number };
}

const InfraDevelopment: React.FC<InfraDevelopmentProps> = ({ kpis, onUpdate, mainValue }) => {
  return (
    <div className="space-y-8">
       <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <HardHat size={36} />
            </div>
            <div>
              <p className="text-purple-100 font-bold text-sm uppercase tracking-wider">인프라 조성 공정</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">평균 진척도 {mainValue.progress}%</h2>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                <TrendingUp size={20} className="text-purple-200" />
                <span className="font-bold text-sm">전월비 +{mainValue.change}%</span>
             </div>
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                <Layers size={20} className="text-purple-200" />
                <span className="font-bold text-sm">시공중 (2단계)</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <KPIManager sectionTitle="인프라조성" kpis={kpis} onUpdate={onUpdate} accentColor="purple" />
      </div>
    </div>
  );
};

export default InfraDevelopment;
