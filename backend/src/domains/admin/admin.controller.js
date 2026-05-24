const { StatusCodes } = require('http-status-codes');
const adminService = require('./admin.service');
const axios = require('axios');
const fs   = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────
   관리자 설정값을 backend/data/ 폴더에 JSON으로 영속 저장
───────────────────────────────────────────────── */
const DATA_DIR = path.join(__dirname, '../../../../data');
const getFilePath = (name) => path.join(DATA_DIR, `${name}.json`);

const readConfig = (name, defaultValue = null) => {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const fp = getFilePath(name);
    if (!fs.existsSync(fp)) return defaultValue;
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return defaultValue;
  }
};

const writeConfig = (name, data) => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(getFilePath(name), JSON.stringify(data, null, 2), 'utf8');
};

const handleLogin = async (req, res, next) => {
  try {
    const { login_id, password } = req.body;
    const result = await adminService.loginAdmin(login_id, password);
    
    // index.js에서 주입한 res.success 사용
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    // 글로벌 에러 핸들러로 전달
    next(error);
  }
};

// 관리자 로그아웃
const handleLogout = async (req, res, next) => {
  try {
    // JWT는 서버에 상태가 저장되지 않으므로, 성공 메시지를 보내 클라이언트가 토큰을 삭제하도록 유도합니다.
    res.status(StatusCodes.OK).success({
      message: '관리자 로그아웃이 완료되었습니다. (클라이언트에서 토큰을 삭제해주세요.)',
    });
  } catch (error) {
    next(error);
  }
};

// 관리자 정보 수정 컨트롤러
const handleUpdateInfo = async (req, res, next) => {
  try {
    // adminMiddleware가 검증하고 넘겨준 admin 객체에서 id를 꺼냅니다.
    const adminId = req.admin.admin_id; 
    const { current_password, new_password, name } = req.body;
    
    const updateData = { new_password, name };
    
    const result = await adminService.updateAdminInfo(adminId, current_password, updateData);
    
    // 팀장님 스타일 응답
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 전체 사용자 목록 조회 컨트롤러
const handleGetAllUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers();
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

// 사용자 삭제 컨트롤러
const handleDeleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await adminService.deleteUserByAdmin(userId);
    
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────
   CSP 알고리즘 설정 저장/조회
───────────────────────────────────────────────── */
const DEFAULT_CSP_CONFIG = {
  maxSolutions: 3,
  timeLimit: 500,
  maxCredits: 21,
  minCredits: 12,
  weights: {
    slopeAvoidance:   8,
    freeDay:          9,
    morningAvoid:     7,
    onlinePreference: 5,
    consecutiveAvoid: 6,
    distanceMinimize: 8,
  },
  hardConstraints: { timeConflict: true, creditLimit: true, majorRequired: true },
  softConstraints: { slopeAvoid: true, freeDayPref: true, morningAvoid: true, onlinePref: false },
};

const handleGetCSPConfig = async (req, res, next) => {
  try {
    const config = readConfig('csp_config', DEFAULT_CSP_CONFIG);
    res.status(StatusCodes.OK).success(config);
  } catch (error) {
    next(error);
  }
};

const handleSaveCSPConfig = async (req, res, next) => {
  try {
    const savedAt = new Date().toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
    const config = { ...req.body, savedAt };
    writeConfig('csp_config', config);
    res.status(StatusCodes.OK).success({ message: 'CSP 설정이 저장되었습니다.', savedAt });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────
   AI 프롬프트 설정 저장/조회
───────────────────────────────────────────────── */
const DEFAULT_AI_PROMPT = {
  prompt: `당신은 대학교 시간표 분석 전문가입니다. 주어진 시간표 데이터를 분석하여 학생에게 유익한 맞춤형 코멘트를 생성해주세요.

## 분석 기준
1. **동선 효율성**: 강의 간 이동 경로와 소요 시간을 분석합니다
2. **공강 활용**: 확보된 공강 시간의 활용 가능성을 설명합니다
3. **졸업 요건**: 해당 시간표가 졸업 요건 충족에 미치는 영향을 분석합니다
4. **학습 부담**: 강의 밀도와 학습 부담 수준을 평가합니다

## 출력 형식
- 2~3문장의 간결하고 긍정적인 톤으로 작성
- 구체적인 수치(거리, 학점, 공강 요일)를 포함
- 학생의 선택을 격려하는 마무리 문장 포함`,
  model: 'claude-sonnet-4-20250514',
  maxTokens: 300,
};

const handleGetAIPromptConfig = async (req, res, next) => {
  try {
    const config = readConfig('ai_prompt_config', DEFAULT_AI_PROMPT);
    res.status(StatusCodes.OK).success(config);
  } catch (error) {
    next(error);
  }
};

const handleSaveAIPromptConfig = async (req, res, next) => {
  try {
    const savedAt = new Date().toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
    const config = { ...req.body, savedAt };
    writeConfig('ai_prompt_config', config);
    res.status(StatusCodes.OK).success({ message: 'AI 프롬프트 설정이 저장되었습니다.', savedAt });
  } catch (error) {
    next(error);
  }
};

/* ─────────────────────────────────────────────────
   AI 프롬프트 테스트 (Claude API 직접 호출)
───────────────────────────────────────────────── */
const handleTestAIPrompt = async (req, res, next) => {
  try {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!ANTHROPIC_API_KEY) {
      return res.status(StatusCodes.OK).success({
        result: null,
        error: '[설정 필요] 백엔드 .env에 ANTHROPIC_API_KEY=sk-ant-... 를 추가한 뒤 서버를 재시작해주세요.',
      });
    }

    const { prompt, model, maxTokens, testInput } = req.body;
    const systemPrompt = prompt || DEFAULT_AI_PROMPT.prompt;
    const useModel     = model || DEFAULT_AI_PROMPT.model;
    const useMaxTokens = maxTokens || DEFAULT_AI_PROMPT.maxTokens;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: useModel,
        max_tokens: useMaxTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: testInput || '{}' }],
      },
      {
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const result = response.data?.content?.[0]?.text ?? '(응답 없음)';
    res.status(StatusCodes.OK).success({ result, error: null });
  } catch (error) {
    const msg = error.response?.data?.error?.message || error.message || '알 수 없는 오류';
    res.status(StatusCodes.OK).success({ result: null, error: `[Claude API 오류] ${msg}` });
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleUpdateInfo,
  handleGetAllUsers,
  handleDeleteUser,
  handleGetCSPConfig,
  handleSaveCSPConfig,
  handleGetAIPromptConfig,
  handleSaveAIPromptConfig,
  handleTestAIPrompt,
};