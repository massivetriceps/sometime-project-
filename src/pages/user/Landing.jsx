// src/pages/user/Landing.jsx
// 가천대학교 시간표 생성 서비스 "알잘딱깔센" 랜딩페이지
import '../../styles/global.css';
import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Clock,
  Star,
  Smartphone,
  RefreshCw,
  Share2,
  Download,
  CheckCircle2,
  Quote,
  MousePointerClick, 
  ShieldCheck, 
  BrainCircuit,
  ShoppingCart,
  GraduationCap,
  TrendingUp,
  Heart,
  Mail,
  MessageSquare,  // Instagram 대신
  Video,          // Youtube 대신
  Code,           // Github 대신
} from 'lucide-react';

// ============================================
// SVG Path Data 
// ============================================
const svgPaths = {
  pf354c80: "M8.00945 3.33864C6.81713 3.33864 5.84648 4.31817 5.84648 5.51557C5.84648 6.27305 6.23545 6.94188 6.82282 7.33174C6.1134 7.56894 5.49955 8.01228 5.04932 8.59226C4.8004 8.40079 4.52226 8.24681 4.22242 8.13647C4.67711 7.79892 4.97423 7.25668 4.97423 6.64725C4.97423 5.63171 4.15289 4.80037 3.14351 4.80037C2.13413 4.80037 1.31279 5.63171 1.31279 6.64725C1.31279 7.25703 1.61016 7.79952 2.06523 8.13707C0.860443 8.58165 0 9.74563 0 11.1155V12.0777C0.000123313 12.1511 0.029466 12.2214 0.0814931 12.273C0.13352 12.3248 0.203919 12.3537 0.277275 12.3534H4.49901C4.50924 12.3545 4.51947 12.3551 4.5297 12.355H11.4894C11.4997 12.3551 11.51 12.3545 11.5201 12.3534H15.7422C15.894 12.3528 16.0169 12.2296 16.0172 12.0777V11.1155C16.0172 9.74563 15.1583 8.58165 13.9541 8.13695C14.4092 7.79952 14.7066 7.2569 14.7066 6.64713C14.7066 5.63159 13.8852 4.80025 12.8758 4.80025C11.8665 4.80025 11.0451 5.63159 11.0451 6.64713C11.0451 7.25656 11.3424 7.79889 11.7971 8.13635C11.4966 8.24694 11.2183 8.40142 10.9691 8.59336C10.519 8.01303 9.90605 7.56908 9.19666 7.33174C9.78387 6.94188 10.173 6.27305 10.173 5.51557C10.173 4.31817 9.20184 3.33864 8.00952 3.33864H8.00945ZM8.00945 3.89098C8.9012 3.89098 9.62009 4.61469 9.62009 5.51557C9.62009 6.4094 8.91241 7.12608 8.03053 7.13757C8.02351 7.13757 8.0166 7.13658 8.00945 7.13658C8.0023 7.13658 7.99552 7.13757 7.98837 7.13757C7.1065 7.12622 6.39929 6.40943 6.39929 5.51557C6.39929 4.61457 7.11758 3.89098 8.00933 3.89098H8.00945ZM3.14354 5.35267C3.8511 5.35267 4.42193 5.92695 4.42193 6.64722C4.42193 7.36267 3.85848 7.93448 3.15759 7.94224C3.1529 7.94224 3.14834 7.94175 3.14353 7.94175C3.13885 7.94175 3.13429 7.94224 3.12948 7.94224C2.42858 7.93447 1.86514 7.36254 1.86514 6.64722C1.86514 5.92698 2.43597 5.35267 3.14352 5.35267H3.14354ZM12.8757 5.35267C13.5832 5.35267 14.1541 5.92695 14.1541 6.64722C14.1541 7.36267 13.5906 7.93448 12.8897 7.94224C12.885 7.94224 12.8805 7.94175 12.8757 7.94175C12.871 7.94175 12.8664 7.94224 12.8616 7.94224C12.1607 7.93447 11.5973 7.36254 11.5973 6.64722C11.5973 5.92698 12.1681 5.35267 12.8757 5.35267H12.8757ZM7.9883 7.68987C7.99533 7.68999 8.00224 7.69086 8.00939 7.69086C8.01642 7.69086 8.02332 7.68987 8.03047 7.68987C9.79905 7.70121 11.2144 9.12878 11.2144 10.9158L11.2143 11.8025H4.80471V10.9158C4.80471 9.12862 6.2197 7.70123 7.98805 7.68987H7.9883ZM3.12239 8.49521C3.12942 8.49533 3.13633 8.49619 3.14348 8.49619C3.15063 8.49619 3.15741 8.49521 3.16456 8.49521C3.76275 8.50001 4.30868 8.70628 4.74338 9.05136C4.43233 9.60174 4.25244 10.237 4.25244 10.916V11.8006H0.552112V11.1155C0.552112 9.66309 1.69402 8.50654 3.12233 8.49508L3.12239 8.49521ZM12.8545 8.49521C12.8617 8.49533 12.8685 8.49619 12.8756 8.49619C12.8828 8.49619 12.8895 8.49521 12.8967 8.49521C14.325 8.50655 15.4669 9.66325 15.4669 11.1156V11.8006H11.7647L11.7646 10.916C11.7646 10.2374 11.5852 9.60259 11.2747 9.05234C11.7096 8.70677 12.2559 8.5 12.8546 8.49521H12.8545Z",
};

// ============================================
// TimetableGrid Component
// ============================================
function TimetableGrid() {
  const everytimeSlots = [
    { day: '월', start: '09:00', end: '12:00', name: '블록체인개론', room: 'AI관-408', color: '#D68677' },
    { day: '월', start: '12:00', end: '14:00', name: '빅데이터프로그래밍', room: 'AI관-302', color: '#C5B376' },
    { day: '월', start: '15:00', end: '17:00', name: '음악감상 및 비평 (실시간화상강의)', room: '화상강의강의실(가상)', color: '#B4D68A' },
    { day: '화', start: '09:00', end: '12:00', name: '종합프로젝트(캡스톤디자인)', room: 'AI관-508', color: '#82B2A7' },
    { day: '화', start: '13:00', end: '14:00', name: '빅데이터프로그래밍', room: 'AI관-302', color: '#C5B376' },
    { day: '화', start: '15:00', end: '17:00', name: '지성학I (실시간화상강의)(P/NP)', room: '화상강의강의실(가상)', color: '#8CA8D6' },
    { day: '수', start: '09:00', end: '12:00', name: '디지털 미디어 리터러시 (실시간화상강의)', room: '화상강의강의실(가상)', color: '#D6A677' },
    { day: '목', start: '11:00', end: '13:00', name: '가정과육아 (실시간화상강의)', room: '화상강의강의실(가상)', color: '#988AD6' },
  ];

  const days = ['월', '화', '수', '목', '금'];
  const startHour = 9;
  const endHour = 19; 
  const hourHeight = 65; // 1시간당 높이 (약간 늘려서 가독성 확보)

  const getTimeInfo = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h + m / 60;
  };

  return (
    <div className="bg-[#121212] rounded-lg p-3 font-sans max-w-4xl mx-auto shadow-2xl border border-[#222]">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-[40px_repeat(5,1fr)] border-b border-[#222]">
        <div className="h-10"></div>
        {days.map(day => (
          <div key={day} className="text-center text-[12px] font-bold text-[#777] leading-10 border-l border-[#222]">
            {day}
          </div>
        ))}
      </div>

      {/* 본체 레이아웃 */}
      <div className="grid grid-cols-[40px_repeat(5,1fr)] relative" style={{ height: (endHour - startHour) * hourHeight }}>
        
        {/* 가로 시간 구분선 & 라벨 */}
        {Array.from({ length: endHour - startHour + 1 }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="text-[11px] text-[#555] text-right pr-3" style={{ position: 'absolute', top: i * hourHeight - 8, width: '40px' }}>
              {startHour + i}
            </div>
            {/* 배경 가로선 */}
            <div 
              className="col-start-2 col-span-5 border-t border-[#1f1f1f] w-full" 
              style={{ position: 'absolute', top: i * hourHeight, height: '1px' }} 
            />
          </React.Fragment>
        ))}

        {/* 요일별 세로 영역 분리 (과목 배치 핵심) */}
        <div className="absolute inset-0 left-[40px] grid grid-cols-5 h-full">
          {days.map((day, dIdx) => (
            <div key={day} className="relative h-full border-l border-[#1f1f1f]">
              {everytimeSlots.filter(s => s.day === day).map((slot, sIdx) => {
                const top = (getTimeInfo(slot.start) - startHour) * hourHeight;
                const height = (getTimeInfo(slot.end) - getTimeInfo(slot.start)) * hourHeight;
                
                return (
                  <div
                    key={sIdx}
                    className="absolute left-[1px] right-[1px] p-2 flex flex-col shadow-inner transition-all hover:brightness-110"
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      backgroundColor: slot.color,
                      borderLeft: '3px solid rgba(0,0,0,0.1)',
                      borderRadius: '2px'
                    }}
                  >
                    <span className="text-white text-[11px] font-bold leading-tight mb-1">
                      {slot.name}
                    </span>
                    <span className="text-white/80 text-[10px] leading-tight truncate">
                      {slot.room}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 메모 섹션 */}
      <div className="mt-4 pt-3 border-t border-[#222] text-[11px] text-[#777] flex justify-between px-2">
        <div className="flex gap-4">
          <span className="font-medium text-[#999]">사회봉사1 (P/NP)</span>
        </div>
        <span className="italic opacity-50 text-[9px]">Gachon Univ. Sometime</span>
      </div>
    </div>
  );
}

// ============================================
// Navbar Component
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
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">알</span>
            </div>
            <span className="font-bold text-xl text-foreground">알잘딱깔표</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              시간표 만들기
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-foreground/80 hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              시간표 만들기
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================
// HeroSection Component
// ============================================
function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              가천대학교 공식 시간표 생성기
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              시간표, 이제
              <br />
              고민하지 말고 맡겨.
            </h1>

            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl">
              여러분의 선호 조건을 모두 반영할 수 있습니다 
               <br />
              공강요일, 온라인 강의 선호, 오르막 회피까지 모두 고려한 완벽한 시간표를 만들어드립니다<div className=""></div>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-all hover:shadow-lg flex items-center justify-center gap-2 group">
                시간표 만들기
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-background border-2 border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-muted transition-colors">
                사용법 보기
              </button>
            </div>

            {/* Stats */}
      
          </motion.div>

          {/* Right Content - Timetable */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
            <div className="relative">
              <TimetableGrid compact={true} />

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Features Component
// ============================================
function Features() {
  const features = [
    {
      title: '개인선호 맞춤형 조건 반영',
      description: '단순한 공강 설정을 넘어섭니다. 선호하는 시간대는 물론, 연강 시 불가능한 건물 이동 동선 및 오르막 회피까지 계산해 나만의 최적화된 시간표를 조립합니다.',
      iconBg: '#e8f5e9',
      iconColor: '#103E13',
    },
    {
      title: '직관적인 졸업 요건 대시보드',
      description: '복잡한 졸업 규정, 더 이상 헤매지 마세요. 내 기수강 내역을 분석해 졸업까지 남은 학점과 필수 과목을 한눈에 알기 쉽게 시각화해 드립니다.',
      iconBg: '#e3f2fd',
      iconColor: '#0d47a1',
    },
    {
      title: '빠른 생성',
      description: '아무리 복잡한 조건이라도 문제없습니다. 자체 CSP 엔진이 수백 개의 경우의 수를 즉시 비교하여 가장 완벽한 결과물을 제공합니다.',
      iconBg: '#fff3e0',
      iconColor: '#e65100',
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">왜 알잘딱깔표인가요?</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            수동으로 시간표를 짜던 시대는 끝났습니다. 이제 더 스마트하게 준비하세요.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white flex flex-col gap-2 items-center px-8 py-6 rounded-lg shadow-[0px_2px_4px_0px_rgba(171,190,209,0.2)] hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex flex-col gap-4 items-center mb-2">
                <div className="h-[46px] relative w-[54px]">
                  <div className="absolute flex h-[40px] items-center justify-center left-[12px] top-[5px] w-[41px]">
                    <div className="flex-none rotate-180">
                      <div
                        style={{ backgroundColor: feature.iconBg }}
                        className="h-[40px] rounded-bl-sm rounded-br-md rounded-tl-2xl rounded-tr-sm w-[41px]"
                      />
                    </div>
                  </div>
                  <div className="absolute left-0 size-[40px] top-0">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0256 16.0256">
                      <g>
                        <path d={svgPaths.pf354c80} fill={feature.iconColor} />
                      </g>
                    </svg>
                  </div>
                </div>
                <h3 className="font-bold text-[#4d4d4d] text-base text-center">{feature.title}</h3>
              </div>
              <p className="font-normal text-[#717171] text-sm text-center leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// StatsSection Component
// ============================================


// ============================================
// SecondaryFeature Component
// ============================================
function SecondaryFeature() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-32">
        {/* Feature 1: 장바구니 기능 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
              <ShoppingCart className="w-4 h-4" />
              장바구니 기능
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              절대 포기할 수 없는<br />
              1순위 과목 사수하기
            </h2>
            
            <p className="text-lg text-foreground/70 leading-relaxed">
              이번 학기에 무조건 들어야 하는 전공 P-프로젝트나, '제국주의 시대의 역사' 같은 인기 꿀교양 과목이 있나요? 장바구니에 담아 '최우선'으로 설정하면, 엔진이 해당 과목을 뼈대 삼아 나머지 시간표를 완벽하게 조립합니다.
            </p>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* 이미지는 직접 추가하세요 */}
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800"
                alt="장바구니 기능"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>

        {/* Feature 2: 졸업요건 대시보드 */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* 이미지는 직접 추가하세요 */}
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                alt="졸업요건 대시보드"
                className="w-full h-auto"
              />
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 order-2 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
              <GraduationCap className="w-4 h-4" />
              졸업요건 대시보드
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              입학년도별 복잡한 졸업 규정?<br />
              대시보드 하나로 종결.
            </h2>
            
            <p className="text-lg text-foreground/70 leading-relaxed">
              입학년도마다 달라지는 복잡한 요건들, 일일이 찾아볼 필요 없습니다. 특히 21학번부터 적용되는 까다로운 필수 이수 학점이나 영역별 교양 충족 여부까지, 내 기수강 내역을 바탕으로 남은 학점을 대시보드에서 직관적으로 트래킹하세요.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
// ============================================
// HighlightSection Component
// ============================================
function HighlightSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: '기본 정보 입력',
      description: '컴퓨터공학과 21학번, 이번 학기 목표는 18학점! 썸타임에 나의 기본 학사 정보를 가볍게 셋팅합니다.',
    },
    {
      number: 2,
      title: '맞춤 조건 우선순위 랭킹',
      description: '공강 요일이 가장 중요한가요, 아니면 동선 최소화가 먼저인가요? 나에게 가장 중요한 조건의 순위를 직관적으로 드래그하여 결정하세요.',
    },
    {
      number: 3,
      title: '디테일한 선호 조건 응답',
      description: '무거운 17인치 랩탑 가방을 메고 가파른 오르막길을 오르기 싫다면? 원하는 시간대부터 피하고 싶은 동선까지 꼼꼼하게 체크합니다.',
    },
    {
      number: 4,
      title: '3초 만에 최적화 시간표 생성',
      description: '복잡한 경우의 수는 썸타임의 CSP 엔진이 계산합니다. 클릭 한 번으로 내 조건에 완벽히 부합하는 시간표가 완성됩니다.',
    },
    {
      number: 5,
      title: 'AI 맞춤형 코멘트 확인',
      description: '당신의 선호를 분석한 AI가 시간표마다 맞춤 코멘트를 작성해드립니다. \'화요일 공강으로 여유로운 한 주\', \'최소 동선으로 체력 절약\' 같은 친절한 설명을 확인하세요.',
    },
  ];

  return (
    <section id="howto" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            이렇게 사용해요
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            5단계로 완성하는<br />완벽한 시간표
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            복잡한 조건 설정도 직관적으로, 3초 만에 최적의 시간표를 만나보세요
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="px-8 pt-8 pb-6">
            <div className="relative">
              {/* Background Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
              
              {/* Active Progress Line */}
              <div 
                className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              />

              {/* Step Circles */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    onClick={() => setActiveStep(index)}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        index <= activeStep
                          ? 'bg-primary text-white shadow-lg scale-110'
                          : 'bg-white border-2 border-gray-300 text-gray-400 group-hover:border-primary/50'
                      }`}
                    >
                      {step.number}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium transition-colors duration-300 hidden sm:block ${
                        index === activeStep ? 'text-primary' : 'text-gray-400'
                      }`}
                    >
                      Step {step.number}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 pb-8 pt-4">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[180px]"
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {steps[activeStep].title}
              </h3>
              <p className="text-lg text-foreground/70 leading-relaxed">
                {steps[activeStep].description}
              </p>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                이전
              </button>

              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeStep ? 'bg-primary w-6' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {activeStep === steps.length - 1 ? (
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all hover:shadow-lg flex items-center gap-2 group">
                  지금 시작하기
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                  className="px-6 py-2 rounded-lg font-medium text-primary hover:bg-primary/10 transition-all"
                >
                  다음
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


// ============================================
// Testimonial Component
// ============================================


// ============================================
// SocialProof Component
// ============================================
function FAQSection() {
  const faqs = [
    {
      question: '수강신청을 대신 해주나요?',
      answer: '아닙니다! 썸타임은 수강신청 전 완벽한 계획을 돕는 추천 도구입니다. 실제 수강신청은 학교 시스템에서 직접 하셔야 합니다.',
    },
    {
      question: '학교 시스템과 연동되나요?',
      answer: '아닙니다. 개인정보나 학교 행정 시스템 연동 없이, 공개된 수강편람 엑셀 데이터를 읽기 전용으로만 안전하게 활용합니다.',
    },
    {
      question: 'AI가 시간표를 짜주나요?',
      answer: '시간표의 뼈대는 수학적 알고리즘(CSP)이 정확하게 생성합니다. AI는 그 결과를 사람이 읽기 좋게 설명하는 역할만 수행합니다.',
    },
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">자주 묻는 질문 (FAQ)</h2>
          <p className="text-foreground/70">알잘딱깔표에 대해 가장 많이 주시는 오해와 진실을 모아봤어요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, index) => {
            return (
              <div
                key={index}
                className="bg-background rounded-xl p-8 text-center hover:shadow-lg transition-shadow border border-border flex flex-col justify-center"
              >
                <div className="text-lg font-bold text-foreground mb-4 break-keep">
                  Q. {faq.question}
                </div>
                <div className="text-sm text-foreground/70 leading-relaxed break-keep">
                  A. {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


// ============================================
// CTASection Component
// ============================================
function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold">
            
            지금 바로 시작하세요
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            시간표 고민은 이제 그만,
            <br />
            3초면 충분합니다
          </h2>

          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
           복잡한 시간표 계획을 단 몇 번의 클릭으로 해결하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="bg-primary-foreground text-primary px-10 py-5 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl flex items-center justify-center gap-2 group">
              지금 시간표 만들기
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          
          </div>

    
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// Footer Component
// ============================================
function Footer() {
  const links = {
    product: [
      { label: '기능', href: '#features' },
      { label: '사용법', href: '#howto' },
      { label: '가격', href: '#pricing' },
      { label: 'FAQ', href: '#faq' },
    ],
    company: [
      { label: '팀 소개', href: '#' },
      { label: '블로그', href: '#' },
      { label: '채용', href: '#' },
      { label: '문의하기', href: '#' },
    ],
    legal: [
      { label: '이용약관', href: '#' },
      { label: '개인정보처리방침', href: '#' },
      { label: '쿠키 정책', href: '#' },
    ],
  };

const socials = [
  { icon: Mail, href: 'mailto:contact@aljalddakgalsaen.com', label: 'Email' },
  { icon: MessageSquare, href: '#', label: 'Instagram' },
  { icon: Video, href: '#', label: 'Youtube' },
  { icon: Code, href: '#', label: 'Github' },
];

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">알</span>
              </div>
              <span className="font-bold text-xl text-foreground">알잘딱깔표</span>
            </div>
            <p className="text-foreground/70 text-sm mb-6 max-w-sm">
              가천대학교 학생들을 위한 스마트 시간표 생성 서비스. 더 이상 시간표로 고민하지 마세요.
            </p>
            <div className="flex items-center gap-4">
              {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-primary transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">제품</h4>
            <ul className="space-y-3">
              {links.product.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">회사</h4>
            <ul className="space-y-3">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">법적 고지</h4>
            <ul className="space-y-3">
              {links.legal.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-foreground/60 text-sm">© 2026 알잘딱깔센. All rights reserved.</p>
          <p className="text-foreground/60 text-sm">Made with ❤️ for Gachon University</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Main Landing Page Component
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
