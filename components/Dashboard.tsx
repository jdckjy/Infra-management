
import React from 'react';
import StatCard from './StatCard';
import TaskList from './TaskList';
import { ShieldCheck, Building2, Landmark, HardHat, ChevronDown, PlusCircle } from 'lucide-react';
import { TaskItem, StateUpdater, SummaryStats } from '../types';

interface DashboardProps {
  tasks: TaskItem[];
  onTasksUpdate: StateUpdater<TaskItem[]>;
  summaryStats: SummaryStats;
  onAddTaskOpen?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, onTasksUpdate, summaryStats, onAddTaskOpen }) => {
  return (
    <div className="grid grid-cols-12 gap-6 pb-8">
      {/* Top 4 Stat Cards */}
      <div className="col-span-12 flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">주요 현황 요약</h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm group">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Data Guard: 4+ Records Protected</span>
          </div>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all">
            전체 사업장 <ChevronDown size={16} />
          </button>
        </div>
      </div>
      
      <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          icon={<ShieldCheck size={20} className="text-orange-500" />}
          label="안전 관리 지표" 
          value={summaryStats.safety.days} 
          max=""
          change={summaryStats.safety.change} 
          isPositive={true}
          bgColor="bg-orange-50"
          desc="안전 무사고 누적일"
        />
        <StatCard 
          icon={<Building2 size={20} className="text-blue-500" />}
          label="임대 유치 지표" 
          value={summaryStats.lease.rate} 
          max="%"
          change={summaryStats.lease.change} 
          isPositive={true}
          bgColor="bg-blue-50"
          desc="전체 부지 임대율"
        />
        <StatCard 
          icon={<Landmark size={20} className="text-emerald-500" />}
          label="자산 운용 지표" 
          value={summaryStats.asset.value} 
          max="조원"
          change={summaryStats.asset.change} 
          isPositive={true}
          bgColor="bg-emerald-50"
          desc="운용 자산 총액"
        />
        <StatCard 
          icon={<HardHat size={20} className="text-purple-500" />}
          label="인프라 조성 지표" 
          value={summaryStats.infra.progress} 
          max="%"
          change={summaryStats.infra.change} 
          isPositive={true}
          bgColor="bg-purple-50"
          desc="평균 공정 진척률"
        />
      </div>

      {/* Middle Section: Project Status Summary (Expanded Layout) */}
      <div className="col-span-12 bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col border border-gray-50 min-h-[500px]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-xl text-[#1B2559]">전체 사업 진행 현황 상세</h3>
          <div className="flex gap-4">
            {['프로젝트 별', '담당 매니저 별', '진척도 순'].map((filter) => (
              <button key={filter} className="flex items-center gap-2 bg-[#F4F7FA] px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                {filter} <ChevronDown size={14} />
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 font-bold border-b border-gray-50">
                <th className="pb-4">사업명 (프로젝트)</th>
                <th className="pb-4">담당 매니저</th>
                <th className="pb-4">목표 완료일</th>
                <th className="pb-4">상태</th>
                <th className="pb-4 text-center">진척률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: '넬사 웹 개발 단지 조성', manager: '엄프라카시 사오', date: '2023년 5월 25일', status: '완료', progress: 100 },
                { name: '데이터스케일 AI 앱 인프라', manager: '닐슨 만도', date: '2023년 6월 20일', status: '지연', progress: 35 },
                { name: '미디어 채널 브랜딩 공사', manager: '티루벨리 프리야', date: '2023년 7월 13일', status: '위험', progress: 68 },
                { name: '콜랙스 iOS 앱 연동 공정', manager: '매트 해너리', date: '2023년 12월 20일', status: '완료', progress: 100 },
                { name: '웹사이트 빌더 기반 시설', manager: '수쿠마 라오', date: '2024년 3월 15일', status: '진행중', progress: 50 },
                { name: '스마트 물류 거점 조성', manager: '홍길동 부장', date: '2024년 11월 30일', status: '진행중', progress: 12 },
              ].map((proj, i) => (
                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 font-bold text-[#111111]">{proj.name}</td>
                  <td className="py-5 text-gray-500 font-medium">{proj.manager}</td>
                  <td className="py-5 text-gray-500 font-medium">{proj.date}</td>
                  <td className="py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      proj.status === '완료' ? 'bg-green-100 text-green-600' :
                      proj.status === '지연' ? 'bg-orange-100 text-orange-600' :
                      proj.status === '위험' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-5 text-center">
                    <div className="flex items-center gap-3 justify-center">
                       <div className="w-48 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full ${proj.progress === 100 ? 'bg-green-500' : 'bg-orange-500'} transition-all duration-1000`} style={{ width: `${proj.progress}%` }}></div>
                       </div>
                       <span className="text-[11px] font-bold text-gray-600 min-w-[30px]">{proj.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Today's Tasks (Full Width) */}
      <div className="col-span-12 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 min-h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-xl text-[#1B2559]">오늘의 주요 업무 리스트</h3>
            <span className="text-xs font-bold text-gray-300">|</span>
            <div className="flex gap-2">
               <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase">Ongoing {tasks.filter(t => t.status !== 'completed').length}</span>
               <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black rounded-md uppercase">Done {tasks.filter(t => t.status === 'completed').length}</span>
            </div>
          </div>
          <button 
            onClick={onAddTaskOpen}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#F4F7FE] text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <PlusCircle size={16} /> 신규 업무 추가
          </button>
        </div>
        <div className="max-w-none">
          <TaskList tasks={tasks} onUpdate={onTasksUpdate} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
