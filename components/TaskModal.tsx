
import React, { useState } from 'react';
import { X, Check, Clock, User, Tag, Layout } from 'lucide-react';
import { TaskItem } from '../types';

interface TaskModalProps {
  onClose: () => void;
  onSave: (task: Omit<TaskItem, 'id'>) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<TaskItem, 'id'>>({
    subject: '',
    assignee: 'Alex Meian',
    category: 'Design',
    time: '오전 09:00',
    status: 'pending'
  });

  const categories = ['Design', 'Review', 'Dev', 'Admin'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#111111]">신규 업무 등록</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Layout size={14} /> 업무 제목
              </label>
              <input 
                autoFocus
                type="text"
                placeholder="어떤 업무를 계획하시나요?"
                className="w-full px-6 py-4 bg-[#F4F7FE] rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                value={formData.subject}
                onChange={e => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <User size={14} /> 담당자
                </label>
                <input 
                  type="text"
                  className="w-full px-6 py-4 bg-[#F4F7FE] rounded-2xl text-sm font-bold outline-none"
                  value={formData.assignee}
                  onChange={e => setFormData({...formData, assignee: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                  <Clock size={14} /> 예정 시간
                </label>
                <input 
                  type="text"
                  placeholder="예: 오전 10:00"
                  className="w-full px-6 py-4 bg-[#F4F7FE] rounded-2xl text-sm font-bold outline-none"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                <Tag size={14} /> 카테고리
              </label>
              <div className="flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      formData.category === cat 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button 
                type="submit"
                className="flex-1 bg-[#FF5B22] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Check size={20} strokeWidth={3} /> 업무 저장
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
