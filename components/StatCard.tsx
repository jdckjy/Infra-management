
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  max?: string;
  change: number;
  isPositive: boolean;
  bgColor: string;
  desc?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, max, change, isPositive, bgColor, desc }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex flex-col space-y-4">
      <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-tight">{label}</p>
        <div className="flex items-baseline gap-1">
          <h4 className="text-2xl font-black text-[#111111]">{value}</h4>
          {max && <span className="text-sm font-bold text-gray-400">{max}</span>}
        </div>
        <div className={`flex items-center text-[10px] font-bold mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          <span className="mr-1">{isPositive ? '↗' : '↘'}</span>
          {Math.abs(change)}% 
          <span className="text-gray-400 ml-1 font-medium italic">{desc || `지난달 대비 ${isPositive ? '상승' : '하락'}`}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
