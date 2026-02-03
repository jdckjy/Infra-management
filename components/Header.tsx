
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Database, RefreshCcw, Trash2, ShieldCheck, Activity, Cpu, Download, Upload } from 'lucide-react';
import { MenuKey } from '../types';

interface HeaderProps {
  activeMenu: MenuKey;
}

const Header: React.FC<HeaderProps> = ({ activeMenu }) => {
  const [showDbInfo, setShowDbInfo] = useState(false);
  const [refreshAnim, setRefreshAnim] = useState(false);

  const STORAGE_PREFIX = 'complex-mgt-v4-'; // 기존 백업 호환성을 위해 v4 접두사 유지 또는 v5로 마이그레이션

  const getTitle = () => {
    if (activeMenu.startsWith('custom-')) {
      const savedTabs = JSON.parse(localStorage.getItem('complex-mgt-v4-custom-tabs') || '[]');
      const tab = savedTabs.find((t: any) => t.key === activeMenu);
      return tab ? `${tab.label} 관리` : '업무 관리';
    }

    switch (activeMenu) {
      case 'dashboard': return '대시보드';
      case 'safety': return '안전관리 시스템';
      case 'lease': return '임대유치 관리';
      case 'asset': return '자산운용 현황';
      case 'infra': return '인프라 조성 공정';
      default: return '메인';
    }
  };

  const getStorageStats = () => {
    const keys = Object.keys(localStorage).filter(k => k.includes('complex-mgt-v4-'));
    let totalSize = 0;
    const details = keys.map(k => {
      const val = localStorage.getItem(k) || '';
      totalSize += val.length;
      let count = 0;
      try {
        const parsed = JSON.parse(val);
        count = Array.isArray(parsed) ? parsed.length : (typeof parsed === 'object' ? Object.keys(parsed).length : 1);
      } catch(e) {}
      
      return { 
        key: k.replace('complex-mgt-v4-', ''), 
        size: (val.length / 1024).toFixed(2) + ' KB',
        raw: val.length,
        count
      };
    });
    
    return {
      count: keys.length,
      size: (totalSize / 1024).toFixed(2) + ' KB',
      lastSync: new Date().toLocaleTimeString(),
      details
    };
  };

  const stats = getStorageStats();

  const handleExport = () => {
    const data: Record<string, string> = {};
    Object.keys(localStorage).forEach(key => {
      if (key.includes('complex-mgt-v4-')) {
        data[key] = localStorage.getItem(key) || '';
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `danji-pro-v5-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm("백업 파일의 데이터를 로드합니다. 현재 데이터가 덮어씌워집니다. 진행하시겠습니까?")) {
          // 모든 관련 데이터 삭제 후 주입
          Object.keys(localStorage).forEach(key => {
            if (key.includes('complex-mgt-v4-')) localStorage.removeItem(key);
          });

          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, value as string);
          });
          
          // 동기적 반영을 위해 페이지 전체 리로드
          window.location.reload();
        }
      } catch (err) {
        alert("올바른 백업 형식이 아닙니다.");
      }
    };
    reader.readAsText(file);
  };

  const handleSystemReset = () => {
    if (confirm("주의: 모든 데이터가 초기화됩니다. 이 작업은 되돌릴 수 없습니다.")) {
      Object.keys(localStorage).forEach(key => {
        if (key.includes('complex-mgt-v4-')) {
          localStorage.removeItem(key);
        }
      });
      window.location.reload();
    }
  };

  return (
    <header className="flex items-center justify-between py-2 relative">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-extrabold text-[#111111]">단지조성팀 업무관리 시스템</h1>
        <div 
          onClick={() => setShowDbInfo(!showDbInfo)}
          className="hidden lg:flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 cursor-pointer transition-all hover:bg-emerald-100 group"
        >
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase tracking-wider">
            <Activity size={10} /> DB Persistent Mode Active
          </span>
          
          {showDbInfo && (
            <div 
              className="absolute top-12 left-0 z-[200] w-96 bg-[#111111] p-6 rounded-[2rem] shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 text-white"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Database size={18} className="text-emerald-400" />
                  <span className="font-black text-sm tracking-tight uppercase">Database Console v5.0</span>
                </div>
                <button onClick={() => setRefreshAnim(true)} className={`text-gray-500 hover:text-white transition-all ${refreshAnim ? 'rotate-180' : ''}`}>
                  <RefreshCcw size={14} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-gray-500 font-bold uppercase mb-1">Stored Tables</p>
                  <p className="text-lg font-black text-emerald-400">{stats.count} EA</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Last Update</p>
                  <p className="text-lg font-black text-blue-400">{stats.lastSync}</p>
                </div>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-hide mb-6 p-1 bg-white/5 rounded-2xl">
                {stats.details.map(d => (
                  <div key={d.key} className="flex items-center justify-between py-2 px-3 hover:bg-white/5 rounded-xl transition-colors">
                    <span className="text-[11px] text-gray-300 font-bold">{d.key}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">{d.count} records</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button onClick={handleExport} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-2 transition-all">
                    <Download size={14} /> 백업 내보내기
                  </button>
                  <label className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-2 transition-all cursor-pointer text-center">
                    <Upload size={14} className="inline mr-1" /> 백업 불러오기
                    <input type="file" className="hidden" accept=".json" onChange={handleImport} />
                  </label>
                </div>
                <button 
                  onClick={handleSystemReset}
                  className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[11px] font-black flex items-center justify-center gap-2 transition-all border border-red-500/20"
                >
                  <Trash2 size={14} /> 전체 초기화 및 데이터 삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="업무 및 지표 통합 검색..." 
            className="pl-14 pr-6 py-3 bg-white border-none rounded-full text-sm w-64 md:w-96 outline-none shadow-sm focus:ring-2 focus:ring-orange-100 transition-all font-medium"
          />
        </div>
        
        <button className="p-3 bg-white text-gray-800 rounded-full shadow-sm hover:shadow-md transition-all relative group">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#FF5B22] rounded-full border-2 border-white group-hover:scale-125 transition-transform"></span>
        </button>
        
        <div className="flex items-center gap-3 bg-white pl-1.5 pr-4 py-1.5 rounded-full shadow-sm border border-white hover:border-orange-50 transition-all cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=48&h=48&q=80" 
            alt="profile" 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-50"
          />
          <div className="hidden md:block leading-none text-left">
            <p className="text-sm font-bold text-[#111111]">Alex Meian</p>
            <p className="text-[10px] text-gray-400 font-medium">단지조성팀 관리자</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </header>
  );
};

export default Header;
