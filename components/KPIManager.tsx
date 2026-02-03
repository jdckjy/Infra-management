
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target, BarChart3, Check, X, ClipboardList, Calendar, ChevronDown, Settings2 } from 'lucide-react';
import { KPI, StateUpdater, BusinessActivity } from '../types';
import ActivityDetailModal from './ActivityDetailModal';

interface KPIManagerProps {
  sectionTitle: string;
  kpis: KPI[];
  onUpdate: StateUpdater<KPI[]>;
  accentColor: string;
}

const KPIManager: React.FC<KPIManagerProps> = ({ sectionTitle, kpis, onUpdate, accentColor }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedKpiId, setSelectedKpiId] = useState<string | null>(null);
  const [newActivityText, setNewActivityText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<{kpiId: string, activity: BusinessActivity} | null>(null);

  const colorStyles: Record<string, { bg: string, text: string, hover: string, border: string, light: string, ring: string }> = {
    orange: { bg: 'bg-orange-600', text: 'text-orange-500', hover: 'hover:bg-orange-700', border: 'border-orange-100', light: 'bg-orange-50', ring: 'ring-orange-400' },
    blue: { bg: 'bg-blue-600', text: 'text-blue-500', hover: 'hover:bg-blue-700', border: 'border-blue-100', light: 'bg-blue-50', ring: 'ring-blue-400' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-500', hover: 'hover:bg-emerald-700', border: 'border-emerald-100', light: 'bg-emerald-50', ring: 'ring-emerald-400' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-500', hover: 'hover:bg-purple-700', border: 'border-purple-100', light: 'bg-purple-50', ring: 'ring-purple-400' },
  };

  const style = colorStyles[accentColor] || colorStyles.blue;

  const [formData, setFormData] = useState<Omit<KPI, 'id'>>({
    name: '',
    target: 0,
    current: 0,
    unit: '',
    activities: [],
  });

  const handleAddKpi = () => {
    if (!formData.name) return;
    const newKPI: KPI = { ...formData, id: `kpi-${Date.now()}`, activities: [] };
    onUpdate((prev) => [...prev, newKPI]);
    resetForm();
    setIsAdding(false);
  };

  const handleUpdateKpi = (id: string) => {
    onUpdate((prev) => prev.map(k => k.id === id ? { ...k, ...formData } : k));
    setEditingId(null);
    resetForm();
  };

  const handleAddActivity = (kpiId: string) => {
    if (!newActivityText.trim()) return;
    const newActivity: BusinessActivity = {
      id: `act-${Date.now()}`,
      content: newActivityText,
      status: 'ongoing',
      date: new Date().toISOString().split('T')[0],
      monthlyRecords: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        plans: []
      }))
    };
    onUpdate(prev => prev.map(k => k.id === kpiId ? { ...k, activities: [...(k.activities || []), newActivity] } : k));
    setNewActivityText('');
  };

  const handleSaveActivityDetail = (updatedActivity: BusinessActivity) => {
    if (!selectedActivity) return;
    onUpdate(prev => prev.map(k => k.id === selectedActivity.kpiId ? {
      ...k,
      activities: (k.activities || []).map(a => a.id === updatedActivity.id ? updatedActivity : a)
    } : k));
    setSelectedActivity(null);
  };

  const handleDeleteActivity = (kpiId: string, activityId: string) => {
    onUpdate(prev => prev.map(k => k.id === kpiId ? { 
      ...k, 
      activities: (k.activities || []).filter(a => a.id !== activityId) 
    } : k));
    setSelectedActivity(null);
  };

  const resetForm = () => setFormData({ name: '', target: 0, current: 0, unit: '', activities: [] });

  const statusBadge = (status: BusinessActivity['status']) => {
    const maps = {
      ongoing: { text: '진행중', class: 'bg-blue-100 text-blue-600' },
      completed: { text: '완료', class: 'bg-green-100 text-green-600' },
      delayed: { text: '지연', class: 'bg-red-100 text-red-600' },
    };
    const s = maps[status];
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.class}`}>{s.text}</span>;
  };

  const startEdit = (e: React.MouseEvent, kpi: KPI) => {
    e.stopPropagation();
    setEditingId(kpi.id);
    setFormData({ name: kpi.name, target: kpi.target, current: kpi.current, unit: kpi.unit, activities: kpi.activities || [] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1B2559] flex items-center gap-2">
          <BarChart3 size={20} className={style.text} />
          {sectionTitle} 관리 지표
        </h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => { setIsAdding(true); resetForm(); setSelectedKpiId(null); }}
            className={`flex items-center gap-1 px-4 py-2 ${style.bg} ${style.hover} text-white rounded-xl text-sm font-bold transition-all shadow-sm`}
          >
            <Plus size={16} /> 지표 추가
          </button>
        )}
      </div>

      <div className="space-y-4">
        {(isAdding || editingId) && (
          <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-sm text-gray-500">{editingId ? '지표 정보 수정' : '신규 지표 등록'}</h4>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-500"><Plus className="rotate-45" size={20}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input type="text" placeholder="지표 명칭" className="px-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              <input type="number" placeholder="목표" className="px-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none" value={formData.target} onChange={e => setFormData({ ...formData, target: Number(e.target.value) })} />
              <input type="number" placeholder="현재" className="px-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none" value={formData.current} onChange={e => setFormData({ ...formData, current: Number(e.target.value) })} />
              <input type="text" placeholder="단위" className="px-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-4 py-2 text-gray-400 text-sm font-bold">취소</button>
              <button onClick={() => editingId ? handleUpdateKpi(editingId) : handleAddKpi()} className={`px-6 py-2 ${style.bg} text-white rounded-xl text-sm font-bold shadow-md`}>저장</button>
            </div>
          </div>
        )}

        {kpis.map(kpi => {
          const progress = kpi.target > 0 ? Math.min(100, (kpi.current / kpi.target) * 100) : 0;
          const isSelected = selectedKpiId === kpi.id;
          return (
            <div key={kpi.id} className="group/card">
              <div 
                onClick={() => setSelectedKpiId(isSelected ? null : kpi.id)}
                className={`bg-white p-5 rounded-3xl shadow-sm border transition-all cursor-pointer relative ${
                  isSelected ? `border-2 ${style.border} ring-4 ring-opacity-10 ${style.ring}` : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-[#1B2559] text-lg">{kpi.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 font-medium">
                      <span>목표: {kpi.target}{kpi.unit}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                      <span>실적: {kpi.current}{kpi.unit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => startEdit(e, kpi)} className="p-2 hover:bg-blue-50 rounded-xl text-blue-500"><Edit2 size={16} /></button>
                    <button onClick={() => onUpdate(prev => prev.filter(k => k.id !== kpi.id))} className="p-2 hover:bg-red-50 rounded-xl text-red-400"><Trash2 size={16} /></button>
                    <ChevronDown size={20} className={`text-gray-300 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${style.bg} transition-all duration-1000`} style={{ width: `${progress}%` }} />
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 mx-4 p-6 bg-white border border-gray-100 rounded-b-3xl border-t-0 shadow-lg animate-in slide-in-from-top-4">
                  <h5 className="font-bold text-[#1B2559] mb-4">단위 업무 활동 내역</h5>
                  <div className="space-y-3">
                    {(kpi.activities || []).map((activity) => {
                      // 연간 이행 현황 정확한 계산: 계획이 1개 이상 있고, 모든 계획이 실행된 달만 카운트
                      const executedCount = (activity.monthlyRecords || []).filter(r => 
                        r.plans && r.plans.length > 0 && r.plans.every(p => p.isExecuted)
                      ).length;
                      
                      return (
                        <div 
                          key={activity.id} 
                          onClick={() => setSelectedActivity({ kpiId: kpi.id, activity })}
                          className="flex items-center justify-between p-4 bg-[#F8FAFD] rounded-2xl hover:bg-white border-2 border-transparent hover:border-blue-100 cursor-pointer group/item transition-all"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-700">{activity.content}</p>
                            <p className="text-[10px] text-gray-400 font-medium">연간 이행: {executedCount}/12 개월 완료</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <Settings2 size={16} className="text-gray-300 group-hover/item:text-blue-500" />
                            {statusBadge(activity.status)}
                          </div>
                        </div>
                      );
                    })}
                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="새로운 단위 업무를 입력하세요..."
                        className="flex-1 px-4 py-2.5 bg-[#F4F7FE] rounded-xl text-sm outline-none"
                        value={newActivityText}
                        onChange={(e) => setNewActivityText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddActivity(kpi.id)}
                      />
                      <button 
                        onClick={() => handleAddActivity(kpi.id)}
                        className={`p-2.5 ${style.bg} text-white rounded-xl shadow-md hover:scale-105`}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedActivity && (
        <ActivityDetailModal 
          activity={selectedActivity.activity}
          accentColor={accentColor}
          onClose={() => setSelectedActivity(null)}
          onSave={handleSaveActivityDetail}
          onDelete={() => handleDeleteActivity(selectedActivity.kpiId, selectedActivity.activity.id)}
        />
      )}
    </div>
  );
};

export default KPIManager;
