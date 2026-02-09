
import React from 'react';
import { Circle, CheckCircle, Clock, PauseCircle } from 'lucide-react';
import { PerformanceStatus } from '../types';

/**
 * 주어진 날짜가 해당 월의 몇 주차인지 계산합니다.
 * @param date - 확인할 날짜 객체
 * @returns {number} 해당 월의 주차 (1부터 시작)
 */
export const getWeekOfMonth = (date: Date): number => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfMonth = date.getDate();
  // 월의 첫 날의 요일(0=일, 1=월, ...)을 더하여 첫 주의 시작을 보정합니다.
  // 예를 들어, 월의 1일이 수요일(3)이면, (1+3-1)/7 = 0.42... -> 1주차
  return Math.ceil((dayOfMonth + startOfMonth.getDay()) / 7);
};

/**
 * Task의 진행 상태에 따라 적절한 아이콘을 반환합니다.
 * @param status - Task의 진행 상태
 * @returns {JSX.Element} Lucide 아이콘 컴포넌트
 */
export const getStatusIcon = (status: PerformanceStatus): JSX.Element => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'in_progress':
      return <Clock className="w-5 h-5 text-blue-500" />;
    case 'on_hold':
      return <PauseCircle className="w-5 h-5 text-yellow-500" />;
    case 'pending':
    default:
      return <Circle className="w-5 h-5 text-gray-300" />;
  }
};

/**
 * Task의 진행 상태에 따라 한글 레이블을 반환합니다.
 * @param status - Task의 진행 상태
 * @returns {string} 상태에 대한 한글 레이블
 */
export const getStatusLabel = (status: PerformanceStatus): string => {
  switch (status) {
    case 'completed':
      return '완료';
    case 'in_progress':
      return '진행 중';
    case 'on_hold':
      return '보류';
    case 'pending':
    default:
      return '대기';
  }
};
