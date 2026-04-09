import React, { useState } from 'react';

export default function TimeTableG() {
  // --- [1. 상태 관리] ---
  const [globalStep, setGlobalStep] = useState(1); // 1~5 단계
  const [dynamicStep, setDynamicStep] = useState(0); // 3단계 내부 동적 질문 순서 (0~3)

  // 사용자 정보 (초기값 세팅)
  const [userInfo, setUserInfo] = useState({ 
    name: '', 
    department: '컴퓨터공학과', 
    studentId: '21' 
  });
  
  // 우선순위 항목 관리
  const [priorities, setPriorities] = useState([
    { id: 'freeDay', label: '공강 요일' },
    { id: 'hills', label: '오르막 회피 여부' },
    { id: 'online', label: '온라인 강의 선호도' },
    { id: 'morning', label: '오전 수업 선호도' }
  ]);

  // 사용자 답변 저장
  const [answers, setAnswers] = useState({
    freeDay: '',
    hills: '',
    online: '',
    morning: ''
  });

  // --- [2. 핸들러 함수] ---
  const handleUserChange = (e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  const handleAnswerChange = (e) => setAnswers({ ...answers, [e.target.name]: e.target.value });

  // 2단계: 우선순위 순서 변경 로직
  const movePriority = (index, direction) => {
    const newPrio = [...priorities];
    if (direction === 'up' && index > 0) {
      [newPrio[index - 1], newPrio[index]] = [newPrio[index], newPrio[index - 1]];
    } else if (direction === 'down' && index < newPrio.length - 1) {
      [newPrio[index + 1], newPrio[index]] = [newPrio[index], newPrio[index + 1]];
    }
    setPriorities(newPrio);
  };

  // 다음 버튼 로직 (가장 중요)
  const handleNext = () => {
    if (globalStep === 3) {
      // 3단계 안에서는 우선순위 4개를 다 돌 때까지 서브 스텝만 증가
      if (dynamicStep < priorities.length - 1) {
        setDynamicStep(prev => prev + 1);
      } else {
        setGlobalStep(4); // 4개 질문 다 끝나면 4단계(시간표 생성)로 이동
      }
    } else if (globalStep < 5) {
      setGlobalStep(prev => prev + 1);
    }
  };

  // 이전 버튼 로직
  const handlePrev = () => {
    if (globalStep === 3) {
      if (dynamicStep > 0) {
        setDynamicStep(prev => prev - 1);
      } else {
        setGlobalStep(2); // 3단계 첫 질문에서 뒤로가면 다시 2단계 우선순위 설정으로
      }
    } else if (globalStep > 1) {
      setGlobalStep(prev => prev - 1);
    }
  };

  // --- [3. 동적 질문 렌더링 함수] ---
  const renderDynamicQuestion = () => {
    const currentQ = priorities[dynamicStep].id;
    
    switch (currentQ) {
      case 'freeDay':
        return (
          <div style={styles.card}>
            <h3>{dynamicStep + 1}순위 조건: 공강 요일</h3>
            <p style={styles.desc}>가장 원하는 공강 요일을 선택해주세요.</p>
            {['월요일', '화요일', '수요일', '목요일', '금요일', '난 5일 내내 학교 다닐래'].map(opt => (
              <label key={opt} style={answers.freeDay === opt ? styles.radioActive : styles.radio}>
                <input type="radio" name="freeDay" value={opt} onChange={handleAnswerChange} checked={answers.freeDay === opt} style={{display:'none'}} />
                {opt}
              </label>
            ))}
          </div>
        );
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
            {['최소 1개는 무조건 포함', '전면 대면 강의 선호'].map(opt => (
              <label key={opt} style={answers.online === opt ? styles.radioActive : styles.radio}>
                <input type="radio" name="online" value={opt} onChange={handleAnswerChange} checked={answers.online === opt} style={{display:'none'}} />
                {opt}
              </label>
            ))}
          </div>
        );
      case 'morning':
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
          </div>
        );
      default: return null;
    }
  };

  // --- [4. 전체 화면 렌더링] ---
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#F8FAFC', padding: '40px 20px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        
        {/* 상단 프로그레스 바 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1,2,3,4,5].map(step => (
            <div key={step} style={{ flex: 1, height: '6px', borderRadius: '4px', background: globalStep >= step ? '#155DFC' : '#E2E8F0', transition: '0.3s' }} />
          ))}
        </div>

        {/* --- [Step 1: 기본 정보] --- */}
        {globalStep === 1 && (
          <div style={styles.card}>
            <h2 style={{ marginBottom: '24px' }}>1. 기본 정보를 알려주세요</h2>
            <div style={styles.inputGroup}>
              <label style={styles.label}>이름</label>
              <input type="text" name="name" value={userInfo.name} onChange={handleUserChange} placeholder="이름 입력" style={styles.input} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>학과</label>
                <input type="text" name="department" value={userInfo.department} onChange={handleUserChange} style={styles.input} />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>학번 (앞 2자리)</label>
                <input type="text" name="studentId" value={userInfo.studentId} onChange={handleUserChange} style={styles.input} />
              </div>
            </div>
          </div>
        )}

        {/* --- [Step 2: 우선순위 설정] --- */}
        {globalStep === 2 && (
          <div style={styles.card}>
            <h2 style={{ marginBottom: '8px' }}>2. 우선순위 설정</h2>
            <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '24px' }}>시간표 생성 시 가장 중요하게 고려할 순서대로 위아래로 배치해주세요.</p>
            {priorities.map((item, index) => (
              <div key={item.id} style={styles.priorityItem}>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                  <strong style={{ color: '#155DFC', marginRight: '12px' }}>{index + 1}</strong>
                  {item.label}
                </span>
                <div>
                  <button onClick={() => movePriority(index, 'up')} disabled={index === 0} style={{ ...styles.iconBtn, opacity: index === 0 ? 0.3 : 1 }}>▲</button>
                  <button onClick={() => movePriority(index, 'down')} disabled={index === priorities.length - 1} style={{ ...styles.iconBtn, opacity: index === priorities.length - 1 ? 0.3 : 1 }}>▼</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- [Step 3: 동적 질문 페이지] --- */}
        {globalStep === 3 && renderDynamicQuestion()}

        {/* --- [Step 4: 시간표 생성 중/결과 화면] --- */}
        {globalStep === 4 && (
          <div style={styles.card}>
            <h2 style={{ textAlign: 'center', color: '#155DFC', marginBottom: '16px' }}>시간표 생성 완료!</h2>
            <p style={{ textAlign: 'center', color: '#475569' }}>
              {userInfo.name || '사용자'}님({userInfo.department} {userInfo.studentId}학번)의 조건이 반영된 시간표입니다.
            </p>
            <div style={styles.mockTimetable}>
              [ Sometime 시간표 렌더링 영역 ]
            </div>
          </div>
        )}

        {/* --- [Step 5: 생성된 시간표 코멘트] --- */}
        {globalStep === 5 && (
          <div style={styles.card}>
            <h2 style={{ marginBottom: '24px' }}>5. Sometime 분석 코멘트</h2>
            <div style={{ background: '#EFF6FF', padding: '24px', borderRadius: '12px', lineHeight: '1.7', color: '#1E293B' }}>
              <p>안녕하세요, {userInfo.name || '학우'}님!</p>
              <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '12px' }}>
                  <strong>1순위로 꼽으신 '{priorities[0].label}' 조건:</strong><br/>
                  [{answers[priorities[0].id] || '미선택'}] 요구사항을 100% 반영하여 배치를 완료했습니다.
                </li>
                <li style={{ marginBottom: '12px' }}>
                  <strong>2순위인 '{priorities[1].label}' 조건:</strong><br/>
                  마찬가지로 [{answers[priorities[1].id] || '미선택'}] 사항을 고려하여 전공 필수 과목과 겹치지 않게 조율했습니다.
                </li>
                <li>
                  나머지 3, 4순위 조건도 알고리즘을 통해 최대한 반영했습니다. Sometime과 함께 편안한 한 학기 되세요!
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* --- [하단 네비게이션 버튼] --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <button 
            onClick={handlePrev} 
            disabled={globalStep === 1} 
            style={{ ...styles.btn, background: 'white', color: '#475569', border: '1px solid #CBD5E1', opacity: globalStep === 1 ? 0 : 1 }}
          >
            이전
          </button>
          
          <button onClick={handleNext} style={{ ...styles.btn, background: '#155DFC', color: 'white' }}>
            {globalStep === 5 ? '시간표 저장하기' : '다음 단계로'}
          </button>
        </div>

      </div>
    </div>
  );
}

// 스타일 객체 (깔끔한 UI를 위한 인라인 스타일)
const styles = {
  card: { background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' },
  label: { fontSize: '15px', fontWeight: '600', color: '#334155' },
  input: { padding: '14px 16px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '16px', outline: 'none', transition: '0.2s' },
  desc: { color: '#64748B', fontSize: '15px', marginBottom: '24px' },
  priorityItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#F8FAFC', marginBottom: '12px', borderRadius: '12px', border: '1px solid #E2E8F0' },
  iconBtn: { padding: '8px 12px', border: 'none', background: '#E2E8F0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', marginLeft: '8px', color: '#475569' },
  radio: { display: 'block', padding: '18px 20px', border: '1px solid #CBD5E1', borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', transition: '0.2s', color: '#334155', fontSize: '16px' },
  radioActive: { display: 'block', padding: '18px 20px', border: '2px solid #155DFC', background: '#EFF6FF', borderRadius: '12px', marginBottom: '12px', cursor: 'pointer', fontWeight: 'bold', color: '#155DFC', fontSize: '16px' },
  btn: { padding: '14px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.2s' },
  mockTimetable: { height: '350px', background: '#EEF2FF', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#6366F1', fontWeight: 'bold', fontSize: '18px', border: '2px dashed #C7D2FE' }
};