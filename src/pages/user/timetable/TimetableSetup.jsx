import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, CalendarDays, Clock, Mountain, Laptop, GraduationCap, ChevronUp, ChevronDown, User, BookOpen } from 'lucide-react';
import { useTimetable } from '../../../context/TimetableContext';
import { GachonLogo } from '../../../components/ui/GachonLogo';
import { useAuth } from '../../../context/AuthContext';

const DAYS = ['월', '화', '수', '목', '금'];
const DAY_FULL = { '월': '월요일', '화': '화요일', '수': '수요일', '목': '목요일', '금': '금요일' };

const CREDIT_OPTIONS = [
  '9학점 이하',
  '10학점 ~ 12학점',
  '13학점 ~ 15학점',
  '16학점 ~ 18학점',
  '18학점 ~ 21학점',
  '22학점 이상',
];

const DEFAULT_COND = {
  preferredFreeDays: [],
  avoidMorningClasses: false,
  avoidUphill: false,
  preferOnline: false,
  creditRange: '',
  additionalNotes: '',
};

const INIT_PRIORITIES = [
  { id: 'freeDay',  label: '공강 요일',       icon: <CalendarDays size={16} />, color: '#4F7CF3', bg: '#E8F0FF' },
  { id: 'hills',   label: '오르막 회피',      icon: <Mountain size={16} />,     color: '#2EC4B6', bg: '#d1faf5' },
  { id: 'online',  label: '온라인 강의 선호', icon: <Laptop size={16} />,       color: '#A78BFA', bg: '#ede9fe' },
  { id: 'morning', label: '오전 수업 선호도', icon: <Clock size={16} />,        color: '#d4a017', bg: 'rgba(244,213,141,0.3)' },
];

const Q_OPTIONS = {
  freeDay:  { title: '공강 요일 선택',      desc: '가장 원하는 공강 요일을 선택해주세요.',         options: ['월요일', '화요일', '수요일', '목요일', '금요일', '난 5일 내내 학교 다닐래'], multi: true },
  hills:    { title: '오르막 회피 여부',    desc: '가천대 특유의 오르막길 이동, 어떻게 할까요?',   options: ['무조건 평지 건물 위주로', '운동삼아 오르막도 감수함'], multi: false },
  online:   { title: '싸강(온라인) 선호도', desc: '온라인 강의 비중을 어떻게 설정할까요?',         options: ['최소 1개는 무조건 포함', '전면 대면 강의 선호'], multi: false },
  morning:  { title: '오전 수업 선호도',    desc: '1교시(오전 9시) 수업 감당 가능하신가요?',       options: ['절대 불가 (10시 이후 시작)', '아침형 인간 (1교시 환영)'], multi: false },
};

function Toggle({ checked, onChange, color = '#4F7CF3' }) {
  return (
    <button onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 999, background: checked ? color : '#E5E7EB', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  );
}

export default function TimetableSetup() {
  const navigate = useNavigate();
  const { setConditions, setIsGenerating } = useTimetable();
  const { user } = useAuth();

  const [globalStep, setGlobalStep] = useState(1);
  const [dynamicStep, setDynamicStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: user?.name || '',
    department: user?.department || '컴퓨터공학과',
    studentId: user?.studentId || '21',
  });
  const [priorities, setPriorities] = useState(INIT_PRIORITIES);
  const [answers, setAnswers] = useState({ freeDay: [], hills: '', online: '', morning: '' });
  const [cond, setCond] = useState(DEFAULT_COND);
  const [submitting, setSubmitting] = useState(false);

  const s = { fontFamily: 'Pretendard, sans-serif' };
  const card = { background: 'white', borderRadius: 16, border: '1px solid #E8F0FF', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 28 };
  const iconBox = (bg, icon) => (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
  );

  const STEP_LABELS = ['기본 정보', '우선순위', '상세 조건', '학점', '확인'];
  const totalSteps = 5;

  const handleNext = () => {
    if (globalStep === 3) {
      if (dynamicStep < priorities.length - 1) setDynamicStep(p => p + 1);
      else setGlobalStep(4);
    } else if (globalStep < totalSteps) {
      setGlobalStep(p => p + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (globalStep === 3) {
      if (dynamicStep > 0) setDynamicStep(p => p - 1);
      else setGlobalStep(2);
    } else if (globalStep > 1) {
      setGlobalStep(p => p - 1);
    }
  };

  const movePriority = (index, dir) => {
    const arr = [...priorities];
    if (dir === 'up' && index > 0) [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    if (dir === 'down' && index < arr.length - 1) [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
    setPriorities(arr);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setConditions({ ...cond, priorities, answers });
    setIsGenerating(true);
    setTimeout(() => navigate('/timetable/result'), 400);
  };

  const handleOptionClick = (currentId, opt) => {
    if (currentId === 'freeDay') {
      const prev = answers.freeDay;
      const next = prev.includes(opt) ? prev.filter(d => d !== opt) : [...prev, opt];
      setAnswers({ ...answers, freeDay: next });
    } else {
      setAnswers({ ...answers, [currentId]: opt });
    }
  };

  const isSelected = (currentId, opt) => {
    if (currentId === 'freeDay') return answers.freeDay.includes(opt);
    return answers[currentId] === opt;
  };

  const stepProgress = globalStep === 3
    ? ((2 + (dynamicStep + 1) / priorities.length) / totalSteps) * 100
    : (globalStep / totalSteps) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', ...s }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid #E8F0FF', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <GachonLogo size={32} />
            <span style={{ fontSize: 20, fontWeight: 700, color: '#1F2937' }}>Sometime</span>
          </Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#6B7280', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> 홈으로
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px 96px' }}>

        {/* 프로그레스 바 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            {STEP_LABELS.map((label, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: i + 1 === globalStep ? 700 : 400, color: i + 1 <= globalStep ? '#4F7CF3' : '#9CA3AF' }}>{label}</span>
            ))}
          </div>
          <div style={{ height: 6, background: '#E8F0FF', borderRadius: 999 }}>
            <div style={{ height: 6, background: '#4F7CF3', borderRadius: 999, width: stepProgress + '%', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* ── STEP 1: 기본 정보 ── */}
        {globalStep === 1 && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              {iconBox('#E8F0FF', <User size={20} color="#4F7CF3" />)}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>기본 정보를 알려주세요</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>시간표 생성에 활용할 기본 정보를 입력해주세요</p>
              </div>
            </div>
            <div style={{ height: 1, background: '#F3F4F6', margin: '20px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>이름</label>
                <input type="text" value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} placeholder="이름을 입력하세요"
                  style={{ borderRadius: 12, border: '1px solid #E8F0FF', padding: '11px 14px', fontSize: 14, outline: 'none', background: '#FAFBFF', ...s }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>학과</label>
                  <input type="text" value={userInfo.department} onChange={e => setUserInfo({ ...userInfo, department: e.target.value })}
                    style={{ borderRadius: 12, border: '1px solid #E8F0FF', padding: '11px 14px', fontSize: 14, outline: 'none', background: '#FAFBFF', ...s }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>학번 (2글자)</label>
                  <input type="text" value={userInfo.studentId} onChange={e => setUserInfo({ ...userInfo, studentId: e.target.value })} placeholder="예: 21"
                    style={{ borderRadius: 12, border: '1px solid #E8F0FF', padding: '11px 14px', fontSize: 14, outline: 'none', background: '#FAFBFF', ...s }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: 우선순위 설정 ── */}
        {globalStep === 2 && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              {iconBox('#E8F0FF', <Sparkles size={20} color="#4F7CF3" />)}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>조건 우선순위 설정</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>시간표 생성 시 중요하게 고려할 순서대로 배치해주세요</p>
              </div>
            </div>
            <div style={{ height: 1, background: '#F3F4F6', margin: '20px 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {priorities.map((item, index) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, border: '1px solid #E8F0FF', background: '#FAFBFF', padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: '#4F7CF3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>{index + 1}</div>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>{item.icon}</div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#1F2937' }}>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => movePriority(index, 'up')} disabled={index === 0}
                      style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #E8F0FF', background: 'white', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronUp size={14} color="#6B7280" />
                    </button>
                    <button onClick={() => movePriority(index, 'down')} disabled={index === priorities.length - 1}
                      style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid #E8F0FF', background: 'white', cursor: index === priorities.length - 1 ? 'not-allowed' : 'pointer', opacity: index === priorities.length - 1 ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronDown size={14} color="#6B7280" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: 동적 질문 ── */}
        {globalStep === 3 && (() => {
          const currentId = priorities[dynamicStep].id;
          const q = Q_OPTIONS[currentId];
          const currentPriority = priorities[dynamicStep];
          return (
            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                {iconBox(currentPriority.bg, <span style={{ color: currentPriority.color }}>{currentPriority.icon}</span>)}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: currentPriority.color, marginBottom: 2 }}>{dynamicStep + 1}순위 조건</div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>{q.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>{q.desc}</p>
                    {q.multi && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#4F7CF3', background: '#E8F0FF', padding: '2px 8px', borderRadius: 999, flexShrink: 0 }}>
                        중복 선택 가능
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: '#F3F4F6', margin: '20px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {q.options.map(opt => {
                  const sel = isSelected(currentId, opt);
                  return (
                    <button key={opt} onClick={() => handleOptionClick(currentId, opt)}
                      style={{ textAlign: 'left', padding: '14px 18px', borderRadius: 12, border: sel ? `2px solid ${currentPriority.color}` : '1px solid #E8F0FF', background: sel ? currentPriority.bg : 'white', cursor: 'pointer', fontSize: 14, fontWeight: sel ? 700 : 400, color: sel ? currentPriority.color : '#1F2937', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...s }}>
                      <span>{opt}</span>
                      {sel && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: currentPriority.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 14, fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                {dynamicStep + 1} / {priorities.length} 질문
              </div>
            </div>
          );
        })()}

        {/* ── STEP 4: 학점 범위 ── */}
        {globalStep === 4 && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              {iconBox('#E8F0FF', <GraduationCap size={20} color="#4F7CF3" />)}
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: 0 }}>학점 범위 설정</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>이번 학기에 수강할 학점 범위를 선택해주세요</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CREDIT_OPTIONS.map(opt => {
                const sel = cond.creditRange === opt;
                return (
                  <button key={opt} onClick={() => setCond(p => ({ ...p, creditRange: sel ? '' : opt }))}
                    style={{ textAlign: 'left', padding: '14px 18px', borderRadius: 12, border: sel ? '2px solid #4F7CF3' : '1px solid #E8F0FF', background: sel ? '#E8F0FF' : '#FAFAFA', cursor: 'pointer', fontSize: 14, fontWeight: sel ? 700 : 400, color: sel ? '#4F7CF3' : '#1F2937', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', ...s }}>
                    <span>{opt}</span>
                    {sel && (
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#4F7CF3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 5: 확인 및 생성 ── */}
        {globalStep === 5 && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              {iconBox('#d1faf5', <BookOpen size={20} color="#2EC4B6" />)}
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>설정 확인</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>입력한 조건을 확인하고 시간표를 생성하세요</p>
              </div>
            </div>
            <div style={{ height: 1, background: '#F3F4F6', margin: '20px 0' }} />

            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 18px', marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', margin: '0 0 8px', letterSpacing: 1 }}>기본 정보</p>
              <p style={{ fontSize: 14, color: '#1F2937', margin: 0 }}>{userInfo.name || '(미입력)'} · {userInfo.department} · {userInfo.studentId}학번</p>
            </div>

            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 18px', marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', margin: '0 0 10px', letterSpacing: 1 }}>조건 우선순위</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {priorities.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 20, height: 20, borderRadius: 6, background: '#4F7CF3', color: 'white', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#1F2937', fontWeight: 500 }}>{p.label}</span>
                    {(Array.isArray(answers[p.id]) ? answers[p.id].length > 0 : answers[p.id]) && (
                      <span style={{ fontSize: 12, color: '#6B7280', background: '#E8F0FF', padding: '1px 8px', borderRadius: 999 }}>
                        {Array.isArray(answers[p.id]) ? answers[p.id].join(', ') : answers[p.id]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 18px', marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', margin: '0 0 10px', letterSpacing: 1 }}>상세 설정</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>학점 범위</span>
                  <span style={{ fontWeight: 500, color: '#1F2937' }}>{cond.creditRange || '미선택'}</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#E8F0FF', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#4F7CF3' }}>
              ✨ 위 조건으로 AI가 최적의 시간표를 생성합니다
            </div>
          </div>
        )}

        {/* 하단 네비게이션 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
          <button onClick={handlePrev} disabled={globalStep === 1}
            style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 12, padding: '12px 20px', fontSize: 14, color: globalStep === 1 ? '#D1D5DB' : '#6B7280', background: 'white', border: `1px solid ${globalStep === 1 ? '#F3F4F6' : '#E8F0FF'}`, cursor: globalStep === 1 ? 'not-allowed' : 'pointer', ...s }}>
            <ArrowLeft size={15} /> 이전
          </button>
          <button onClick={handleNext} disabled={submitting}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: submitting ? '#9CA3AF' : '#4F7CF3', color: 'white', padding: '13px 36px', borderRadius: 999, fontWeight: 700, fontSize: 14, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: submitting ? 'none' : '0 4px 12px rgba(79,124,243,0.35)', transition: 'all 0.2s', ...s }}>
            {submitting ? '생성 중...' : globalStep === totalSteps ? '시간표 생성하기' : '다음'} {!submitting && <ArrowRight size={16} />}
          </button>
        </div>
      </main>
    </div>
  );
}
