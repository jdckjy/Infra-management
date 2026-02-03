
import React, { useState } from 'react';
import { X, Check, Layout, Palette } from 'lucide-react';
import { CustomTab } from '../types';

interface TabModalProps {
  onClose: () => void;
  onSave: (tab: CustomTab) => void;
}

const TabModal: React.FC<TabModalProps> = ({ onClose, onSave }) => {
  const [label, setLabel] = useState('');
  const [color, setColor] = useState<CustomTab['color']>('orange');

  const colorOptions: { val: CustomTab['color'], class: string }[] = [
    { val: 'orange', class: 'bg-orange-500' },
    { val: 'blue', class: 'bg-blue-600' },
    { val: 'emerald', class: 'bg-emerald-600' },
    { val: 'purple', class: 'bg-purple-600' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    
    const newTab: CustomTab = {
      key: `custom-${Date.now()}`,
      label: label.trim(),
      color: color
    };
    
    onSave(newTab);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-[#111111]">새로운 메뉴 탭 추가</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 px-1">
                <Layout size={14} /> 탭 이름 (카테고리명)
              </label>
              <input 
                autoFocus
                type="text"
                placeholder="예: 기획관리, 자재수급 등"
                className="w-full px-6 py-4 bg-[#F4F7FE] rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#FF5B22] transition-all"
                value={label}
                onChange={e => setLabel(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2 px-1">
                <Palette size={14} /> 테마 색상 선택
              </label>
              <div className="flex gap-4 px-1">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setColor(opt.val)}
                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${opt.class} ${
                      color === opt.val ? 'ring-4 ring-offset-2 ring-gray-200 scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {color === opt.val && <Check size={20} className="text-white" strokeWidth={4} />}
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
                탭 생성하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TabModal;
