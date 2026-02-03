
import React from 'react';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import KPIManager from './KPIManager';
import { KPI, StateUpdater } from '../types';

interface SafetyManagementProps {
  kpis: KPI[];
  onUpdate: StateUpdater<KPI[]>;
  mainValue: { days: number; change: number };
}

const SafetyManagement: React.FC<SafetyManagementProps> = ({ kpis, onUpdate, mainValue }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-[40px] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <ShieldCheck size={36} />
            </div>
            <div>
              <p className="text-orange-100 font-bold text-sm uppercase tracking-wider">대표 성과 지표</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">무사고 {mainValue.days}일 달성</h2>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
            <div className="flex items-center gap-2 text-sm font-bold mb-1">
              <TrendingUp size={16} /> 전월 대비 상승
            </div>
            <p className="text-2xl font-black">+{mainValue.change}%</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KPIManager sectionTitle="안전관리" kpis={kpis} onUpdate={onUpdate} accentColor="orange" />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-500">
              <AlertTriangle size={20} /> 실시간 주의사항
            </h3>
            <div className="space-y-4">
              {[
                { title: 'C구역 크레인 안전반경 미준수', time: '10분 전', type: '위험' },
                { title: '우천 예보에 따른 배수로 점검', time: '1시간 전', type: '주의' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-[#111111]">{item.title}</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full shadow-sm text-gray-400">{item.time}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${item.type === '위험' ? 'text-red-500' : 'text-orange-500'}`}>{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyManagement;
