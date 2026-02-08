
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ChartSectionProps {
  type: 'bar' | 'pie' | 'gauge' | 'workload';
}

const ChartSection: React.FC<ChartSectionProps> = ({ type }) => {
  if (type === 'gauge') {
    const data = [
      { name: 'Completed', value: 72, color: '#4E944F' },
      { name: 'Remaining', value: 28, color: '#F3F4F6' },
    ];
    
    return (
      <div className="w-full h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="95%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#4E944F" />
              <Cell fill="#F3F4F6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Gauge Ticks (Simulated) */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
          <div className="w-full h-full border-b-[4px] border-dashed border-gray-100 opacity-50 mb-1"></div>
        </div>
      </div>
    );
  }

  if (type === 'workload') {
    const data = [
      { name: 'Sam', val: 7, count: 2 },
      { name: 'Meldy', val: 8, count: 5 },
      { name: 'Ken', val: 2, count: 3 },
      { name: 'Dmitry', val: 10, count: 6 },
      { name: 'Vego', val: 8, count: 4 },
      { name: 'Kadin', val: 2, count: 2 },
      { name: 'Melm', val: 4, count: 3 },
    ];

    return (
      <div className="w-full flex-1 flex items-end justify-between px-2 pt-4">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="flex flex-col-reverse gap-1 mb-2">
              {Array.from({ length: item.count }).map((_, j) => (
                <div 
                  key={j} 
                  className={`w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-white ${
                    j === item.count - 1 ? 'bg-[#FF5B22] scale-110' : 'bg-gray-100 text-gray-400 border-gray-100'
                  }`}
                >
                  {j === item.count - 1 ? item.val.toString().padStart(2, '0') : ''}
                </div>
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-400">{item.name}</p>
          </div>
        ))}
      </div>
    );
  }

  return <div className="p-4 text-center text-gray-300">Chart rendering...</div>;
};

export default ChartSection;
