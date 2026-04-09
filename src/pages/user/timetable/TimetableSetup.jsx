import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, CalendarDays, Clock, Mountain, Laptop } from 'lucide-react';
import { Switch } from '../../../components/ui/Switch';
import { Slider } from '../../../components/ui/Slider';
import { useTimetable } from '../../../context/TimetableContext';
import { GachonLogo } from '../../../components/ui/GachonLogo';

const DAYS = ['월', '화', '수', '목', '금'];
const DAY_LABELS = { 월: '월요일', 화: '화요일', 수: '수요일', 목: '목요일', 금: '금요일' };
const DEFAULT_CONDITIONS = { preferredFreeDays: [], avoidMorningClasses: false, avoidUphill: false, preferOnline: false, minCredits: 15, maxCredits: 21, additionalNotes: '' };

export default function TimetableSetup() {
  const navigate = useNavigate();
  const { setConditions, setIsGenerating } = useTimetable();
  const [localConditions, setLocalConditions] = useState(DEFAULT_CONDITIONS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDay = (day) => {
    setLocalConditions(prev => ({
      ...prev,
      preferredFreeDays: prev.preferredFreeDays.includes(day)
        ? prev.preferredFreeDays.filter(d => d !== day)
        : [...prev.preferredFreeDays, day],
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setConditions(localConditions);
    setIsGenerating(true);
    setTimeout(() => navigate('/timetable/result'), 300);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-50 border-b border-[#E8F0FF] bg-[#FFFFFF]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <GachonLogo size={32} />
            <span className="text-xl font-bold text-[#1F2937]">Sometime</span>
          </Link>
          <Link to="/"><button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#6B7280] hover:bg-[#F5F7FB] transition-colors"><ArrowLeft className="h-4 w-4" />홈으로</button></Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-[#6B7280]"><Sparkles className="h-4 w-4 text-[#4F7CF3]" /><span>STEP 1</span></div>
          <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-[#1F2937]">시간표 조건 설정</h1>
          <p className="text-[#6B7280]">원하는 조건을 선택하면 AI가 최적의 시간표를 추천해 드립니다</p>
        </motion.div>
        <div className="flex flex-col gap-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} className="rounded-2xl bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E8F0FF] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FF]"><CalendarDays className="h-5 w-5 text-[#4F7CF3]" /></div>
              <div><h2 className="text-base font-semibold text-[#1F2937]">공강일 설정</h2><p className="text-sm text-[#6B7280]">수업 없이 쉬고 싶은 요일을 선택하세요</p></div>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {DAYS.map(day => {
                const selected = localConditions.preferredFreeDays.includes(day);
                return (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 sm:py-4 transition-all ${selected ? 'border-[#4F7CF3] bg-[#E8F0FF] text-[#4F7CF3]' : 'border-[#F5F7FB] bg-[#F5F7FB] text-[#6B7280] hover:border-[#BFD4FF]'}`}>
                    <span className="hidden sm:block text-xs font-medium">{DAY_LABELS[day]}</span>
                    <span className="text-sm font-bold">{day}</span>
                    {selected && <span className="text-[10px] font-semibold text-[#4F7CF3]">공강</span>}
                  </button>
                );
              })}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="rounded-2xl bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E8F0FF] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FF]"><Sparkles className="h-5 w-5 text-[#4F7CF3]" /></div>
              <div><h2 className="text-base font-semibold text-[#1F2937]">수업 환경 설정</h2><p className="text-sm text-[#6B7280]">선호하는 수업 환경을 설정해 주세요</p></div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { key: 'avoidMorningClasses', icon: <Clock className="h-5 w-5 text-[#d4a017]" />, bg: '#F4D58D30', label: '1교시 수업 회피', desc: '오전 9시 수업을 제외하고 시간표를 구성합니다' },
                { key: 'avoidUphill', icon: <Mountain className="h-5 w-5 text-[#2EC4B6]" />, bg: '#2EC4B610', label: '오르막길 이동 최소화', desc: '가천관, AI공학관 등 언덕 위 건물로의 이동을 줄입니다' },
                { key: 'preferOnline', icon: <Laptop className="h-5 w-5 text-[#A78BFA]" />, bg: '#A78BFA10', label: '온라인 강의 선호', desc: '가능한 경우 온라인 강의를 우선 배치합니다' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between rounded-xl border border-[#F5F7FB] bg-[#F5F7FB] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: item.bg }}>{item.icon}</div>
                    <div><p className="text-sm font-medium text-[#1F2937]">{item.label}</p><p className="text-xs text-[#6B7280]">{item.desc}</p></div>
                  </div>
                  <Switch checked={localConditions[item.key]} onCheckedChange={checked => setLocalConditions(prev => ({ ...prev, [item.key]: checked }))} />
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="rounded-2xl bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E8F0FF] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FF]"><CalendarDays className="h-5 w-5 text-[#4F7CF3]" /></div>
              <div><h2 className="text-base font-semibold text-[#1F2937]">학점 범위 설정</h2><p className="text-sm text-[#6B7280]">수강할 학점 범위를 설정해 주세요</p></div>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1F2937]">최소 학점</span>
                  <span className="rounded-lg bg-[#E8F0FF] px-3 py-1 text-sm font-bold text-[#4F7CF3]">{localConditions.minCredits}학점</span>
                </div>
                <Slider value={[localConditions.minCredits]} onValueChange={([v]) => setLocalConditions(prev => ({ ...prev, minCredits: v, maxCredits: Math.max(v, prev.maxCredits) }))} min={12} max={21} step={1} className="w-full" />
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1F2937]">최대 학점</span>
                  <span className="rounded-lg bg-[#E8F0FF] px-3 py-1 text-sm font-bold text-[#4F7CF3]">{localConditions.maxCredits}학점</span>
                </div>
                <Slider value={[localConditions.maxCredits]} onValueChange={([v]) => setLocalConditions(prev => ({ ...prev, maxCredits: v, minCredits: Math.min(v, prev.minCredits) }))} min={12} max={24} step={1} className="w-full" />
              </div>
              <p className="text-sm text-[#6B7280]">{localConditions.minCredits}학점 ~ {localConditions.maxCredits}학점 범위에서 시간표를 구성합니다</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-2xl bg-[#FFFFFF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E8F0FF] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0FF]"><Sparkles className="h-5 w-5 text-[#4F7CF3]" /></div>
              <div><h2 className="text-base font-semibold text-[#1F2937]">추가 요청사항</h2><p className="text-sm text-[#6B7280]">시간표 생성에 반영할 추가 요청사항이 있다면 작성해 주세요</p></div>
            </div>
            <textarea placeholder="예: 점심시간(12:00-13:00)은 비워두었으면 좋겠습니다." value={localConditions.additionalNotes}
              onChange={e => setLocalConditions(prev => ({ ...prev, additionalNotes: e.target.value }))} rows={4}
              className="w-full resize-none rounded-xl border border-[#E8F0FF] bg-[#F5F7FB] p-4 text-sm text-[#1F2937] placeholder-[#6B7280] focus:border-[#4F7CF3] focus:bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#4F7CF3]/20 transition-all" />
          </motion.div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <Link to="/"><button className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-[#6B7280] hover:bg-[#F5F7FB] transition-colors"><ArrowLeft className="h-4 w-4" />이전으로</button></Link>
          <button onClick={handleSubmit} disabled={isSubmitting}
            className="flex items-center gap-2 rounded-full bg-[#4F7CF3] px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#3a6ce0] transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? '생성 중...' : (<>시간표 생성하기<ArrowRight className="h-4 w-4" /></>)}
          </button>
        </div>
      </main>
    </div>
  );
}
