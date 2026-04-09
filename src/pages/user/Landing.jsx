import { Link } from 'react-router-dom';
import '../../styles/global.css';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ArrowRight, Sparkles, CalendarDays,
  Mountain, Laptop, ShoppingCart, GraduationCap,
  Clock, ChevronDown, Mail, MessageSquare, Video, Code,
} from 'lucide-react';
import { GachonLogo } from '../../components/ui/GachonLogo';

// ============================================
// SVG Path (기존 유지)
// ============================================
const svgPaths = {
  pf354c80: "M8.00945 3.33864C6.81713 3.33864 5.84648 4.31817 5.84648 5.51557C5.84648 6.27305 6.23545 6.94188 6.82282 7.33174C6.1134 7.56894 5.49955 8.01228 5.04932 8.59226C4.8004 8.40079 4.52226 8.24681 4.22242 8.13647C4.67711 7.79892 4.97423 7.25668 4.97423 6.64725C4.97423 5.63171 4.15289 4.80037 3.14351 4.80037C2.13413 4.80037 1.31279 5.63171 1.31279 6.64725C1.31279 7.25703 1.61016 7.79952 2.06523 8.13707C0.860443 8.58165 0 9.74563 0 11.1155V12.0777C0.000123313 12.1511 0.029466 12.2214 0.0814931 12.273C0.13352 12.3248 0.203919 12.3537 0.277275 12.3534H4.49901C4.50924 12.3545 4.51947 12.3551 4.5297 12.355H11.4894C11.4997 12.3551 11.51 12.3545 11.5201 12.3534H15.7422C15.894 12.3528 16.0169 12.2296 16.0172 12.0777V11.1155C16.0172 9.74563 15.1583 8.58165 13.9541 8.13695C14.4092 7.79952 14.7066 7.2569 14.7066 6.64713C14.7066 5.63159 13.8852 4.80025 12.8758 4.80025C11.8665 4.80025 11.0451 5.63159 11.0451 6.64713C11.0451 7.25656 11.3424 7.79889 11.7971 8.13635C11.4966 8.24694 11.2183 8.40142 10.9691 8.59336C10.519 8.01303 9.90605 7.56908 9.19666 7.33174C9.78387 6.94188 10.173 6.27305 10.173 5.51557C10.173 4.31817 9.20184 3.33864 8.00952 3.33864H8.00945Z",
};

// ============================================
// TimetableGrid — 기존 에버타임 다크 스타일 유지
// ============================================
function TimetableGrid() {
  const everytimeSlots = [
    { day: '월', start: '09:00', end: '12:00', name: '블록체인개론', room: 'AI관-408', color: '#D68677' },
    { day: '월', start: '12:00', end: '14:00', name: '빅데이터프로그래밍', room: 'AI관-302', color: '#C5B376' },
    { day: '월', start: '15:00', end: '17:00', name: '음악감상 및 비평', room: '화상강의(가상)', color: '#B4D68A' },
    { day: '화', start: '09:00', end: '12:00', name: '종합프로젝트', room: 'AI관-508', color: '#82B2A7' },
    { day: '화', start: '13:00', end: '14:00', name: '빅데이터프로그래밍', room: 'AI관-302', color: '#C5B376' },
    { day: '화', start: '15:00', end: '17:00', name: '지성학I', room: '화상강의(가상)', color: '#8CA8D6' },
    { day: '수', start: '09:00', end: '12:00', name: '디지털미디어리터러시', room: '화상강의(가상)', color: '#D6A677' },
    { day: '목', start: '11:00', end: '13:00', name: '가정과육아', room: '화상강의(가상)', color: '#988AD6' },
  ];

  const days = ['월', '화', '수', '목', '금'];
  const startHour = 9;
  const endHour = 19;
  const hourHeight = 55;

  const getTimeInfo = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h + m / 60;
  };

  return (
    <div className="bg-[#121212] rounded-2xl p-3 font-sans max-w-4xl mx-auto shadow-2xl border border-[#222]">
      <div className="grid grid-cols-[40px_repeat(5,1fr)] border-b border-[#222]">
        <div className="h-10" />
        {days.map(day => (
          <div key={day} className="text-center text-[12px] font-bold text-[#777] leading-10 border-l border-[#222]">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-[40px_repeat(5,1fr)] relative" style={{ height: (endHour - startHour) * hourHeight }}>
        {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="text-[11px] text-[#555] text-right pr-3" style={{ position: 'absolute', top: i * hourHeight - 8, width: '40px' }}>
              {startHour + i}
            </div>
            <div className="col-start-2 col-span-5 border-t border-[#1f1f1f] w-full" style={{ position: 'absolute', top: i * hourHeight, height: '1px', left: '40px', right: 0 }} />
          </React.Fragment>
        ))}
        <div className="absolute inset-0 left-[40px] grid grid-cols-5 h-full">
          {days.map((day) => (
            <div key={day} className="relative h-full border-l border-[#1f1f1f]">
              {everytimeSlots.filter(s => s.day === day).map((slot, sIdx) => {
                const top = (getTimeInfo(slot.start) - startHour) * hourHeight;
                const height = (getTimeInfo(slot.end) - getTimeInfo(slot.start)) * hourHeight;
                return (
                  <div key={sIdx} className="absolute left-[1px] right-[1px] p-1 flex flex-col shadow-inner"
                    style={{ top: `${top}px`, height: `${height}px`, backgroundColor: slot.color, borderLeft: '3px solid rgba(0,0,0,0.15)', borderRadius: '3px' }}>
                    <span className="text-white text-[10px] font-bold leading-tight mb-0.5">{slot.name}</span>
                    <span className="text-white/70 text-[9px] leading-tight truncate">{slot.room}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-[#222] text-[10px] text-[#555] flex justify-between px-2">
        <span className="text-[#888]">사회봉사1 (P/NP)</span>
        <span className="italic opacity-50 text-[9px]">Gachon Univ.</span>
      </div>
    </div>
  );
}

// ============================================
// Navbar — 가천대 로고 + 새 색상
// ============================================
function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { label: '기능', href: '#features' },
    { label: '사용법', href: '#howto' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <GachonLogo size={34} />
            <span className="font-bold text-xl text-foreground">Sometime</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a key={item.href} href={item.href} className="text-foreground/70 hover:text-foreground transition-colors font-medium text-sm">{item.label}</a>
            ))}
            <Link to="/Login" className="text-foreground/70 hover:text-foreground transition-colors font-medium text-sm">로그인</Link>
            <Link to="/timetable/setup" className="bg-[#4F7CF3] text-white px-5 py-2 rounded-xl font-medium text-sm hover:bg-[#3a6ce0] transition-colors">
              시간표 만들기
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 flex flex-col gap-3">
              {navItems.map(item => (
                <a key={item.href} href={item.href} className="text-foreground/70 hover:text-foreground font-medium py-2 text-sm" onClick={() => setIsMenuOpen(false)}>{item.label}</a>
              ))}
              <Link to="/Login" onClick={() => setIsMenuOpen(false)} className="text-foreground/70 hover:text-foreground font-medium py-2 text-sm">로그인</Link>
              <Link to="/timetable/setup" onClick={() => setIsMenuOpen(false)} className="bg-[#4F7CF3] text-white px-5 py-3 rounded-xl font-semibold text-sm text-center">시간표 만들기</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ============================================
// HeroSection — 기존 레이아웃 + 다크 TimetableGrid 유지
// ============================================
function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#4F7CF3]/10 text-[#4F7CF3] px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              가천대학교 스마트 시간표 생성기
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              시간표, 이제<br />고민하지 말고 맡겨.
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl">
              여러분의 선호 조건을 모두 반영할 수 있습니다<br />
              공강요일, 온라인 강의 선호, 오르막 회피까지 모두 고려한 완벽한 시간표를 만들어드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/timetable/setup"
                className="bg-[#4F7CF3] text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all hover:shadow-lg flex items-center justify-center gap-2 group w-fit">
                시간표 만들기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/Login"
                className="border border-border text-foreground px-8 py-4 rounded-xl font-semibold hover:bg-muted transition-all flex items-center justify-center gap-2 w-fit">
                로그인
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#4F7CF3]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#2EC4B6]/20 rounded-full blur-3xl" />
            <div className="relative">
              <TimetableGrid />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Features — 기존 카드 스타일 유지 + 새 색상
// ============================================
function Features() {
  const features = [
    {
      title: '개인선호 맞춤형 조건 반영',
      description: '단순한 공강 설정을 넘어섭니다. 선호하는 시간대는 물론, 연강 시 불가능한 건물 이동 동선 및 오르막 회피까지 계산해 나만의 최적화된 시간표를 조립합니다.',
      iconBg: '#E8F0FF', iconColor: '#4F7CF3',
    },
    {
      title: '직관적인 졸업 요건 대시보드',
      description: '복잡한 졸업 규정, 더 이상 헤매지 마세요. 내 기수강 내역을 분석해 졸업까지 남은 학점과 필수 과목을 한눈에 알기 쉽게 시각화해 드립니다.',
      iconBg: '#2EC4B620', iconColor: '#2EC4B6',
    },
    {
      title: '빠른 생성',
      description: '아무리 복잡한 조건이라도 문제없습니다. 자체 CSP 엔진이 수백 개의 경우의 수를 즉시 비교하여 가장 완벽한 결과물을 제공합니다.',
      iconBg: '#A78BFA20', iconColor: '#A78BFA',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">왜 Sometime인가요?</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">수동으로 시간표를 짜던 시대는 끝났습니다. 이제 더 스마트하게 준비하세요.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
              className="bg-white flex flex-col gap-4 px-8 py-6 rounded-2xl shadow-[0px_2px_12px_rgba(79,124,243,0.08)] border border-[#E8F0FF] hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: feature.iconBg }}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 16.0256 16.0256">
                  <path d={svgPaths.pf354c80} fill={feature.iconColor} />
                </svg>
              </div>
              <h3 className="font-bold text-[#1F2937] text-base">{feature.title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// HighlightSection — 기존 스텝 구조 유지
// ============================================
function HighlightSection() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    { number: 1, title: '기본 정보 입력', description: '컴퓨터공학과 21학번, 이번 학기 목표는 18학점! Sometime에 나의 기본 학사 정보를 가볍게 셋팅합니다.' },
    { number: 2, title: '맞춤 조건 우선순위 랭킹', description: '공강 요일이 가장 중요한가요, 아니면 동선 최소화가 먼저인가요? 나에게 가장 중요한 조건의 순위를 직관적으로 결정하세요.' },
    { number: 3, title: '디테일한 선호 조건 응답', description: '무거운 17인치 랩탑 가방을 메고 가파른 오르막길을 오르기 싫다면? 원하는 시간대부터 피하고 싶은 동선까지 꼼꼼하게 체크합니다.' },
    { number: 4, title: '3초 만에 최적화 시간표 생성', description: '복잡한 경우의 수는 Sometime의 CSP 엔진이 계산합니다. 클릭 한 번으로 내 조건에 완벽히 부합하는 시간표가 완성됩니다.' },
    { number: 5, title: 'AI 맞춤형 코멘트 확인', description: '당신의 선호를 분석한 AI가 시간표마다 맞춤 코멘트를 작성해드립니다. 화요일 공강으로 여유로운 한 주, 최소 동선으로 체력 절약 같은 친절한 설명을 확인하세요.' },
  ];

  return (
    <section id="howto" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-block bg-[#4F7CF3]/10 text-[#4F7CF3] px-4 py-2 rounded-full text-sm font-semibold mb-4">이렇게 사용해요</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">5단계로 완성하는<br />완벽한 시간표</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">복잡한 조건 설정도 직관적으로, 3초 만에 최적의 시간표를 만나보세요</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E8F0FF]">
          <div className="px-8 pt-8 pb-6">
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
              <div className="absolute top-5 left-0 h-1 bg-[#4F7CF3] rounded-full transition-all duration-500 ease-out" style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }} />
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <button key={step.number} onClick={() => setActiveStep(index)} className="flex flex-col items-center group">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${index <= activeStep ? 'bg-[#4F7CF3] text-white shadow-lg scale-110' : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-[#4F7CF3]/50'}`}>
                      {step.number}
                    </div>
                    <span className={`mt-2 text-xs font-medium transition-colors duration-300 hidden sm:block ${index === activeStep ? 'text-[#4F7CF3]' : 'text-gray-400'}`}>Step {step.number}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-8 pb-8 pt-4">
            <motion.div key={activeStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="min-h-[180px]">
              <h3 className="text-2xl font-bold text-foreground mb-4">{steps[activeStep].title}</h3>
              <p className="text-lg text-foreground/70 leading-relaxed">{steps[activeStep].description}</p>
            </motion.div>
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${activeStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>이전</button>
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <button key={index} onClick={() => setActiveStep(index)} className={`h-2 rounded-full transition-all ${index === activeStep ? 'bg-[#4F7CF3] w-6' : 'bg-gray-300 w-2'}`} />
                ))}
              </div>
              {activeStep === steps.length - 1 ? (
                <Link to="/timetable/setup" className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#4F7CF3] text-white font-semibold text-sm hover:bg-[#3a6ce0] transition-all">
                  시작하기 <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))} className="px-6 py-2 rounded-lg font-medium text-[#4F7CF3] hover:bg-[#4F7CF3]/10 transition-all">다음</button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// SecondaryFeature — 기존 구조 유지 + 새 색상
// ============================================
function SecondaryFeature() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* 장바구니 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-[#A78BFA]/10 text-[#A78BFA] px-4 py-2 rounded-full text-sm font-semibold">
              <ShoppingCart className="w-4 h-4" /> 장바구니 기능
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">절대 포기할 수 없는<br />1순위 과목 사수하기</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">이번 학기에 무조건 들어야 하는 과목이 있나요? 장바구니에 담아 최우선으로 설정하면, 엔진이 해당 과목을 뼈대 삼아 나머지 시간표를 완벽하게 조립합니다.</p>
            <Link to="/cart" className="inline-flex items-center gap-2 bg-[#4F7CF3] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#3a6ce0] transition-all">
              장바구니 보기 <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="bg-white rounded-2xl border border-[#E8F0FF] p-6 shadow-[0_4px_24px_rgba(79,124,243,0.08)] order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-5 h-5 text-[#4F7CF3]" />
              <span className="font-semibold text-[#1F2937]">관심 강의 장바구니</span>
            </div>
            {['자료구조 (김교수)', '알고리즘 (이교수)', '영어회화 (Smith)'].map((c, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4F7CF3]" />
                  <span className="text-sm text-[#1F2937]">{c}</span>
                </div>
                <span className="text-xs bg-[#E8F0FF] text-[#4F7CF3] px-2 py-1 rounded-full font-medium">{i === 0 ? '최우선' : i === 1 ? '우선' : '보통'}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 졸업요건 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="bg-white rounded-2xl border border-[#E8F0FF] p-6 shadow-[0_4px_24px_rgba(79,124,243,0.08)]">
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap className="w-5 h-5 text-[#2EC4B6]" />
              <span className="font-semibold text-[#1F2937]">졸업 요건 현황</span>
            </div>
            {[
              { label: '전공 필수', current: 36, total: 42, color: '#4F7CF3' },
              { label: '교양 필수', current: 18, total: 21, color: '#2EC4B6' },
              { label: '자유 선택', current: 12, total: 15, color: '#A78BFA' },
            ].map((item, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-[#1F2937] font-medium">{item.label}</span>
                  <span className="text-sm text-[#6B7280]">{item.current}/{item.total}학점</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${(item.current / item.total) * 100}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#2EC4B6]/10 text-[#2EC4B6] px-4 py-2 rounded-full text-sm font-semibold">
              <GraduationCap className="w-4 h-4" /> 졸업요건 대시보드
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">입학년도별 복잡한 졸업 규정?<br />대시보드 하나로 종결.</h2>
            <p className="text-lg text-foreground/70 leading-relaxed">입학년도마다 달라지는 복잡한 요건들, 일일이 찾아볼 필요 없습니다. 내 기수강 내역을 바탕으로 남은 학점을 대시보드에서 직관적으로 트래킹하세요.</p>
            <Link to="/timetable/setup" className="inline-flex items-center gap-2 bg-[#2EC4B6] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
              시간표 만들기 <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQSection — 기존 구조 유지
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    { question: '어떤 학교 학생이 사용할 수 있나요?', answer: '현재는 가천대학교 학생을 대상으로 서비스를 제공하고 있습니다. 강의 데이터와 캠퍼스 동선이 가천대학교 기준으로 최적화되어 있습니다.' },
    { question: '시간표 생성에 얼마나 걸리나요?', answer: '자체 CSP 엔진을 통해 평균 3초 이내에 최적화된 시간표를 생성합니다.' },
    { question: '공강일이 보장되나요?', answer: '원하는 공강일을 설정하면 최대한 반영하여 시간표를 구성합니다. 단, 필수 과목이 해당 요일에만 개설된 경우 불가피하게 반영되지 않을 수 있습니다.' },
    { question: '생성된 시간표를 수정할 수 있나요?', answer: '결과 화면에서 마음에 들지 않는 과목을 교체하거나 조건을 재설정하여 새로운 시간표를 생성할 수 있습니다.' },
    { question: '졸업 요건 정보는 어떻게 관리되나요?', answer: '학번별로 졸업 요건 데이터가 관리되며, 수강 내역을 입력하면 충족도를 자동으로 계산해드립니다.' },
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">자주 묻는 질문</h2>
          <p className="text-foreground/70">궁금한 점이 있으신가요?</p>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[#E8F0FF] bg-white overflow-hidden shadow-[0_2px_8px_rgba(79,124,243,0.06)]">
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F5F7FB] transition-colors">
                <span className="font-semibold text-foreground text-sm sm:text-base">Q. {faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform flex-shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-6 pb-5 text-sm text-foreground/70 leading-relaxed border-t border-gray-100 pt-4">A. {faq.answer}</div>
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

// ============================================
// CTASection — 기존 그라디언트 구조 유지
// ============================================
function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#4F7CF3] via-[#4F7CF3] to-[#4F7CF3]/90 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold">지금 바로 시작하세요</div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">시간표 고민은 이제 그만,<br />3초면 충분합니다</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">복잡한 시간표 계획을 단 몇 번의 클릭으로 해결하세요.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/timetable/setup" className="bg-white text-[#4F7CF3] px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2 group">
              지금 시간표 만들기
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// Footer — 기존 구조 유지 + 새 색상 + 라우팅
// ============================================
function Footer() {
  const links = {
    service: [
      { label: '시간표 만들기', to: '/timetable/setup' },
      { label: '장바구니', to: '/cart' },
    ],
    support: [
      { label: '공지사항', to: '/support' },
      { label: 'FAQ', to: '#faq' },
    ],
    account: [
      { label: '로그인', to: '/Login' },
      { label: '회원가입', to: '/Signup' },
      { label: '이용약관', to: '#' },
      { label: '개인정보처리방침', to: '#' },
    ],
  };

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GachonLogo size={32} />
              <span className="font-bold text-xl text-foreground">Sometime</span>
            </Link>
            <p className="text-foreground/70 text-sm mb-6 max-w-sm">가천대학교 학생들을 위한 스마트 시간표 생성 서비스. 더 이상 시간표로 고민하지 마세요.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">서비스</h4>
            {links.service.map(l => <Link key={l.to} to={l.to} className="block text-foreground/70 hover:text-[#4F7CF3] text-sm mb-2 transition-colors">{l.label}</Link>)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">운영지원</h4>
            {links.support.map(l => <Link key={l.to} to={l.to} className="block text-foreground/70 hover:text-[#4F7CF3] text-sm mb-2 transition-colors">{l.label}</Link>)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm">계정</h4>
            {links.account.map(l => <Link key={l.to} to={l.to} className="block text-foreground/70 hover:text-[#4F7CF3] text-sm mb-2 transition-colors">{l.label}</Link>)}
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-foreground/60 text-sm">© 2025 Sometime. All rights reserved.</p>
          <p className="text-foreground/60 text-sm">Made with ❤️ for Gachon University</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Main
// ============================================
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <Features />
      <HighlightSection />
      <SecondaryFeature />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
