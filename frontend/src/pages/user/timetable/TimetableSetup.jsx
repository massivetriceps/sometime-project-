import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
export default function TimeTableG() {
  // --- [1. 상태 관리] ---
  const [globalStep, setGlobalStep] = useState(1); 
  const [dynamicStep, setDynamicStep] = useState(0); 
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ 
    name: '', 
    department: '컴퓨터공학과', 
    studentId: '21' 
  });
  
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
  
  const handleNext = () => {
    if (globalStep === 3) {
      if (dynamicStep < priorities.length - 1) {
        setDynamicStep(prev => prev + 1);
      } else {
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
      case 'freeDay':
        // 🟢 3개 이상 선택 시 경고 플래그
        const isWarning = answers.freeDay.length >= 3 && !answers.freeDay.includes('난 5일 내내 학교 다닐래');
        
        return (
          <div style={styles.card}>
            <h3>{dynamicStep + 1}순위 조건: 공강 요일</h3>
            <p style={styles.desc}>
              가장 원하는 공강 요일을 선택해주세요. (복수선택 가능)<br/>
              {/* 🟢 3개 이상 선택 시 나타나는 경고 문구 */}
              {isWarning && (
                <span style={{ color: '#EF4444', fontSize: '13px', display: 'block', marginTop: '8px', fontWeight: 'bold' }}>
                  3개 이상 선택 시 만족하는 시간표가 없거나, 연산 시간이 오래 걸릴 수 있습니다.
                </span>
              )}
            </p>
            {['월요일', '화요일', '수요일', '목요일', '금요일', '난 5일 내내 학교 다닐래'].map(opt => {
              const isChecked = answers.freeDay.includes(opt);
              return (
                <label key={opt} style={isChecked ? styles.radioActive : styles.radio}>
                  <input type="checkbox" value={opt} onChange={handleCheckboxChange} checked={isChecked} style={{display:'none'}} />
                  {opt}
                </label>
              )
            })}
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
            {['최소 1개는 무조건 포함', '2개 이상', '난 강의실이 좋은데'].map(opt => (
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={styles.card}>
              <h2 style={{ textAlign: 'center', color: '#155DFC', marginBottom: '16px' }}>시간표 생성 완료!</h2>
              <p style={{ textAlign: 'center', color: '#475569', marginBottom: '24px' }}>
                {userInfo.name || '사용자'}님({userInfo.department} {userInfo.studentId}학번)의 조건이 반영된 시간표입니다.
              </p>
              <div style={styles.mockTimetable}>
                [ Sometime 시간표 렌더링 영역 ]
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Sometime 분석 코멘트</h3>
              <div style={{ background: '#EFF6FF', padding: '24px', borderRadius: '12px', lineHeight: '1.7', color: '#1E293B' }}>
                <p>안녕하세요, {userInfo.name || '학우'}님!</p>
                <ul style={{ marginTop: '16px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>1순위로 꼽으신 '{priorities[0].label}' 조건:</strong><br/>
                    [{priorities[0].id === 'freeDay' ? (answers.freeDay.join(', ') || '미선택') : (answers[priorities[0].id] || '미선택')}] 요구사항을 반영하여 배치를 완료했습니다.
                  </li>
                  <li style={{ marginBottom: '12px' }}>
                    <strong>2순위인 '{priorities[1].label}' 조건:</strong><br/>
                    마찬가지로 [{priorities[1].id === 'freeDay' ? (answers.freeDay.join(', ') || '미선택') : (answers[priorities[1].id] || '미선택')}] 사항을 고려하여 전공 필수 과목과 겹치지 않게 조율했습니다.
                  </li>
                  <li>
                    나머지 3, 4순위 조건도 CSP 엔진을 통해 최대한 반영했습니다. Sometime과 함께 편안한 한 학기 되세요!
                  </li>
                </ul>
              </div>
            </div>
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
  onClick={() => {
    if (globalStep === 4) {
      // 데이터 연동 전이므로 바로 이동만 수행
      navigate('/timetable/manage');
    } else {
      handleNext();
    }
  }} 
  style={{ ...styles.btn, background: '#155DFC', color: 'white' }}
>
  {globalStep === 4 ? '시간표 저장하기' : '다음 단계로'}
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