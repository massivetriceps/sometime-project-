import React from 'react';
import { Heart, User, Settings } from 'lucide-react';

const Login = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f0f0' }}>
      
      {/* 메인 카드 (아이폰 사이즈) */}
      <div style={{width: 390, height: 844, position: 'relative', background: 'white', borderRadius: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        
        {/* 콘텐츠 영역 */}
        <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 1 }}>
          
          <div style={{width: '100%', top: 100, position: 'absolute', textAlign: 'center', color: '#1F41BB', fontSize: 30, fontWeight: '700'}}>로그인</div>
          <div style={{width: '100%', top: 160, position: 'absolute', textAlign: 'center', color: 'black', fontSize: 20, fontWeight: '600'}}>환영합니다</div>
          
          {/* --- [수정된 입력 폼 섹션] --- */}
          <div style={{
            left: 20,           // 왼쪽 여백을 20으로 넉넉히 줌
            right: 20,          // 오른쪽 여백도 20으로 설정 (자동으로 너비가 계산됨)
            top: 280, 
            position: 'absolute', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 25 
          }}>
            
            {/* 이메일 입력창: width를 100%로 주면 부모(left/right 20) 안에서 꽉 찹니다 */}
            <div style={{width: '100%', height: 60, background: '#F1F4FF', borderRadius: 10, border: '2px #1F41BB solid', display: 'flex', alignItems: 'center', padding: '0 20px', boxSizing: 'border-box'}}>
              <div style={{color: '#626262', fontSize: 16}}>이메일</div>
            </div>

            {/* 비밀번호 입력창 */}
            <div style={{width: '100%', height: 60, background: '#F1F4FF', borderRadius: 10, display: 'flex', alignItems: 'center', padding: '0 20px', boxSizing: 'border-box'}}>
              <div style={{color: '#626262', fontSize: 16}}>비밀번호</div>
            </div>

            {/* 비밀번호 찾기 */}
            <div style={{width: '100%', textAlign: 'right', color: '#1F41BB', fontSize: 14, fontWeight: '600'}}>
              비밀번호를 잊어버리셨나요?
            </div>

            {/* 로그인 버튼 */}
            <div style={{marginTop: 10, width: '100%', height: 60, background: '#1F41BB', boxShadow: '0px 10px 20px rgba(203, 214, 255, 0.3)', borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{color: 'white', fontSize: 20, fontWeight: '600'}}>로그인</div>
            </div>

            {/* 계정 생성 */}
            <div style={{width: '100%', textAlign: 'center', color: '#494949', fontSize: 14, fontWeight: '600'}}>
              계정 생성하기
            </div>
          </div>
          
          {/* 하단 SNS 섹션 */}
          <div style={{width: '100%', bottom: 60, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <div style={{color: '#1F41BB', fontSize: 14, fontWeight: '600'}}>sns로 로그인하기</div>
            <div style={{display: 'flex', gap: 15}}>
              <div style={snsBoxStyle}><Heart size={24} color="#E02424" /></div>
              <div style={snsBoxStyle}><User size={24} color="#1F41BB" /></div>
              <div style={snsBoxStyle}><Settings size={24} color="#444" /></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const snsBoxStyle = {
  width: 60, 
  height: 50, 
  background: '#ECECEC', 
  borderRadius: 12, 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center'
};

export default Login;