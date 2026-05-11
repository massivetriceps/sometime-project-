const axios = require('axios');

async function main() {
  try {
    // 1. 로그인
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      login_id: 'sumin010606@naver.com',
      password: '6d53e4a6'
    });
    const token = loginRes.data.success.access_token;
    console.log('✅ 로그인 성공');

    const headers = { Authorization: `Bearer ${token}` };

    // 2. 시간표 생성
    console.log('시간표 생성 요청...');
    const ttRes = await axios.post('http://localhost:8080/api/users/me/timetables', {
      grade: 4,
      free_day_mask: 0,
      avoid_uphill: false,
      allow_first: false,
      prefer_online: false,
    }, { headers });

    console.log('✅ 시간표 생성:', JSON.stringify(ttRes.data, null, 2));

    // 3. 시간표 조회
    const getRes = await axios.get('http://localhost:8080/api/users/me/timetables', { headers });
    const plans = getRes.data.success;
    console.log(`\n✅ 시간표 조회: ${plans?.length}개 플랜`);
    plans?.forEach(p => console.log(`  플랜${p.plan_type}: ${p.courses?.length}개 과목`));

  } catch (err) {
    console.error('❌ 에러:', JSON.stringify(err.response?.data || err.message, null, 2));
  }
}
main();
