import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';

export default function Create() {
  const navigate = useNavigate();
  const { conditions } = useTimetable();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/timetable/result'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#4F7CF3] mx-auto mb-6 animate-pulse">
          <CalendarDays className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#1F2937] mb-3">시간표 생성 중...</h1>
        <p className="text-[#6B7280] mb-8">CSP 엔진이 최적의 시간표를 계산하고 있습니다</p>
        <div className="flex flex-col gap-2 text-sm text-[#6B7280] max-w-xs mx-auto bg-[#FFFFFF] rounded-2xl border border-[#E8F0FF] p-5 text-left">
          {conditions.preferredFreeDays.length > 0 && (
            <p className="flex items-center gap-2"><span className="text-[#2EC4B6]">✓</span> 공강일 ({conditions.preferredFreeDays.join(', ')}) 반영 중</p>
          )}
          {conditions.avoidMorningClasses && <p className="flex items-center gap-2"><span className="text-[#2EC4B6]">✓</span> 1교시 회피 반영 중</p>}
          {conditions.avoidUphill && <p className="flex items-center gap-2"><span className="text-[#2EC4B6]">✓</span> 오르막길 최소화 반영 중</p>}
          {conditions.preferOnline && <p className="flex items-center gap-2"><span className="text-[#2EC4B6]">✓</span> 온라인 강의 선호 반영 중</p>}
          <p className="flex items-center gap-2"><span className="text-[#2EC4B6]">✓</span> {conditions.minCredits}~{conditions.maxCredits}학점 범위 계산 중</p>
        </div>
        <div className="mt-8 flex justify-center gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-2 w-2 rounded-full bg-[#4F7CF3] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
