
import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Building2, 
  Landmark,
  HardHat,
  Settings, 
  LogOut,
  Plus,
  Layers
} from 'lucide-react';
import { MenuKey, CustomTab } from '../types';

interface SidebarProps {
  activeMenu: MenuKey;
  onMenuChange: (menu: MenuKey) => void;
  customTabs: CustomTab[];
  onAddTabOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange, customTabs, onAddTabOpen }) => {
  const baseMenuItems = [
    { key: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
    { key: 'safety', label: '안전관리', icon: <ShieldCheck size={20} /> },
    { key: 'lease', label: '임대유치', icon: <Building2 size={20} /> },
    { key: 'asset', label: '자산운용', icon: <Landmark size={20} /> },
    { key: 'infra', label: '인프라조성', icon: <HardHat size={20} /> },
  ];

  return (
    <div className="w-20 md:w-64 h-full bg-[#111111] flex flex-col py-8 px-4 transition-all duration-300 z-50">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
          <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        <span className="hidden md:block font-bold text-xl text-white tracking-tight">DanjiPro</span>
      </div>

      <div className="mb-8 px-2">
        <button 
          onClick={onAddTabOpen}
          className="w-full flex items-center justify-center md:justify-start gap-3 bg-white text-black py-3 px-4 rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 transition-all active:scale-95 group"
        >
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white group-hover:rotate-90 transition-transform">
            <Plus size={16} strokeWidth={3} />
          </div>
          <span className="hidden md:block">새 탭 추가</span>
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
        <p className="hidden md:block text-[10px] text-gray-600 font-bold px-4 mb-2 uppercase tracking-widest">Main Menu</p>
        {baseMenuItems.map((item) => {
          const isActive = activeMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onMenuChange(item.key)}
              className={`w-full flex items-center p-3.5 rounded-2xl transition-all group ${
                isActive 
                  ? 'bg-white text-black font-bold shadow-md' 
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-blue-600' : 'group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="hidden md:block ml-4 text-sm">{item.label}</span>
            </button>
          );
        })}

        {customTabs.length > 0 && (
          <div className="pt-6">
            <p className="hidden md:block text-[10px] text-gray-600 font-bold px-4 mb-2 uppercase tracking-widest">Custom Tabs</p>
            {customTabs.map((tab) => {
              const isActive = activeMenu === tab.key;
              const colorClass = 
                tab.color === 'orange' ? 'text-orange-500' :
                tab.color === 'blue' ? 'text-blue-500' :
                tab.color === 'emerald' ? 'text-emerald-500' : 'text-purple-500';

              return (
                <button
                  key={tab.key}
                  onClick={() => onMenuChange(tab.key)}
                  className={`w-full flex items-center p-3.5 rounded-2xl transition-all group ${
                    isActive 
                      ? 'bg-white text-black font-bold shadow-md' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  <span className={`${isActive ? colorClass : 'group-hover:text-white'}`}>
                    <Layers size={20} />
                  </span>
                  <span className="hidden md:block ml-4 text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <div className="mt-auto space-y-1 pt-8 border-t border-white/5">
        <button className="w-full flex items-center p-3.5 text-gray-500 hover:text-white transition-colors">
          <Settings size={20} />
          <span className="hidden md:block ml-4 text-sm">시스템 설정</span>
        </button>
        <button className="w-full flex items-center p-3.5 text-gray-500 hover:text-red-400 transition-colors">
          <LogOut size={20} />
          <span className="hidden md:block ml-4 text-sm">로그아웃</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
