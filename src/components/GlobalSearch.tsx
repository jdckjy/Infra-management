
import React, { useState, useMemo, useEffect } from 'react';
import { useUnifiedData } from '../contexts/UnifiedDataContext';
import { Search } from 'lucide-react';
import { MenuKey } from '../types';

interface SearchResult {
  type: 'KPI' | 'Activity' | 'Task';
  id: string;
  name: string;
  path: string;
  kpiId: string;
  activityId?: string;
  menuKey: MenuKey; // 올바른 사이드바 메뉴를 활성화하기 위해 추가
}

const GlobalSearch: React.FC = () => {
  const { unifiedData, navigateTo } = useUnifiedData();
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!query || !unifiedData) return [];
    const lowerCaseQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    unifiedData.kpis.forEach(kpi => {
      // kpi.category를 MenuKey로 캐스팅합니다.
      // 실제로는 kpi.category 값이 MenuKey 타입에 속하는지 확인하는 로직이 더 안전합니다.
      const menuKey = kpi.category as MenuKey;

      if (kpi.name.toLowerCase().includes(lowerCaseQuery)) {
        results.push({
          type: 'KPI',
          id: kpi.id,
          name: kpi.name,
          path: kpi.name,
          kpiId: kpi.id,
          menuKey: menuKey,
        });
      }

      kpi.activities.forEach(activity => {
        if (activity.name.toLowerCase().includes(lowerCaseQuery)) {
          results.push({
            type: 'Activity',
            id: activity.id,
            name: activity.name,
            path: `${kpi.name} > ${activity.name}`,
            kpiId: kpi.id,
            activityId: activity.id,
            menuKey: menuKey,
          });
        }

        activity.tasks.forEach(task => {
          if (task.name.toLowerCase().includes(lowerCaseQuery)) {
            results.push({
              type: 'Task',
              id: task.id,
              name: task.name,
              path: `${kpi.name} > ${activity.name} > ${task.name}`,
              kpiId: kpi.id,
              activityId: activity.id,
              menuKey: menuKey,
            });
          }
        });
      });
    });

    return results;
  }, [query, unifiedData]);

  const handleItemClick = (result: SearchResult) => {
    navigateTo({
        menuKey: result.menuKey,
        kpiId: result.kpiId,
        activityId: result.activityId,
    });
    setIsActive(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for KPI, Task..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setTimeout(() => setIsActive(false), 150)}
          className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {isActive && query && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-10 overflow-hidden">
          {searchResults.length > 0 ? (
            <ul>
              {searchResults.map(result => (
                <li
                  key={result.id + result.type}
                  onClick={() => handleItemClick(result)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                >
                  <p className="font-bold text-sm text-gray-800">{result.name}</p>
                  <p className="text-xs text-gray-500 truncate">{result.path}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-sm text-gray-500">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
