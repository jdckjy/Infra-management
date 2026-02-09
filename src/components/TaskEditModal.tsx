
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, WeeklyRecord, PerformanceStatus } from '../types';

interface TaskEditModalProps {
  task: Task | null;
  onClose: () => void;
  onSave: (taskId: string, updatedRecords: WeeklyRecord[]) => void;
}

const statusOptions: { value: PerformanceStatus; label: string }[] = [
  { value: 'pending', label: '대기' },
  { value: 'in_progress', label: '진행중' },
  { value: 'on_hold', label: '보류' },
  { value: 'completed', label: '완료' },
];

const TaskEditModal: React.FC<TaskEditModalProps> = ({ task, onClose, onSave }) => {
  const [records, setRecords] = useState<WeeklyRecord[]>([]);

  useEffect(() => {
    // 모달이 열리거나 대상 task가 변경될 때, 내부 상태를 부모로부터 받은 task의 record로 초기화합니다.
    if (task) {
      setRecords(JSON.parse(JSON.stringify(task.records))); // 깊은 복사
    }
  }, [task]);

  if (!task) return null;

  const handleStatusChange = (weekIndex: number, newStatus: PerformanceStatus) => {
    const updatedRecords = [...records];
    updatedRecords[weekIndex].status = newStatus;
    setRecords(updatedRecords);
  };

  const handleSave = () => {
    onSave(task.id, records);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">주간 실적 수정</p>
            <h2 className="text-2xl font-bold text-gray-800">{task.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {records.map((record, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-700">
                {record.year}년 {record.month}월 {record.week}주차
              </p>
              <select
                value={record.status}
                onChange={(e) => handleStatusChange(index, e.target.value as PerformanceStatus)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}> {option.label} </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            취소
          </button>
          <button 
            onClick={handleSave} 
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
