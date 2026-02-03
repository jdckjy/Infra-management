
import React, { useState, useMemo } from 'react';
import { Building2, LayoutList, Map as MapIcon, Search, AlertCircle, Save, Trash2, Edit3, X, Plus, PlusCircle } from 'lucide-react';
import KPIManager from './KPIManager';
import { KPI, StateUpdater, Tenant } from '../types';

interface LeaseRecruitmentProps {
  kpis: KPI[];
  onUpdate: StateUpdater<KPI[]>;
  tenants: Tenant[];
  onTenantsUpdate: StateUpdater<Tenant[]>;
  mainValue: { rate: number; change: number };
}

const LeaseRecruitment: React.FC<LeaseRecruitmentProps> = ({ kpis, onUpdate, tenants, onTenantsUpdate, mainValue }) => {
  const [activeSubTab, setActiveSubTab] = useState<'management' | 'occupancy'>('occupancy');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  
  // 1. 임대(occupied) 및 미임대(vacant) 공간만 리스트에 표시 (비임대 제외)
  const filteredTenants = useMemo(() => 
    tenants.filter(t => 
      t.floor === selectedFloor && 
      (t.status === 'occupied' || t.status === 'vacant') && 
      (t.name.includes(searchTerm) || t.id.includes(searchTerm))
    ),
  [tenants, selectedFloor, searchTerm]);

  // 2. 현재 선택된 층의 통계 (하단 요약용)
  const floorStats = useMemo(() => {
    const floorTenants = tenants.filter(t => t.floor === selectedFloor);
    const rentalTarget = floorTenants.filter(t => t.status !== 'public');
    
    const totalArea = rentalTarget.reduce((acc, t) => acc + (Number(t.area) || 0), 0);
    const occupiedArea = rentalTarget.filter(t => t.status === 'occupied').reduce((acc, t) => acc + (Number(t.area) || 0), 0);
    const vacantCount = rentalTarget.filter(t => t.status === 'vacant').length;
    const occupiedCount = rentalTarget.filter(t => t.status === 'occupied').length;
    
    const rate = totalArea > 0 ? ((occupiedArea / totalArea) * 100).toFixed(1) : "0";
    
    return { totalArea, occupiedArea, rate, occupiedCount, vacantCount };
  }, [tenants, selectedFloor]);

  // 3. 단지 전체 임대율 (대시보드와 직접 연동된 mainValue.rate 사용)
  const totalLeaseRate = mainValue.rate.toFixed(1);

  // 4. 호실 추가 핸들러
  const handleAddNewUnit = () => {
    const newId = `U-${selectedFloor}F-${Date.now().toString().slice(-4)}`;
    setEditingTenant({
      id: newId,
      name: '신규 입점 예정',
      usage: '용도 미지정',
      area: 100,
      floor: selectedFloor,
      status: 'vacant'
    });
  };

  // 5. 저장/수정 핸들러 (신규/기존 통합)
  const handleSaveTenant = (updated: Tenant) => {
    onTenantsUpdate(prev => {
      const exists = prev.find(t => t.id === updated.id);
      if (exists) {
        return prev.map(t => t.id === updated.id ? updated : t);
      } else {
        return [...prev, updated];
      }
    });
    setEditingTenant(null);
  };

  const handleDeleteTenant = (id: string) => {
    if (confirm('해당 호실 데이터를 영구 삭제하시겠습니까?')) {
      onTenantsUpdate(prev => prev.filter(t => t.id !== id));
      setEditingTenant(null);
    }
  };

  const TenantListItem: React.FC<{ tenant: Tenant }> = ({ tenant }) => {
    const isVacant = tenant.status === 'vacant';
    return (
      <div 
        onClick={() => setEditingTenant(tenant)}
        className={`group flex items-center justify-between p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        isVacant 
          ? 'bg-white border-red-500 border-dashed ring-4 ring-red-500/5' 
          : 'bg-white border-slate-100 hover:border-yellow-400 shadow-sm'
      }`}>
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className={`w-3 h-12 rounded-full shrink-0 ${
            isVacant ? 'bg-red-500 animate-pulse shadow-lg shadow-red-200' : 'bg-[#FFD700] shadow-md shadow-yellow-100'
          }`}></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[11px] font-black tracking-tighter ${isVacant ? 'text-red-400' : 'text-slate-400'}`}>
                {tenant.id}
              </span>
              <span className="text-[10px] font-bold text-slate-300 uppercase">| {tenant.usage}</span>
            </div>
            <h4 className={`text-xl font-black truncate tracking-tighter ${
              isVacant ? 'text-red-600' : 'text-slate-900'
            }`}>
              {isVacant ? '임대 모집중' : tenant.name}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-6 ml-4">
          <div className="text-right">
            <p className="text-lg font-mono font-black text-slate-700 leading-none">{Math.round(tenant.area)}<span className="text-xs ml-0.5 opacity-40 font-sans">m²</span></p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors shadow-inner">
             <Edit3 size={18} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full space-y-8 pb-10">
      {/* Header Banner - 전체 임대율 연동 */}
      <div className="bg-[#111315] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shrink-0 border border-white/5">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-white/10">
              <Building2 size={40} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/30">Master Inventory Module</span>
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest hidden md:block">Real-time Sync Active</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">단지 임대유치 및 호실 관리</h2>
            </div>
          </div>
          
          <div className="flex gap-6">
             <div className="bg-white/5 backdrop-blur-3xl px-12 py-6 rounded-[2.5rem] border border-white/10 text-center ring-1 ring-white/10">
                <p className="text-[10px] font-black text-blue-400 mb-1 uppercase tracking-widest">단지 전체 임대율 (대시보드 연동)</p>
                <div className="flex items-baseline justify-center gap-1">
                  <p className="text-5xl font-black text-white tracking-tighter">{totalLeaseRate}</p>
                  <span className="text-xl font-black text-slate-600">%</span>
                </div>
             </div>
             <div className="bg-white/5 backdrop-blur-3xl px-12 py-6 rounded-[2.5rem] border border-white/10 text-center hidden md:block">
                <p className="text-[10px] font-black text-red-400 mb-1 uppercase tracking-widest">현재 층 공실 ({selectedFloor}F)</p>
                <div className="flex items-baseline justify-center gap-1 text-white">
                  <p className="text-5xl font-black tracking-tighter">{floorStats.vacantCount}</p>
                  <span className="text-xl font-black opacity-40">실</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 shrink-0">
          <div className="flex bg-white p-2 rounded-[2.5rem] shadow-xl border border-slate-100">
            <button
              onClick={() => setActiveSubTab('management')}
              className={`flex items-center gap-3 px-10 py-4 rounded-3xl text-xs font-black transition-all ${
                activeSubTab === 'management' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <LayoutList size={18} /> 유치 성과 지표
            </button>
            <button
              onClick={() => setActiveSubTab('occupancy')}
              className={`flex items-center gap-3 px-10 py-4 rounded-3xl text-xs font-black transition-all ${
                activeSubTab === 'occupancy' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-800'
              }`}
            >
              <MapIcon size={18} /> 실별 상세 내역
            </button>
          </div>

          {activeSubTab === 'occupancy' && (
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-200/50 p-1.5 rounded-full gap-1 shadow-inner">
                {[1, 2, 3].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFloor(f)}
                    className={`px-10 py-3 rounded-full text-xs font-black transition-all ${
                      selectedFloor === f ? 'bg-white text-blue-600 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {f}F
                  </button>
                ))}
              </div>
              <div className="relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                  type="text" 
                  placeholder="호실 또는 테넌트 검색" 
                  className="pl-14 pr-6 py-4 bg-white rounded-full text-xs font-bold border-none shadow-xl outline-none focus:ring-2 focus:ring-blue-400 w-64 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button 
                onClick={handleAddNewUnit}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full text-xs font-black shadow-xl hover:bg-blue-700 transition-all active:scale-95"
              >
                <PlusCircle size={18} /> 호실 추가
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeSubTab === 'management' ? (
            <KPIManager sectionTitle="임대유치" kpis={kpis} onUpdate={onUpdate} accentColor="blue" />
          ) : (
            <div className="space-y-12 animate-in slide-in-from-bottom-6 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTenants.length > 0 ? (
                  filteredTenants.map(t => <TenantListItem key={t.id} tenant={t} />)
                ) : (
                  <div className="col-span-full py-40 bg-white/40 rounded-[4rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                    <AlertCircle size={60} className="mb-4 opacity-20" />
                    <p className="text-xl font-black uppercase tracking-[0.2em]">Inventory Exhausted</p>
                    <p className="text-sm font-bold opacity-60 mt-2">임대/미임대 공간이 없거나 검색 결과가 없습니다.</p>
                  </div>
                )}
              </div>

              {/* Floor Summary Footer */}
              <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-slate-50 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[#FFD700] rounded-full shadow-lg shadow-yellow-200 border-2 border-white"></div>
                    <span className="text-xs font-black text-slate-500 uppercase">임대 완료: {floorStats.occupiedCount}실</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-200 border-2 border-white"></div>
                    <span className="text-xs font-black text-slate-500 uppercase">미임대 (모집중): {floorStats.vacantCount}실</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-12">
                   <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Floor Rental Area</p>
                     <p className="text-3xl font-mono font-black text-slate-800 leading-none">{floorStats.totalArea.toLocaleString()}<span className="text-sm font-sans font-bold opacity-30 ml-1">m²</span></p>
                   </div>
                   <div className="w-px h-14 bg-slate-100 hidden md:block"></div>
                   <div className="text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Floor Occupancy</p>
                     <div className="flex items-center gap-4">
                        <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${floorStats.rate}%` }}></div>
                        </div>
                        <p className="text-4xl font-black text-blue-600 tracking-tighter">{floorStats.rate}%</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit/Create Modal */}
      {editingTenant && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#F8F9FD] w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className={`p-12 ${
              editingTenant.status === 'vacant' ? 'bg-red-500' : 
              editingTenant.status === 'public' ? 'bg-slate-700' : 
              'bg-blue-600'
            } text-white transition-colors duration-500 relative`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Unit Configuration Mode</span>
                  <input 
                    type="text"
                    className="bg-transparent border-none text-4xl font-black outline-none w-full tracking-tighter mt-1"
                    value={editingTenant.id}
                    onChange={e => setEditingTenant({...editingTenant, id: e.target.value})}
                  />
                </div>
                <button onClick={() => setEditingTenant(null)} className="p-3 hover:bg-white/20 rounded-full transition-all">
                  <X size={32} />
                </button>
              </div>
            </div>

            <div className="p-12 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">테넌트/기관 명칭</label>
                  <input 
                    type="text" 
                    className="w-full px-7 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                    value={editingTenant.name}
                    onChange={e => setEditingTenant({...editingTenant, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">주요 사용 용도</label>
                  <input 
                    type="text" 
                    className="w-full px-7 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                    value={editingTenant.usage}
                    onChange={e => setEditingTenant({...editingTenant, usage: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">전용 면적 (m²)</label>
                  <input 
                    type="number" 
                    className="w-full px-7 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    value={editingTenant.area}
                    onChange={e => setEditingTenant({...editingTenant, area: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">층수 레이어</label>
                  <select 
                    className="w-full px-7 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm cursor-pointer"
                    value={editingTenant.floor}
                    onChange={e => setEditingTenant({...editingTenant, floor: Number(e.target.value)})}
                  >
                    {[1, 2, 3].map(f => <option key={f} value={f}>{f}F Layer</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">관리 상태 전환</label>
                  <select 
                    className="w-full px-7 py-5 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm cursor-pointer"
                    value={editingTenant.status}
                    onChange={e => setEditingTenant({...editingTenant, status: e.target.value as any})}
                  >
                    <option value="occupied">임대 완료 (Occupied)</option>
                    <option value="vacant">미임대 (Vacant)</option>
                    <option value="public">비임대 (Infrastructure)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-slate-100">
                <button 
                  onClick={() => handleDeleteTenant(editingTenant.id)}
                  className="flex items-center justify-center gap-2 px-8 py-5 rounded-[1.5rem] font-black text-red-500 hover:bg-red-50 transition-all text-xs"
                >
                  <Trash2 size={20} /> 데이터 영구 삭제
                </button>
                <div className="flex-1"></div>
                <button 
                  onClick={() => setEditingTenant(null)}
                  className="px-10 py-5 rounded-[1.5rem] font-black text-slate-400 hover:bg-slate-100 transition-all text-xs"
                >
                  취소
                </button>
                <button 
                  onClick={() => handleSaveTenant(editingTenant)}
                  className="flex items-center justify-center gap-3 px-12 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all text-xs"
                >
                  <Save size={20} /> 정보 동기화 및 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseRecruitment;
