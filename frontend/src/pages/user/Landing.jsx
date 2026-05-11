import { Link, useNavigate } from 'react-router-dom';
import '../../styles/global.css';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles, CalendarDays, ShoppingCart, GraduationCap, ChevronDown, LogOut, User } from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';
import useAuthStore from '../../store/authStore';

function TimetableGrid() {
  const slots = [
    { day: '월', start: '09:00', end: '12:00', name: '블록체인개론', room: 'AI관-408', color: '#8FA8FF' },
    { day: '월', start: '12:00', end: '14:00', name: '소프트웨어공학', room: 'AI관-302', color: '#F7CFA1' },
    { day: '화', start: '09:00', end: '12:00', name: '종합프로젝트', room: 'AI관-508', color: '#8EDDD0' },
    { day: '화', start: '15:00', end: '17:00', name: '지성학I', room: '화상강의', color: '#F5E88F' },
    { day: '수', start: '09:00', end: '12:00', name: '디지털미디어', room: '화상강의', color: '#F4AFCF' },
    { day: '목', start: '11:00', end: '13:00', name: '가정과육아', room: '화상강의', color: '#C3B5FF' },
  ];
  const days = ['월', '화', '수', '목', '금'];
  const startHour = 9;
  const endHour = 24;
  const hourHeight = 55;
  const getTime = (t) => { const [h, m] = t.split(':').map(Number); return h + m / 60; };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E8F0FF] shadow-[0_8px_32px_rgba(79,124,243,0.12)]">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-[40px_repeat(5,1fr)] mb-1">
        <div className="h-9" />
        {days.map(d => (
          <div key={d} className="text-center text-[13px] font-bold text-[#4F7CF3] leading-9 bg-[#F0F4FF] rounded-lg mx-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* 시간표 본체 */}
      <div className="grid grid-cols-[40px_repeat(5,1fr)] relative" style={{ height: (endHour - startHour) * hourHeight }}>
        {/* 가로 시간선 및 라벨 */}
        {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
          <React.Fragment key={i}>
            <div 
              className="absolute w-9 text-[11px] text-[#9CA3AF] text-right pr-1.5" 
              style={{ top: i * hourHeight - 8 }}
            >
              {startHour + i}
            </div>
            <div 
              className="absolute h-px left-10 right-0 bg-[#F3F4F6]" 
              style={{ top: i * hourHeight }} 
            />
          </React.Fragment>
        ))}

        {/* 과목 카드 영역 */}
        <div className="absolute inset-0 left-10 grid grid-cols-5 h-full">
          {days.map(day => (
            <div key={day} className="relative h-full border-l border-[#F3F4F6]">
              {slots.filter(s => s.day === day).map((slot, i) => {
                const top = (getTime(slot.start) - startHour) * hourHeight;
                const height = (getTime(slot.end) - getTime(slot.start)) * hourHeight;
                return (
                  <div 
                    key={i} 
                    className="absolute left-[3px] right-[3px] rounded-lg p-1.5 overflow-hidden shadow-sm transition-transform hover:scale-[1.02] hover:z-10"
                    style={{ top, height, backgroundColor: slot.color }}
                  >
                    <div className="text-white text-[12px] font-bold leading-tight mb-0.5 drop-shadow-sm">
                      {slot.name}
                    </div>
                    <div className="text-white/90 text-[10px] truncate drop-shadow-sm">
                      {slot.room}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 정보 */}
      <div className="mt-2 pt-2 border-t border-[#F3F4F6] text-[11px] text-[#9CA3AF] flex justify-between px-1">
        <span>사회봉사1 (P/NP)</span>
        <span className="font-medium">Gachon Univ.</span>
      </div>
    </div>
  );
}



function HeroSection() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
const user = useAuthStore((state) => state.user);

  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-[#F5F7FB] font-pretendard">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 왼쪽 텍스트 콘텐츠 영역 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="flex flex-col gap-6"
        >
          {isLoggedIn ? (
            <>
              {/* 로그인 상태 헤더 */}
              <div className="inline-flex items-center gap-2 bg-[#E8F0FF] text-[#4F7CF3] px-4 py-2 rounded-full text-sm font-medium w-fit">
                {user?.name}님, 환영합니다!
              </div>
              <h1 className="text-[clamp(32px,5vw,56px)] font-bold text-[#1F2937] leading-[1.2] m-0">
                이번 학기 시간표,<br />오늘 바로 완성하세요.
              </h1>
              <p className="text-lg text-[#6B7280] leading-[1.7] m-0">
                장바구니에 담은 강의와 졸업 요건을 분석해<br />
                나만의 최적 시간표를 3초 만에 만들어드립니다.
              </p>
              
              {/* 로그인 상태 대시보드 버튼 그리드 */}
              <div className="grid grid-cols-2 gap-3 max-w-[480px]">
                <Link to="/timetable/setup" className="flex items-center justify-center gap-2 bg-[#4F7CF3] text-white p-4 rounded-2xl font-bold text-[15px] no-underline shadow-[0_4px_12px_rgba(79,124,243,0.35)] hover:bg-[#3D66D6] transition-colors">
                  시간표 만들기
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* 비로그인 상태 헤더 */}
              <div className="inline-flex items-center gap-2 bg-[#E8F0FF] text-[#4F7CF3] px-4 py-2 rounded-full text-sm font-medium w-fit">
               
                가천대학교 스마트 시간표 생성기
              </div>
              <h1 className="text-[clamp(36px,5vw,60px)] font-bold text-[#1F2937] leading-[1.2] m-0">
                시간표, 이제<br />고민하지 말고 맡겨.
              </h1>
              <p className="text-lg text-[#6B7280] leading-[1.7] m-0">
                여러분의 선호 조건을 모두 반영할 수 있습니다<br />
                공강요일, 온라인 강의 선호, 오르막 회피까지 모두 고려한 완벽한 시간표를 만들어드립니다
              </p>
              
              {/* 비로그인 상태 주요 CTA 버튼 */}
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="bg-[#4F7CF3] text-white px-8 py-4 rounded-xl font-semibold no-underline flex items-center gap-2 shadow-[0_4px_12px_rgba(79,124,243,0.35)] hover:bg-[#3D66D6] transition-colors">
                  시작하기 <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/timetable/setup" className="bg-white border-[1.5px] border-[#D1D5DB] text-[#1F2937] px-8 py-4 rounded-xl font-semibold no-underline flex items-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:bg-gray-50 transition-colors">
                  지금 시간표 만들기
                </Link>
              </div>
            </>
          )}
        </motion.div>

        {/* 오른쪽 시간표 그리드 미리보기 영역 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, delay: 0.2 }} 
          className="relative"
        >
          <TimetableGrid />
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: '개인선호 맞춤형 조건 반영', 
      desc: '단순한 공강 설정을 넘어섭니다. 선호하는 시간대는 물론, 건물 이동 동선 및 오르막 회피까지 계산해 나만의 최적화된 시간표를 조립합니다.' 
    },
    { 
      title: '직관적인 졸업 요건 대시보드', 
      desc: '복잡한 졸업 규정, 더 이상 헤매지 마세요. 내 수강내역을 분석해 졸업까지 남은 학점과 필수 과목을 한눈에 시각화해 드립니다.' 
    },
    { 
      title: '3초 만에 빠른 생성', 
      desc: '아무리 복잡한 조건이라도 문제없습니다. 자체 CSP 엔진이 수백 개의 경우의 수를 즉시 비교하여 가장 완벽한 결과물을 제공합니다.' 
    },
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white font-pretendard">
      <div className="max-w-[1280px] mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-[#1F2937] mb-4">
            왜 Sometime인가요?
          </h2>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            수동으로 시간표를 짜던 시대는 끝났습니다.<br />
            이제 더 스마트하게 준비하세요.
          </p>
        </div>

        {/* 특장점 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: i * 0.1 }} 
              viewport={{ once: true }}
              className="bg-white flex flex-col gap-4 p-8 rounded-2xl border border-[#E8F0FF] shadow-[0_2px_12px_rgba(79,124,243,0.08)] hover:shadow-lg transition-shadow"
            >
              {/* 아이콘 박스 */}
    
              
              <h3 className="font-bold text-[#1F2937] text-[15px] m-0">
                {f.title}
              </h3>
              <p className="color-[#6B7280] text-sm leading-[1.6] m-0 text-slate-500">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightSection() {
  const [active, setActive] = useState(0);
  const steps = [
    { number: 1, title: '기본 정보 입력', desc: '컴퓨터공학과 21학번, 이번 학기 목표는 18학점! Sometime에 나의 기본 학사 정보를 가볍게 셋팅합니다.' },
    { number: 2, title: '맞춤 조건 우선순위 설정', desc: '공강 요일이 가장 중요한가요, 아니면 동선 최소화가 먼저인가요? 나에게 가장 중요한 조건의 순위를 결정하세요.' },
    { number: 3, title: '디테일한 선호 조건 응답', desc: '원하는 시간대부터 피하고 싶은 동선까지 꼼꼼하게 체크합니다.' },
    { number: 4, title: '3초 만에 최적화 시간표 생성', desc: 'CSP 엔진이 클릭 한 번으로 내 조건에 완벽히 부합하는 시간표를 완성합니다.' },
    { number: 5, title: 'AI 맞춤형 코멘트 확인', desc: 'AI가 시간표마다 맞춤 코멘트를 작성해드립니다.' },
  ];

  return (
    <section id="howto" className="py-20 px-6 bg-[#F9FAFB] font-pretendard">
      <div className="max-w-[960px] mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[#E8F0FF] text-[#4F7CF3] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            이렇게 사용해요
          </div>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-[#1F2937] mb-4">
            5단계로 완성하는<br />완벽한 시간표
          </h2>
          <p className="text-lg text-[#6B7280] m-0">
            복잡한 조건 설정도 직관적으로, 3초 만에 최적의 시간표를 만나보세요
          </p>
        </div>

        {/* 메인 단계 카드 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-[#E8F0FF] overflow-hidden">
          {/* 상단 프로그레스 바 영역 */}
          <div className="p-8 pb-6 sm:px-12">
            <div className="relative">
              {/* 회색 배경 선 */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-[#E5E7EB] rounded-full" />
              {/* 파란색 활성화 선 */}
              <div 
                className="absolute top-5 left-0 h-1 bg-[#4F7CF3] rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(active / (steps.length - 1)) * 100}%` }}
              />
              
              {/* 단계별 원형 버튼 */}
              <div className="relative flex justify-between">
                {steps.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActive(i)} 
                    className="flex flex-col items-center bg-transparent border-none cursor-pointer p-0 group"
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                      ${i <= active 
                        ? 'bg-[#4F7CF3] text-white shadow-[0_4px_12px_rgba(79,124,243,0.4)]' 
                        : 'bg-white text-[#9CA3AF] border-2 border-[#D1D5DB] group-hover:border-[#4F7CF3]/50'}
                    `}>
                      {s.number}
                    </div>
                    <span className={`
                      mt-2 text-[12px] font-medium transition-colors
                      ${i === active ? 'text-[#4F7CF3]' : 'text-[#9CA3AF]'}
                    `}>
                      Step {s.number}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 콘텐츠 및 네비게이션 영역 */}
          <div className="px-8 pb-8 pt-4 sm:px-12">
            <motion.div 
              key={active} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.3 }} 
              className="min-h-[120px]"
            >
              <h3 className="text-2xl font-bold text-[#1F2937] mb-3">{steps[active].title}</h3>
              <p className="text-lg text-[#6B7280] leading-relaxed m-0">{steps[active].desc}</p>
            </motion.div>

            {/* 컨트롤 버튼 */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#F3F4F6]">
              <button 
                onClick={() => setActive(Math.max(0, active - 1))} 
                disabled={active === 0} 
                className={`
                  px-6 py-2 rounded-xl font-medium text-sm transition-colors border-none bg-transparent font-pretendard
                  ${active === 0 ? 'text-[#D1D5DB] cursor-not-allowed' : 'text-[#6B7280] hover:bg-slate-50 cursor-pointer'}
                `}
              >
                이전
              </button>

              {/* 중앙 인디케이터 점 */}
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActive(i)} 
                    className={`
                      h-2 rounded-full transition-all border-none cursor-pointer p-0
                      ${i === active ? 'bg-[#4F7CF3] w-6' : 'bg-[#D1D5DB] w-2'}
                    `}
                  />
                ))}
              </div>

              {active === steps.length - 1 ? (
                <Link 
                  to="/timetable/setup" 
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#4F7CF3] text-white font-semibold text-sm no-underline hover:bg-[#3D66D6] transition-colors"
                >
                  시작하기 <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button 
                  onClick={() => setActive(Math.min(steps.length - 1, active + 1))} 
                  className="px-6 py-2 rounded-xl font-medium text-sm text-[#4F7CF3] border-none bg-transparent cursor-pointer hover:bg-blue-50 transition-colors font-pretendard"
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecondaryFeature() {
  return (
    <section className="py-20 px-6 bg-white font-pretendard">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-24">
        
        {/* 첫 번째 기능: 장바구니 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 텍스트 영역 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }} 
            viewport={{ once: true }} 
            className="flex flex-col gap-5 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 bg-[#ede9fe] text-[#A78BFA] px-4 py-2 rounded-full text-sm font-semibold w-fit">
              <ShoppingCart className="w-4 h-4" /> 장바구니 기능
            </div>
            <h2 className="text-[clamp(24px,3vw,36px)] font-bold text-[#1F2937] leading-tight m-0">
              절대 포기할 수 없는<br />1순위 과목 사수하기
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed m-0">
              이번 학기에 무조건 들어야 하는 과목이 있나요? 장바구니에 담아 최우선으로 설정하면, 엔진이 해당 과목을 뼈대 삼아 나머지 시간표를 완벽하게 조립합니다.
            </p>
            <Link to="/cart" className="inline-flex items-center gap-2 bg-[#4F7CF3] text-white px-6 py-3 rounded-xl font-semibold text-sm no-underline w-fit hover:bg-[#3D66D6] transition-colors">
              장바구니 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* 비주얼 카드 영역 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }} 
            viewport={{ once: true }} 
            className="bg-white rounded-2xl border border-[#E8F0FF] p-6 shadow-[0_4px_24px_rgba(79,124,243,0.08)] order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-[#4F7CF3]" />
              <span className="font-semibold text-[#1F2937]">관심 강의 장바구니</span>
            </div>
            {['자료구조 (김교수)', '알고리즘 (이교수)', '영어회화 (Smith)'].map((c, i) => (
              <div key={i} className={`flex items-center justify-between py-3 ${i < 2 ? 'border-b border-[#F3F4F6]' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4F7CF3]" />
                  <span className="text-sm text-[#1F2937]">{c}</span>
                </div>
                <span className="text-[12px] bg-[#E8F0FF] text-[#4F7CF3] px-2 py-1 rounded-full font-medium">
                  {i === 0 ? '최우선' : i === 1 ? '우선' : '보통'}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 두 번째 기능: 졸업요건 대시보드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 비주얼 카드 영역 */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }} 
            viewport={{ once: true }} 
            className="bg-white rounded-2xl border border-[#E8F0FF] p-6 shadow-[0_4px_24px_rgba(79,124,243,0.08)]"
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-5 h-5 text-[#2EC4B6]" />
              <span className="font-semibold text-[#1F2937]">졸업 요건 현황</span>
            </div>
            {[
              { label: '전공 필수', c: 36, t: 42, color: 'bg-[#4F7CF3]' }, 
              { label: '교양 필수', c: 18, t: 21, color: 'bg-[#2EC4B6]' }, 
              { label: '자유 선택', c: 12, t: 15, color: 'bg-[#A78BFA]' }
            ].map((item, i) => (
              <div key={i} className={i < 2 ? 'mb-4' : ''}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#1F2937] font-medium">{item.label}</span>
                  <span className="text-sm text-[#6B7280]">{item.c}/{item.t}학점</span>
                </div>
                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.color} transition-all duration-1000`} 
                    style={{ width: `${(item.c / item.t) * 100}%` }} 
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* 텍스트 영역 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.6 }} 
            viewport={{ once: true }} 
            className="flex flex-col gap-5"
          >
            <div className="inline-flex items-center gap-2 bg-[#d1faf5] text-[#2EC4B6] px-4 py-2 rounded-full text-sm font-semibold w-fit">
              <GraduationCap className="w-4 h-4" /> 졸업요건 대시보드
            </div>
            <h2 className="text-[clamp(24px,3vw,36px)] font-bold text-[#1F2937] leading-tight m-0">
              복잡한 졸업 규정?<br />대시보드 하나로 종결.
            </h2>
            <p className="text-lg text-[#6B7280] leading-relaxed m-0">
              입학년도마다 달라지는 복잡한 요건들, 내 수강내역을 바탕으로 남은 학점을 대시보드에서 직관적으로 트래킹하세요.
            </p>
            <Link to="/graduation/dashboard" className="inline-flex items-center gap-2 bg-[#2EC4B6] text-white px-6 py-3 rounded-xl font-semibold text-sm no-underline w-fit hover:bg-[#25A196] transition-colors">
              졸업요건 확인하기 <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  const faqs = [
    { q: '어떤 학교 학생이 사용할 수 있나요?', a: '현재는 가천대학교 학생을 대상으로 서비스를 제공하고 있습니다.' },
    { q: '시간표 생성에 얼마나 걸리나요?', a: '자체 CSP 엔진을 통해 평균 3초 이내에 최적화된 시간표를 생성합니다.' },
    { q: '공강일이 보장되나요?', a: '원하는 공강일을 설정하면 최대한 반영합니다. 단, 필수 과목이 해당 요일에만 개설된 경우 불가피하게 반영되지 않을 수 있습니다.' },
    { q: '생성된 시간표를 수정할 수 있나요?', a: '결과 화면에서 조건을 재설정하여 새로운 시간표를 생성할 수 있습니다.' },
    { q: '졸업 요건 정보는 어떻게 관리되나요?', a: '학번별로 졸업 요건 데이터가 관리되며, 수강 내역을 입력하면 충족도를 자동으로 계산해드립니다.' },
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-[#F9FAFB] font-pretendard">
      <div className="max-w-[768px] mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-[#1F2937] mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-[#6B7280] m-0">궁금한 점이 있으신가요?</p>
        </div>

        {/* 아코디언 리스트 */}
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <div 
              key={i} 
              className="rounded-2xl border border-[#E8F0FF] bg-white overflow-hidden transition-all duration-200"
            >
              <button 
                onClick={() => setOpenIdx(openIdx === i ? null : i)} 
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left bg-transparent border-none cursor-pointer font-pretendard group"
              >
                <span className={`font-semibold text-[15px] transition-colors ${openIdx === i ? 'text-[#4F7CF3]' : 'text-[#1F2937]'}`}>
                  Q. {f.q}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-[#6B7280] shrink-0 ml-4 transition-transform duration-300 ${openIdx === i ? 'rotate-180 text-[#4F7CF3]' : 'rotate-0'}`} 
                />
              </button>

              <AnimatePresence>
                {openIdx === i && (
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: 'auto' }} 
                    exit={{ height: 0 }} 
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#6B7280] leading-relaxed border-t border-[#F3F4F6] pt-4">
                      <span className="font-bold text-[#4F7CF3] mr-1">A.</span> {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  return (
    <section className="py-20 px-6 bg-[#4F7CF3] relative overflow-hidden font-pretendard">
      {/* 배경 장식용 블러 원형 (Blur Effects) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[80px]" />
      </div>

      <div className="max-w-[768px] mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          viewport={{ once: true }} 
          className="flex flex-col items-center gap-8"
        >
          {/* 배지(Badge) */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold text-white">
            지금 바로 시작하세요
          </div>

          {/* 메인 카피 */}
          <h2 className="text-[clamp(32px,5vw,56px)] font-bold text-white leading-[1.2] m-0">
            시간표 고민은 이제 그만,<br />3초면 충분합니다
          </h2>

          <p className="text-xl text-white/80 max-w-[512px] m-0">
            복잡한 시간표 계획을 단 몇 번의 클릭으로 해결하세요.
          </p>

          {/* 버튼 그룹 */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* 비로그인 시에만 노출되는 시작 버튼 */}
            {!isLoggedIn && (
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 bg-white text-[#4F7CF3] px-8 py-3.5 rounded-full font-bold text-lg no-underline shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform"
              >
                시작하기 <ArrowRight className="w-[18px] h-[18px]" />
              </Link>
            )}

            {/* 시간표 만들기 버튼 (로그인 여부에 따라 스타일 가변) */}
            <Link 
              to="/timetable/setup" 
              className={`
                inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-lg no-underline transition-all hover:scale-105
                ${isLoggedIn 
                  ? 'bg-white text-[#4F7CF3] shadow-[0_8px_32px_rgba(0,0,0,0.15)]' 
                  : 'bg-white/20 text-white border-2 border-white/50 backdrop-blur-sm'}
              `}
            >
              지금 시간표 만들기
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const links = {
    service: [
      { label: '시간표 만들기', to: '/timetable/setup' }, 
      { label: '강의 검색', to: '/courses' }, 
      { label: '장바구니', to: '/cart' }, 
      { label: '시간표 관리', to: '/timetable/manage' }
    ],
    graduation: [
      { label: '수강내역', to: '/graduation/history' }, 
      { label: '졸업요건 대시보드', to: '/graduation/dashboard' }
    ],
    support: [
      { label: '공지사항', to: '/notice' }, 
      { label: 'FAQ', to: '#faq' }
    ],
    account: [
      { label: '로그인', to: '/login' }, 
      { label: '회원가입', to: '/signup' }, 
      { label: '마이페이지', to: '/mypage' }
    ],
  };

  return (
    <footer className="bg-[#F9FAFB] border-t border-[#E8F0FF] font-pretendard">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {/* 상단 링크 그리드 영역 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          {/* 브랜드 섹션 */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 no-underline">
              <GachonLogo size={30} />
              <span className="font-bold text-lg text-[#1F2937]">Sometime</span>
            </Link>
            <p className="text-[#6B7280] text-[13px] leading-relaxed m-0">
              가천대학교 학생들을 위한<br />
              스마트 시간표 생성 서비스.
            </p>
          </div>

          {/* 서비스 링크 */}
          <div>
            <h4 className="font-semibold text-[#1F2937] text-[13px] mb-4 uppercase tracking-wider">서비스</h4>
            <div className="flex flex-col gap-2">
              {links.service.map(l => (
                <Link key={l.to} to={l.to} className="text-[#6B7280] text-[13px] no-underline hover:text-[#4F7CF3] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 졸업관리 링크 */}
          <div>
            <h4 className="font-semibold text-[#1F2937] text-[13px] mb-4 uppercase tracking-wider">졸업관리</h4>
            <div className="flex flex-col gap-2">
              {links.graduation.map(l => (
                <Link key={l.to} to={l.to} className="text-[#6B7280] text-[13px] no-underline hover:text-[#4F7CF3] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 운영지원 링크 */}
          <div>
            <h4 className="font-semibold text-[#1F2937] text-[13px] mb-4 uppercase tracking-wider">운영지원</h4>
            <div className="flex flex-col gap-2">
              {links.support.map(l => (
                <Link key={l.to} to={l.to} className="text-[#6B7280] text-[13px] no-underline hover:text-[#4F7CF3] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 계정 링크 */}
          <div>
            <h4 className="font-semibold text-[#1F2937] text-[13px] mb-4 uppercase tracking-wider">계정</h4>
            <div className="flex flex-col gap-2">
              {links.account.map(l => (
                <Link key={l.to} to={l.to} className="text-[#6B7280] text-[13px] no-underline hover:text-[#4F7CF3] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 카피라이트 영역 */}
        <div className="border-t border-[#E8F0FF] pt-6 flex flex-wrap justify-between items-center gap-3">
          <p className="text-[#6B7280] text-[13px] m-0">
            © 2026 Sometime. All rights reserved.
          </p>
          <p className="text-[#6B7280] text-[13px] m-0">
            Made with ❤️ for Gachon University
          </p>
        </div>
      </div>
    </footer>
  );
}

// 최상단에 필요한 훅과 컴포넌트들이 모두 import 되어 있는지 확인하세요.
export default function Landing() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    // 인라인 스타일을 삭제하고 Tailwind 클래스로 변경 (폰트는 global.css 혹은 상위 layout에서 적용됨을 가정)
    <div className="min-h-screen bg-white">
      <HeroSection />
      <Features />
      
      {/* 로그인하지 않은 사용자에게만 보여주는 홍보/가이드 섹션 */}
      {!isLoggedIn && (
        <>
          <HighlightSection />
          <SecondaryFeature />
        </>
      )}
      
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}