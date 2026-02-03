
import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Calendar, Trash2, Save, Activity as ActivityIcon, Plus, ChevronRight, CheckCircle2, Circle, Clock, ShieldCheck } from 'lucide-react';
import { BusinessActivity, MonthlyRecord, PlanItem } from '../types';

interface ActivityDetailModalProps {
  activity: BusinessActivity;
  accentColor: string;
  onClose: () => void;
  onSave: (updatedActivity: BusinessActivity) => void;
  onDelete: () => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ 
  activity, 
  accentColor, 
  onClose, 
  onSave, 
  onDelete 
}) => {
  const [editedContent, setEditedContent] = useState(activity.content);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [newPlanText, setNewPlanText] = useState('');

  // 데이터 구조 호환성 보장 및 주차 필드 초기화
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>(() => {
    const rawRecords = activity.monthlyRecords || [];
    return Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const found = rawRecords.find(r => r.month === monthNum);
      
      let plans: PlanItem[] = [];
      if (found && Array.isArray(found.plans)) {
        // 기존 데이터에 week가 없으면 1주차로 할당
        plans = found.plans.map(p => ({ ...p, week: p.week || 1 }));
      }
      return { month: monthNum, plans };
    });
  });

  const colorStyles: Record<string, { bg: string, text: string, border: string, light: string, shadow: string }> = {
    orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-50', shadow: 'shadow-orange-200' },
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50', shadow: 'shadow-blue-200' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-600', light: 'bg-emerald-50', shadow: 'shadow-emerald-200' },
    purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', light: 'bg-purple-50', shadow: 'shadow-purple-200' },
  };

  const theme = colorStyles[accentColor] || colorStyles.blue;

  const currentMonthRecord = useMemo(() => 
    monthlyRecords.find(r => r.month === selectedMonth) || { month: selectedMonth, plans: [] },
  [monthlyRecords, selectedMonth]);

  // 현재 선택된 주차의 데이터만 필터링
  const weeklyPlans = useMemo(() => 
    (currentMonthRecord.plans || []).filter(p => p.week === selectedWeek),
  [currentMonthRecord, selectedWeek]);

  const handleAddPlan = () => {
    if (!newPlanText.trim()) return;
    const newItem: PlanItem = {
      id: `plan-${Date.now()}`,
      text: newPlanText.trim(),
      isExecuted: false,
      week: selectedWeek // 현재 선택된 주차 반영
    };

    setMonthlyRecords(prev => prev.map(r => 
      r.month === selectedMonth ? { ...r, plans: [...(r.plans || []), newItem] } : r
    ));
    setNewPlanText('');
  };

  const handleTogglePlan = (planId: string) => {
    setMonthlyRecords(prev => prev.map(r => 
      r.month === selectedMonth 
        ? { ...r, plans: (r.plans || []).map(p => p.id === planId ? { ...p, isExecuted: !p.isExecuted } : p) } 
        : r
    ));
  };

  const handleDeletePlan = (planId: string) => {
    setMonthlyRecords(prev => prev.map(r => 
      r.month === selectedMonth 
        ? { ...r, plans: (r.plans || []).filter(p => p.id !== planId) } 
        : r
    ));
  };

  const handleSave = () => {
    const updated: BusinessActivity = {
      ...activity,
      content: editedContent,
      monthlyRecords: monthlyRecords,
      status: monthlyRecords.some(r => (r.plans || []).some(p => p.isExecuted)) ? 'ongoing' : activity.status
    };
    onSave(updated);
  };

  const totalPlans = currentMonthRecord.plans?.length || 0;
  const completedPlans = (currentMonthRecord.plans || []).filter(p => p.isExecuted).length;
  const monthProgress = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  const weeklyTotal = weeklyPlans.length;
  const weeklyCompleted = weeklyPlans.filter(p => p.isExecuted).length;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#F8F9FD] w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col border border-white/20">
        
        {/* Header Section */}
        <div className={`${theme.bg} p-8 text-white relative overflow-hidden`}>
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/20 rounded-[2rem] backdrop-blur-xl border border-white/30">
                <ActivityIcon size={32} />
              </div>
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Weekly Performance Monitoring</p>
                <input 
                  type="text" 
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="bg-transparent border-b-2 border-white/20 text-3xl font-black outline-none focus:border-white transition-all w-full md:w-[450px] py-1"
                />
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all">
              <X size={28} />
            </button>
          </div>
          
          <div className="mt-8 flex items-center gap-8">
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest block mb-1">{selectedMonth}월 누적 진척</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{monthProgress}%</span>
              </div>
            </div>
            <div className="flex-1">
               <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase mb-1.5 px-1">
                  <span>Monthly Accumulation Status</span>
                  <span>{completedPlans} / {totalPlans} 승인완료</span>
               </div>
               <div className="h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${monthProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Month & Week Selectors */}
        <div className="bg-white px-8 pt-6 border-b border-gray-100 space-y-4">
          {/* Month Selector */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <span className="text-xs font-black text-gray-400 mr-2 shrink-0">MONTH:</span>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`flex-shrink-0 min-w-[54px] py-2 rounded-xl text-xs font-black transition-all ${
                  selectedMonth === m 
                    ? `${theme.bg} text-white shadow-lg` 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {m}월
              </button>
            ))}
          </div>
          
          {/* Week Selector (Requested Feature) */}
          <div className="flex items-center gap-4 border-t border-gray-50 pt-4 pb-6">
            <span className="text-xs font-black text-gray-400 shrink-0">WEEKLY TAB:</span>
            <div className="flex bg-gray-50 p-1 rounded-2xl gap-1">
              {[1, 2, 3, 4, 5].map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeek(w)}
                  className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                    selectedWeek === w 
                      ? `bg-white ${theme.text} shadow-sm` 
                      : 'text-gray-400 hover:text-gray-500'
                  }`}
                >
                  {w}주차
                  {currentMonthRecord.plans.filter(p => p.week === w).length > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedWeek === w ? theme.bg : 'bg-gray-300'}`}></span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[11px] font-bold text-gray-400">주간 승인 현황:</span>
              <div className="px-3 py-1 bg-gray-100 rounded-lg text-[11px] font-black text-gray-600">
                {weeklyCompleted} / {weeklyTotal} 건
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-white/50">
          {/* Input Area */}
          <div className="relative">
            <div className="flex items-center gap-4 bg-white p-2 rounded-[1.5rem] shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className={`w-10 h-10 ${theme.bg} text-white rounded-full flex items-center justify-center ml-1`}>
                <Plus size={20} strokeWidth={3} />
              </div>
              <input 
                type="text" 
                placeholder={`${selectedMonth}월 ${selectedWeek}주차에 수행할 단위 업무 실적을 입력하세요...`}
                className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-gray-700 placeholder:text-gray-300"
                value={newPlanText}
                onChange={(e) => setNewPlanText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlan()}
              />
              <button 
                onClick={handleAddPlan}
                className={`px-6 py-2.5 ${theme.bg} text-white rounded-xl font-black text-xs shadow-lg hover:opacity-90 transition-all mr-1`}
              >
                업무 등록
              </button>
            </div>
          </div>

          {/* Weekly Plans List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
              <Calendar size={12} /> {selectedMonth}월 {selectedWeek}주차 업무 리스트
            </h4>
            
            {weeklyPlans.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5">
                {weeklyPlans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`group flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all ${
                      plan.isExecuted 
                        ? 'bg-emerald-50/30 border-emerald-100 shadow-sm' 
                        : 'bg-white border-gray-50 hover:border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        plan.isExecuted ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-100 text-gray-300'
                      }`}>
                        {plan.isExecuted ? <ShieldCheck size={20} /> : <Clock size={20} />}
                      </div>
                      <div className="flex-1">
                        <span className={`font-bold block transition-all ${plan.isExecuted ? 'text-emerald-700/60 line-through' : 'text-[#111111] text-md'}`}>
                          {plan.text}
                        </span>
                        {plan.isExecuted && (
                          <span className="text-[9px] font-bold text-emerald-500 uppercase mt-0.5 block">현장 실사 승인 완료</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleTogglePlan(plan.id)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${
                          plan.isExecuted 
                            ? 'bg-white text-emerald-600 border border-emerald-100' 
                            : `${theme.bg} text-white shadow-md hover:scale-105`
                        }`}
                      >
                        {plan.isExecuted ? (
                          <><CheckCircle2 size={12} /> 승인됨</>
                        ) : (
                          '실적 승인'
                        )}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center bg-white rounded-[2rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-300 text-sm font-bold">등록된 주간 계획이 없습니다.</p>
                <p className="text-[10px] text-gray-400 mt-1 uppercase">Select Week or add new performance</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-white">
          <button 
            onClick={onDelete}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-red-400 hover:bg-red-50 transition-all text-sm"
          >
            <Trash2 size={18} /> 활동 삭제
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-100 transition-all text-sm">닫기</button>
            <button onClick={handleSave} className={`flex items-center gap-3 px-12 py-4 ${theme.bg} text-white rounded-2xl font-black text-sm shadow-xl hover:opacity-90 active:scale-95 transition-all`}>
              <Save size={20} /> 변경사항 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
