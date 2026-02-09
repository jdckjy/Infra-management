
import React, { useState, useMemo } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { useUnifiedData } from '../contexts/UnifiedDataContext';
import { KPI, Activity, Task, WeeklyRecord } from '../types';
import TaskEditModal from './TaskEditModal';
import WeeklyReportModal from './WeeklyReportModal';
import { getWeekOfMonth } from '../utils/uiHelpers';

// TaskManager는 이제 모달의 "내용" 역할만 담당합니다.
// 닫기 동작을 부모(Modal)에게 전달하기 위해 onClose prop을 받습니다.
interface TaskManagerProps {
  kpiId: string;
  activityId: string;
  onClose: () => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ kpiId, activityId, onClose }) => {
  const { unifiedData, updateTaskRecords } = useUnifiedData();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { kpi, activity } = useMemo(() => {
    const kpi = unifiedData?.kpis.find((k: KPI) => k.id === kpiId);
    const activity = kpi?.activities.find((a: Activity) => a.id === activityId);
    return { kpi, activity };
  }, [unifiedData, kpiId, activityId]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (taskId: string, updatedRecords: WeeklyRecord[]) => {
    // updateTaskRecords의 시그니처가 kpiId, activityId를 받도록 수정되었다고 가정합니다.
    // (이전 단계에서 이 부분이 누락되었을 수 있으므로, 필요 시 UnifiedDataContext 수정 필요)
    updateTaskRecords(kpiId, activityId, taskId, updatedRecords);
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  if (!kpi || !activity) {
    return <div className="p-8">데이터를 로드하는 중...</div>;
  }

  return (
    // 모달 UI(배경, 위치 등)는 부모인 Modal.tsx가 모두 처리합니다.
    // 이 컴포넌트는 순수하게 내용만 렌더링합니다.
    <div className="flex flex-col h-full p-8">
      
      {/* 헤더 및 닫기 버튼 */}
      <div className="flex justify-between items-start mb-6">
          <div>
              <p className="text-orange-500 font-bold text-sm tracking-wider">WEEKLY PERFORMANCE MONITORING</p>
              <h1 className="text-3xl font-bold text-gray-800 mt-1">{activity.name}</h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200/80 transition-colors">
              <X size={24} className="text-gray-500" />
          </button>
      </div>

      {/* 월/주차 선택 */}
      <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1 p-1 bg-white rounded-lg border border-gray-200">
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                    <button key={m} className={`px-3 py-1 text-sm font-semibold rounded ${month === m ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-orange-50'}`}>
                        {m}월
                    </button>
                ))}
            </div>
            <div className="flex gap-2 p-1 bg-white rounded-lg border border-gray-200">
                 {Array.from({length: 5}, (_, i) => i + 1).map(w => (
                    <button key={w} className={`px-4 py-1 text-sm font-semibold rounded ${getWeekOfMonth(currentDate) === w ? 'bg-orange-100 text-orange-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                        {w}주차
                    </button>
                ))}
            </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-grow bg-white rounded-2xl p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
              <button className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-500">
                  <PlusCircle size={20} />
                  {`${month}월 ${getWeekOfMonth(currentDate)}주차에 수행할 단위 업무 실적을 입력하세요...`}
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600">업무 등록</button>
          </div>
          <div className="text-sm font-semibold text-gray-400 mb-2 border-b pb-2">{`${month}월 ${getWeekOfMonth(currentDate)}주차 업무 리스트`}</div>
          <div className="space-y-2 pt-2">
              <div className="text-center py-16 text-gray-400">
                  <p className="font-semibold">등록된 주간 계획이 없습니다.</p>
                  <p className="text-sm">SELECT WEEK OR ADD NEW PERFORMANCE</p>
              </div>
          </div>
      </div>

      {/* 푸터 버튼 */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
          <button className="text-sm font-semibold text-red-500 hover:text-red-700">활동 삭제</button>
          <div>
              <button onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 mr-2">닫기</button>
              <button className="px-6 py-3 text-sm font-bold text-white bg-orange-500 rounded-lg hover:bg-orange-600">변경사항 저장</button>
          </div>
      </div>

      {/* TaskEditModal 등은 TaskManager 내부에 종속된 모달이므로 그대로 둡니다. */}
      {isEditModalOpen && <TaskEditModal task={selectedTask} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveTask} />} 
      <WeeklyReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
};

export default TaskManager;
