import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Download, Share2 } from 'lucide-react';
import { useTimetable } from '../../context/TimetableContext';
import { GachonLogo } from '../../components/ui/GachonLogo';

const COURSE_COLORS = ['#4F7CF3', '#2EC4B6', '#A78BFA', '#F4D58D', '#BFD4FF'];
const MOCK_TIMETABLE = [
  { id: 1, name: '자료구조', professor: '김교수', day: '월', time: '10:00-12:00', room: '공학관 301', credits: 3 },
  { id: 2, name: '알고리즘', professor: '이교수', day: '화', time: '13:00-15:00', room: 'AI공학관 201', credits: 3 },
  { id: 3, name: '운영체제', professor: '박교수', day: '목', time: '10:00-12:00', room: '공학관 402', credits: 3 },
  { id: 4, name: '영어회화', professor: 'Smith', day: '수', time: '14:00-15:00', room: '글로벌센터 201', credits: 2 },
  { id: 5, name: '프로젝트', professor: '최교수', day: '금', time: '13:00-16:00', room: '공학관 501', credits: 3 },
];

export default function Result() {
  const { conditions } = useTimetable();
  const totalCredits = MOCK_TIMETABLE.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 border-b border-[#E8F0FF] bg-[#FFFFFF]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2"><GachonLogo size={32} /><span className="text-xl font-bold text-[#1F2937]">Sometime</span></Link>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-[#E8F0FF] bg-[#FFFFFF] px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F5F7FB] transition-colors"><Download className="h-4 w-4" />저장</button>
            <button className="flex items-center gap-2 rounded-xl border border-[#E8F0FF] bg-[#FFFFFF] px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F5F7FB] transition-colors"><Share2 className="h-4 w-4" />공유</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2EC4B6]/10"><CheckCircle2 className="h-5 w-5 text-[#2EC4B6]" /></div>
          <div><h1 className="text-2xl font-bold text-[#1F2937]">시간표 생성 완료!</h1><p className="text-sm text-[#6B7280]">총 {totalCredits}학점 · {MOCK_TIMETABLE.length}과목</p></div>
        </div>
        <div className="mb-5 rounded-2xl bg-[#E8F0FF] border border-[#BFD4FF] p-5">
          <p className="text-sm font-semibold text-[#4F7CF3] mb-1">✨ AI 맞춤 코멘트</p>
          <p className="text-sm text-[#1F2937] leading-relaxed">
            {conditions.preferredFreeDays.length > 0 ? `${conditions.preferredFreeDays.join(', ')}요일 공강이 반영된 시간표입니다. ` : ''}
            {conditions.avoidMorningClasses ? '1교시 수업 없이 ' : ''}
            {conditions.avoidUphill ? '오르막길 이동을 최소화하여 ' : ''}
            최적의 {totalCredits}학점 시간표를 구성했습니다. 편안한 한 학기 되세요! 🎉
          </p>
        </div>
        <div className="flex flex-col gap-3 mb-8">
          {MOCK_TIMETABLE.map((course, i) => (
            <div key={course.id} className="rounded-2xl bg-[#FFFFFF] border border-[#E8F0FF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-1.5 rounded-full" style={{ backgroundColor: COURSE_COLORS[i % COURSE_COLORS.length] }} />
                  <div><p className="font-semibold text-[#1F2937]">{course.name}</p><p className="text-sm text-[#6B7280]">{course.professor} · {course.room}</p></div>
                </div>
                <div className="text-right"><p className="text-sm font-medium text-[#1F2937]">{course.day}요일 {course.time}</p><p className="text-xs text-[#6B7280]">{course.credits}학점</p></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
          <Link to="/timetable/setup"><button className="rounded-xl border border-[#E8F0FF] bg-[#FFFFFF] px-5 py-3 text-sm text-[#6B7280] hover:bg-[#F5F7FB] transition-colors">조건 다시 설정</button></Link>
          <button className="flex items-center gap-2 rounded-full bg-[#4F7CF3] px-8 py-3 text-sm font-semibold text-white hover:bg-[#3a6ce0] transition-all shadow-lg">이 시간표로 확정 <ArrowRight className="h-4 w-4" /></button>
        </div>
      </main>
    </div>
  );
}
