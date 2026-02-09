
import React, { useMemo } from 'react';
import { X, Clipboard } from 'lucide-react';
import { useUnifiedData } from '../contexts/UnifiedDataContext';
import { getWeek, startOfWeek, endOfWeek, format } from 'date-fns';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({ isOpen, onClose }) => {
  const { unifiedData, viewDate } = useUnifiedData();

  // viewDate를 기준으로 보고서 내용 생성
  const reportContent = useMemo(() => {
    if (!unifiedData) return '데이터를 불러오는 중입니다...';

    const weekNumber = getWeek(viewDate, { weekStartsOn: 1 });
    const weekStart = format(startOfWeek(viewDate, { weekStartsOn: 1 }), 'yyyy.MM.dd');
    const weekEnd = format(endOfWeek(viewDate, { weekStartsOn: 1 }), 'yyyy.MM.dd');

    const recordsThisWeek = unifiedData.kpis.flatMap(kpi => 
      kpi.activities.flatMap(activity => 
        activity.tasks.flatMap(task => 
          task.records
            .filter(record => record.year === viewDate.getFullYear() && record.week === weekNumber)
            .map(record => ({ ...record, kpiName: kpi.name, activityName: activity.name, taskName: task.name }))
        )
      )
    );

    const completed = recordsThisWeek.filter(r => r.status === 'completed');
    const inProgress = recordsThisWeek.filter(r => r.status === 'in_progress');
    const pending = recordsThisWeek.filter(r => r.status === 'pending' || r.status === 'on_hold');

    let content = `## 주간 업무 보고서 (${year}년 ${weekNumber}주차)\n`;
    content += `**기간:** ${weekStart} ~ ${weekEnd}\n\n`;

    content += '### 1. 금주 완료 업무\n';
    if (completed.length > 0) {
        completed.forEach(r => {
            content += `- [${r.kpiName}] ${r.taskName}\n`;
        });
    } else {
        content += '- 해당 없음\n';
    }
    content += '\n';

    content += '### 2. 진행 중 업무\n';
    if (inProgress.length > 0) {
        inProgress.forEach(r => {
            content += `- [${r.kpiName}] ${r.taskName}\n`;
        });
    } else {
        content += '- 해당 없음\n';
    }
    content += '\n';

    content += '### 3. 차주 예정 업무 (또는 보류)\n';
    if (pending.length > 0) {
        pending.forEach(r => {
            content += `- [${r.kpiName}] ${r.taskName}\n`;
        });
    } else {
        content += '- 해당 없음\n';
    }
    content += '\n';

    content += '### 4. 특이사항\n';
    content += '- \n';

    return content;

  }, [unifiedData, viewDate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportContent);
    // TODO: 사용자에게 복사되었음을 알리는 피드백 추가 (예: 토스트 메시지)
    alert('보고서 내용이 클립보드에 복사되었습니다.');
  };

  if (!isOpen) return null;

  const year = viewDate.getFullYear();
  const weekNumber = getWeek(viewDate, { weekStartsOn: 1 });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">주간 업무 보고서 ({year}년 {weekNumber}주차)</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </header>
        <main className="p-6 flex-1 overflow-y-auto">
          <textarea
            readOnly
            value={reportContent}
            className="w-full h-full p-4 bg-gray-50 border rounded-lg resize-none text-sm font-mono"
            rows={20}
          />
        </main>
        <footer className="p-6 border-t flex justify-end">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Clipboard size={18} />
            내용 복사
          </button>
        </footer>
      </div>
    </div>
  );
};

export default WeeklyReportModal;
