
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface TaskStatusPieChartProps {
  data: ChartDataItem[];
}

const TaskStatusPieChart: React.FC<TaskStatusPieChartProps> = ({ data }) => {
  const isDataEmpty = !data || data.every(item => item.value === 0);

  const COLORS = ['#4ade80', '#60a5fa', '#facc15', '#e5e7eb'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4">월간 Task 진행 상태</h3>
      <div className="flex-grow">
        {isDataEmpty ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}개`} />
              <Legend iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TaskStatusPieChart;
