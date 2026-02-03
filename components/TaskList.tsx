
import React, { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { TaskItem, StateUpdater } from '../types';

interface TaskListProps {
  tasks: TaskItem[];
  onUpdate: StateUpdater<TaskItem[]>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('중요');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const tabs = [
    { name: '전체', count: tasks.length },
    { name: '중요', count: tasks.filter(t => t.status === 'urgent' || t.status === 'pending').length },
    { name: '노트', count: 5 },
    { name: '링크', count: 10 }
  ];

  const confirmDelete = (id: string) => {
    onUpdate((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-8 border-b border-gray-100 mb-6">
        {tabs.map(tab => (
          <button 
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === tab.name ? 'text-[#111111]' : 'text-gray-400'
            }`}
          >
            {tab.name} <span className="text-[10px] ml-1 opacity-50">{tab.count.toString().padStart(2, '0')}</span>
            {activeTab === tab.name && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>
      
      <div className="space-y-4 overflow-y-auto max-h-[300px] scrollbar-hide pr-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <button 
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  task.status === 'completed' ? 'bg-[#FF5B22] border-[#FF5B22] text-white' : 'border-gray-200'
                }`}
                onClick={() => {
                  onUpdate(prev => prev.map(t => t.id === task.id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
                }}
              >
                {task.status === 'completed' && <Check size={12} strokeWidth={4} />}
              </button>
              <p className={`text-sm font-bold ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                {task.subject}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${
                task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {task.status === 'completed' ? '승인됨' : '검토 중'}
              </span>
              
              {deleteConfirmId === task.id ? (
                <div className="flex gap-1 animate-in zoom-in-95">
                  <button onClick={() => confirmDelete(task.id)} className="p-1 bg-red-500 text-white rounded-md"><Check size={12}/></button>
                  <button onClick={() => setDeleteConfirmId(null)} className="p-1 bg-gray-200 text-gray-600 rounded-md"><X size={12}/></button>
                </div>
              ) : (
                <button 
                  onClick={() => setDeleteConfirmId(task.id)}
                  className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
