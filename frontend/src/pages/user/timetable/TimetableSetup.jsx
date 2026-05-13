import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import useAuthStore from '../../../store/authStore';
const DAY_MASK    = { '월요일': 1, '화요일': 2, '수요일': 4, '목요일': 8, '금요일': 16 };
const DAY_EN      = { '월요일': 'MON', '화요일': 'TUE', '수요일': 'WED', '목요일': 'THU', '금요일': 'FRI' };
const DAY_EN_TO_KR = { MON: '월요일', TUE: '화요일', WED: '수요일', THU: '목요일', FRI: '금요일' };
const DAY_STR     = { '월요일': '월', '화요일': '화', '수요일': '수', '목요일': '목', '금요일': '금' };

export default function TimeTableG() {
  // --- [1. 상태 관리] ---
  const [globalStep, setGlobalStep] = useState(1);
  const [dynamicStep, setDynamicStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [cartCourses, setCartCourses] = useState([]);

  useEffect(() => {
    // 장바구니 로드
    api.get('/api/users/me/cart')
      .then(res => { if (res.data.resultType === 'SUCCESS') setCartCourses(res.data.success); })
      .catch(() => {});

    // 이전에 저장된 선호 설정 로드 → 폼 초기값 복원
    api.get('/api/users/me/preferences')
      .then(res => {
        if (res.data.resultType !== 'SUCCESS' || !res.data.success) return;
        const pref = res.data.success;

        // free_days: "FRI" / "MON,FRI" → KR 요일 배열
        const restoredFreeDays = pref.free_days
          ? pref.free_days.split(',').map(d => DAY_EN_TO_KR[d.trim()]).filter(Boolean)
          : [];

        setAnswers(prev => ({
          ...prev,
          freeDay: restoredFreeDays.length > 0 ? restoredFreeDays : prev.freeDay,
          hills: pref.avoid_uphill != null
            ? (pref.avoid_uphill ? '무조건 평지 건물 위주로' : '운동삼아 오르막도 감수함')
            : prev.hills,
          online: pref.prefer_online != null
            ? (pref.prefer_online ? '최소 1개는 무조건 포함' : '난 강의실이 좋은데')
            : prev.online,
        }));

        // credit_intensity → 목표 학점 역매핑
        if (pref.credit_intensity === 'RELAXED')   setTargetCredits(14);
        if (pref.credit_intensity === 'INTENSIVE')  setTargetCredits(20);
      })
      .catch(() => {});
  }, []);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [userInfo, setUserInfo] = useState({
    name:       user?.name       || '',
    department: user?.major_name || '컴퓨터공학과',
    studentId:  user?.student_id?.slice(2, 4) || '21',
  });
  const [grade, setGrade] = useState(user?.grade || null);
  const [semester, setSemester] = useState(null);
  
  const [priorities, setPriorities] = useState([
    { id: 'freeDay', label: '공강 요일' },
    { id: 'hills', label: '오르막 회피 여부' },
    { id: 'online', label: '온라인 강의 선호도' },
    { id: 'morning', label: '오전 수업 선호도' }
  ]);

  const [answers, setAnswers] = useState({
    freeDay: [],
    hills: '',
    online: '',
    morning: ''
  });
  const [targetCredits, setTargetCredits] = useState(18);

  const stepLabels = ['기본 정보 입력', '우선순위 설정', '세부 조건 설정', '결과 및 분석'];

  // --- [2. 핸들러 함수] ---
  const handleUserChange = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  const handleAnswerChange = (e) => setAnswers({ ...answers, [e.target.name]: e.target.value });

  // 🟢 복수 선택 및 단일 선택(5일 내내) 처리 로직
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setAnswers(prev => {
      let newFreeDays = [...prev.freeDay];
      if (checked) {
        if (value === '난 5일 내내 학교 다닐래') {
          // '5일 내내'를 선택하면 무조건 배열을 이것 하나로 덮어씌움 (다른 요일 날림)
          newFreeDays = [value];
        } else {
          // 다른 요일을 선택하면 '5일 내내'를 삭제하고 해당 요일 추가
          newFreeDays = newFreeDays.filter(day => day !== '난 5일 내내 학교 다닐래');
          newFreeDays.push(value);
        }
      } else {
        // 체크 해제 시 해당 요일 삭제
        newFreeDays = newFreeDays.filter(day => day !== value);
      }
      return { ...prev, freeDay: newFreeDays };
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(priorities);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPriorities(items);
  };
  
  const handleNext = async () => {
    if (globalStep === 3) {
      if (dynamicStep < priorities.length - 1) {
        setDynamicStep(prev => prev + 1);
      } else {
        // step 4로 넘어가기 전 장바구니 로드
        try {
          const res = await api.get('/api/users/me/cart');
          if (res.data.resultType === 'SUCCESS') setCartCourses(res.data.success);
        } catch { setCartCourses([]); }
        setGlobalStep(4);
      }
    } else if (globalStep < 4) {
      setGlobalStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (globalStep === 3) {
      if (dynamicStep > 0) {
        setDynamicStep(prev => prev - 1);
      } else {
        setGlobalStep(2);
      }
    } else if (globalStep > 1) {
      setGlobalStep(prev => prev - 1);
    }
  };

  // --- [3. 동적 질문 렌더링 함수] ---
  const renderDynamicQuestion = () => {
    const currentQ = priorities[dynamicStep].id;
    
    switch (currentQ) {
      case 'freeDay': {
        const isWarning = answers.freeDay.length >= 3 && !answers.freeDay.includes('난 5일 내내 학교 다닐래');
        return (
          <div style={styles.card}>
            <h3>{dynamicStep + 1}순위 조건: 공강 요일</h3>
            <p style={styles.desc}>
              가장 원하는 공강 요일을 선택해주세요. (복수선택 가능)<br/>
              {isWarning && (
                <span style={{ color: '#EF4444', fontSize: '13px', display: 'block', marginTop: '8px', fontWeight: 'bold' }}>
                  3개 이상 선택 시 만족하는 시간표가 없거나, 연산 시간이 오래 걸릴 수 있습니다.
                </span>
              )}
            </p>
            {['월요일', '화요일', '수요일', '목요일', '금요일', '난 5일 내내 학교 다닐래'].map(opt => {
              const isChecked = answers.freeDay.includes(opt);
              const hasConflict = isChecked && cartCourses.some(c =>
                c.schedules?.some(s => s.day_of_week === DAY_STR[opt])
              );
              return (
                <div key={opt}>
                  <label style={isChecked ? styles.radioActive : styles.radio}>
                    <input type="checkbox" value={opt} onChange={handleCheckboxChange} checked={isChecked} style={{display:'none'}} />
                    {opt}
                  </label>
                  {hasConflict && (
                    <p style={{ color: '#F59E0B', fontSize: '12px', margin: '-4px 0 8px 6px' }}>
                      ⚠️ 장바구니에 {DAY_STR[opt]}요일 수업이 있어 공강이 보장되지 않을 수 있어요.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
      case 'hills':
        return (
          <div style={styles.card}>
            <h3>{dynamicStep + 1}순위 조건: 오르막 회피</h3>
            <p style={styles.desc}>무당이 타기 귀찮을 때, 오르막길을 어떻게 피할까요?</p>
            {['무조건 평지 건물 위주로', '운동삼아 오르막도 감수함'].map(opt => (
              <label key={opt} style={answers.hills === opt ? styles.radioActive : styles.radio}>
                <input type="radio" name="hills" value={opt} onChange={handleAnswerChange} checked={answers.hills === opt} style={{display:'none'}} />
                {opt}
              </label>
            ))}
          </div>
        );
      case 'online':
        return (
          <div style={styles.card}>
            <h3>{dynamicStep + 1}순위 조건: 싸강(온라인) 선호도</h3>
            <p style={styles.desc}>온라인 강의 비중을 어떻게 설정할까요?</p>
            {['최소 1개는 무조건 포함', '2개 이상', '난 강의실이 좋은데'].map(opt => (
              <label key={opt} style={answers.online === opt ? styles.radioActive : styles.radio}>
                <input type="radio" name="online" value={opt} onChange={handleAnswerChange} checked={answers.online === opt} style={{display:'none'}} />
                {opt}
              </label>
            ))}
          </div>
        );
      case 'morning': {
        const hasFirstPeriod = cartCourses.some(c => c.schedules?.some(s => s.start_period === 1));
        return (
          <div style={styles.card}>
            <h3>{dynamicStep + 1}순위 조건: 오전 수업 선호도</h3>
            <p style={styles.desc}>1교시(오전 9시) 수업 감당 가능하신가요?</p>
            {['절대 불가 (10시 이후 시작)', '아침형 인간 (1교시 환영)'].map(opt => (
              <label key={opt} style={answers.morning === opt ? styles.radioActive : styles.radio}>
                <input type="radio" name="morning" value={opt} onChange={handleAnswerChange} checked={answers.morning === opt} style={{display:'none'}} />
                {opt}
              </label>
            ))}
            {answers.morning === '절대 불가 (10시 이후 시작)' && hasFirstPeriod && (
              <p style={{ color: '#F59E0B', fontSize: '12px', marginTop: '8px' }}>
                ⚠️ 장바구니에 1교시 수업이 있어 아침 수업 회피가 보장되지 않을 수 있어요.
              </p>
            )}
          </div>
        );
      }
      default: return null;
    }
  };

  // --- [4. 전체 화면 렌더링] ---

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC', padding: '40px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#155DFC', fontWeight: 'bold' }}>
            <span>
              Step {globalStep}. {stepLabels[globalStep - 1]}
              {globalStep === 3 && (
                <span style={{ color: '#64748B', fontSize: '0.9em', marginLeft: '8px', fontWeight: 'normal' }}>
                  ({dynamicStep + 1}/{priorities.length})
                </span>
              )}
            </span>
            <span style={{ color: '#94A3B8' }}>{globalStep} / 4</span> 
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4].map(step => {
              let fillPercentage = '0%';
              if (globalStep > step) {
                fillPercentage = '100%';
              } else if (globalStep === step) {
                if (step === 3) {
                  fillPercentage = `${((dynamicStep + 1) / priorities.length) * 100}%`;
                } else {
                  fillPercentage = '100%'; 
                }
              }

              return (
                <div key={step} style={{ flex: 1, height: '6px', borderRadius: '4px', background: '#E2E8F0', overflow: 'hidden' }}>
                  <div style={{ width: fillPercentage, height: '100%', background: '#155DFC', transition: 'width 0.3s ease-in-out' }} />
                </div>
              );
            })}
          </div>
        </div>

        {globalStep === 1 && (
          <div style={styles.card}>
            <h2 style={{ marginBottom: '24px' }}>1. 기본 정보를 알려주세요</h2>
            <div style={styles.inputGroup}>
              <label style={styles.label}>이름</label>
              <input type="text" name="name" value={userInfo.name} onChange={handleUserChange} placeholder="이름 입력" style={styles.input} />
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ ...styles.inputGroup, flex: '1 1 120px' }}>
                <label style={styles.label}>학과</label>
                <input type="text" name="department" value={userInfo.department} onChange={handleUserChange} style={styles.input} />
              </div>
              <div style={{ ...styles.inputGroup, flex: '1 1 120px' }}>
                <label style={styles.label}>학번 (앞 2자리)</label>
                <input type="text" name="studentId" value={userInfo.studentId} onChange={handleUserChange} style={styles.input} />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>학년 / 학기</label>
              <select
                value={grade && semester ? `${grade}-${semester}` : ''}
                onChange={e => {
                  if (!e.target.value) { setGrade(null); setSemester(null); return; }
                  const [g, s] = e.target.value.split('-').map(Number);
                  setGrade(g); setSemester(s);
                }}
                style={{ ...styles.input, color: grade ? '#1e293b' : '#94A3B8', cursor: 'pointer' }}
              >
                <option value="">학기를 선택해주세요</option>
                {[1,2,3,4].flatMap(g => [1,2].map(s => (
                  <option key={`${g}-${s}`} value={`${g}-${s}`}>{g}학년 {s}학기</option>
                )))}
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>이번 학기 목표 학점</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => setTargetCredits(v => Math.max(12, v - 1))}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #CBD5E1', background: 'white', fontSize: '20px', cursor: 'pointer', color: '#475569', lineHeight: 1 }}
                >−</button>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <span style={{ fontSize: '28px', fontWeight: '700', color: '#155DFC' }}>{targetCredits}</span>
                  <span style={{ fontSize: '14px', color: '#64748B', marginLeft: '4px' }}>학점</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTargetCredits(v => Math.min(21, v + 1))}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #CBD5E1', background: 'white', fontSize: '20px', cursor: 'pointer', color: '#475569', lineHeight: 1 }}
                >+</button>
                <div style={{ flex: 1 }}>
                  <input
                    type="range" min="12" max="21" value={targetCredits}
                    onChange={e => setTargetCredits(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#155DFC' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    <span>12</span><span>21</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '6px 0 0' }}>
                장바구니 과목을 포함해 목표 학점에 맞춰 시간표가 구성됩니다
              </p>
            </div>
          </div>
        )}

        {globalStep === 2 && (
          <div style={styles.card}>
            <h2>2. 우선순위 설정</h2>
            <p style={styles.desc}>마우스로 항목을 잡아 원하는 순서로 옮겨주세요 (드래그 가능)</p>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="priorities">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {priorities.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              ...styles.priorityItem,
                              border: snapshot.isDragging ? '2px solid #155DFC' : '1px solid #E2E8F0',
                              background: snapshot.isDragging ? '#EFF6FF' : '#F8FAFC'
                            }}>
                            <span><strong style={{color:'#155DFC', marginRight:'12px'}}>{index+1}</strong>{item.label}</span>
                            <span style={{color:'#CBD5E1'}}>☰</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {globalStep === 3 && renderDynamicQuestion()}

        {globalStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={styles.card}>
              <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>✅ 설정 완료</h2>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
                아래 조건으로 시간표 3개(플랜 A/B/C)를 생성합니다. 확인 후 버튼을 눌러주세요.
              </p>

              {/* 우선순위 요약 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {priorities.map((p, i) => {
                  const val = p.id === 'freeDay'
                    ? (answers.freeDay.length > 0 ? answers.freeDay.join(', ') : '미선택')
                    : (answers[p.id] || '미선택');
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontWeight: 'bold', color: '#155DFC', fontSize: '13px', minWidth: '16px' }}>{i + 1}</span>
                      <span style={{ fontWeight: '600', color: '#334155', fontSize: '14px', minWidth: '120px' }}>{p.label}</span>
                      <span style={{ color: val === '미선택' ? '#94A3B8' : '#155DFC', fontSize: '13px', fontWeight: val === '미선택' ? 'normal' : '600' }}>
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 학년/학기 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600', color: '#155DFC', fontSize: '14px' }}>📅 학년/학기</span>
                <span style={{ fontWeight: '700', color: '#1E40AF', fontSize: '16px' }}>
                  {grade && semester ? `${grade}학년 ${semester}학기` : '미선택'}
                </span>
              </div>

              {/* 목표 학점 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE', marginBottom: '12px' }}>
                <span style={{ fontWeight: '600', color: '#155DFC', fontSize: '14px' }}>🎯 목표 학점</span>
                <span style={{ fontWeight: '700', color: '#1E40AF', fontSize: '16px' }}>{targetCredits}학점</span>
              </div>

              {/* 장바구니 과목 */}
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#334155', marginBottom: '10px' }}>
                  🛒 장바구니 담긴 과목 ({cartCourses.length}개) — 시간표에 최우선 반영
                </p>
                {cartCourses.length === 0 ? (
                  <div style={{ padding: '16px', background: '#FFF7ED', borderRadius: '10px', border: '1px solid #FED7AA', fontSize: '13px', color: '#92400E' }}>
                    ⚠️ 장바구니가 비어 있어요. 과목 검색에서 담아오면 시간표에 반영돼요.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {cartCourses.map((c, i) => (
                      <div key={c.course_id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#EFF6FF', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                        <div>
                          <span style={{ fontWeight: '600', color: '#1E40AF', fontSize: '14px' }}>{c.course_name}</span>
                          {c.professor && <span style={{ color: '#64748B', fontSize: '12px', marginLeft: '8px' }}>{c.professor}</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', background: '#DBEAFE', color: '#2563EB', padding: '2px 8px', borderRadius: '999px' }}>{c.classification}</span>
                          <span style={{ fontSize: '12px', color: '#64748B' }}>{c.credits}학점</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isGenerating && (
              <div style={{ ...styles.card, textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
                <p style={{ fontWeight: '600', color: '#155DFC', marginBottom: '6px' }}>CSP 엔진으로 시간표 생성 중...</p>
                <p style={{ color: '#64748B', fontSize: '13px' }}>잠시만 기다려주세요</p>
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <button 
            onClick={handlePrev} 
            disabled={globalStep === 1} 
            style={{ ...styles.btn, background: 'white', color: '#475569', border: '1px solid #CBD5E1', opacity: globalStep === 1 ? 0 : 1 }}
          >
            이전
          </button>
          
       <button
  onClick={async () => {
    if (globalStep === 4) {
      setIsGenerating(true);
      try {
        // UI 답변 → API 파라미터 매핑
        const freeDayMask = answers.freeDay
          .filter(d => d !== '난 5일 내내 학교 다닐래')
          .reduce((mask, day) => mask | (DAY_MASK[day] ?? 0), 0);

        const avoid_uphill = answers.hills === '무조건 평지 건물 위주로';
        const prefer_online = answers.online !== '' && answers.online !== '난 강의실이 좋은데';
        const allow_first = answers.morning === '아침형 인간 (1교시 환영)';

        const selectedDays = answers.freeDay
          .filter(d => d !== '난 5일 내내 학교 다닐래' && DAY_EN[d])
          .map(d => DAY_EN[d]);
        const free_days = selectedDays.length > 0 ? selectedDays.join(',') : null;

        try {
          await api.post('/api/users/me/preferences', {
            avoid_uphill,
            prefer_online,
            ...(free_days !== null && { free_days }),
          });
        } catch {
          // 선호조건 저장 실패는 시간표 생성을 막지 않음
        }

        await api.post('/api/users/me/timetables', {
          grade: grade ?? undefined,
          semester: semester ?? undefined,
          free_day_mask: freeDayMask,
          avoid_uphill,
          allow_first,
          prefer_online,
          target_credits: targetCredits,
        });

        navigate('/timetable/manage');
      } catch (err) {
        const reason = err.response?.data?.error?.reason;
        alert(reason || '시간표 생성 중 오류가 발생했습니다.');
      } finally {
        setIsGenerating(false);
      }
    } else {
      handleNext();
    }
  }}
  disabled={isGenerating}
  style={{ ...styles.btn, background: '#155DFC', color: 'white', opacity: isGenerating ? 0.7 : 1 }}
>
  {globalStep === 4 ? (isGenerating ? '⚙️ 생성 중...' : '🚀 지금 시간표 생성하기') : '다음 단계로 →'}
</button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  card: { background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  input: { width: '100%', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1' },
  desc: { color: '#64748B', fontSize: '14px', marginBottom: '20px' },
  priorityItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', marginBottom: '12px', borderRadius: '12px', cursor: 'grab' },
  radio: { display: 'block', padding: '16px', border: '1px solid #CBD5E1', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer' },
  radioActive: { display: 'block', padding: '16px', border: '2px solid #155DFC', background: '#EFF6FF', borderRadius: '12px', marginBottom: '8px', fontWeight: 'bold', color: '#155DFC' },
  btn: { padding: '12px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
  mockTimetable: { height: '200px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #C7D2FE' }
};