import { useState } from 'react';
import {
  Save, CheckCircle2, RotateCcw, PlayCircle,
  Bot, Sparkles, ChevronDown, Hash, AlignLeft,
  Clock, Zap, Copy, Check
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const DEFAULT_PROMPT = `당신은 대학교 시간표 분석 전문가입니다. 주어진 시간표 데이터를 분석하여 학생에게 유익한 맞춤형 코멘트를 생성해주세요.

## 분석 기준
1. **동선 효율성**: 강의 간 이동 경로와 소요 시간을 분석합니다
2. **공강 활용**: 확보된 공강 시간의 활용 가능성을 설명합니다  
3. **졸업 요건**: 해당 시간표가 졸업 요건 충족에 미치는 영향을 분석합니다
4. **학습 부담**: 강의 밀도와 학습 부담 수준을 평가합니다

## 출력 형식
- 2~3문장의 간결하고 긍정적인 톤으로 작성
- 구체적인 수치(거리, 학점, 공강 요일)를 포함
- 학생의 선택을 격려하는 마무리 문장 포함

## 예시 출력
"수요일 공강이 확보되어 중간 휴식이 가능한 시간표입니다. 공학관A-공학관B 이동 구간만 있어 동선이 최소화되었으며, 부족했던 전공필수 3학점을 완벽히 채웠습니다. 이번 학기 학업과 여가의 균형을 잘 잡을 수 있을 것입니다."`;

const TEST_INPUT = `{
  "plan": "A",
  "courses": [
    {"name": "알고리즘", "day": "화목", "room": "공A301", "credits": 3},
    {"name": "운영체제", "day": "월수", "room": "공B201", "credits": 3}
  ],
  "freeDay": "금",
  "totalDistance": 320,
  "graduationFit": 0.85
}`;

const MODELS = [
  { val: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4',  badge: 'bg-[#EEF2FF] text-[#4F7CF3]',  desc: '균형잡힌 성능 · 권장' },
  { val: 'claude-opus-4-20250514',   label: 'Claude Opus 4',    badge: 'bg-[#F3F0FF] text-[#A78BFA]',  desc: '최고 품질 · 느림'    },
  { val: 'claude-haiku-4-5-20251001',label: 'Claude Haiku 4.5', badge: 'bg-[#E6FAF8] text-[#2EC4B6]',  desc: '빠른 응답 · 경량'    },
];

const TIPS = [
  '역할(Persona)을 첫 문장에 명확히 정의하세요',
  '출력 길이와 형식을 구체적으로 지정하세요',
  'Few-shot 예시를 포함하면 일관성이 높아집니다',
  '분석 기준을 번호 목록으로 제공하세요',
  '긍정적인 톤 지침을 명시하면 효과적입니다',
];

export default function AdminAIPrompt() {
  const [prompt, setPrompt]         = useState(DEFAULT_PROMPT);
  const [saved, setSaved]           = useState(false);
  const [testing, setTesting]       = useState(false);
  const [testResult, setTestResult] = useState('');
  const [model, setModel]           = useState('claude-sonnet-4-20250514');
  const [maxTokens, setMaxTokens]   = useState(300);
  const [copied, setCopied]         = useState(false);

  const handleSave  = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleReset = () => { setPrompt(DEFAULT_PROMPT); setTestResult(''); };

  const handleCopy = () => {
    navigator.clipboard.writeText(testResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult('');
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system: prompt,
          messages: [{ role: 'user', content: `다음 시간표 데이터에 대한 코멘트를 생성해주세요:\n\n${TEST_INPUT}` }],
        }),
      });
      const data = await response.json();
      setTestResult(data.content?.[0]?.text || '응답 없음');
    } catch {
      setTestResult('테스트 실행 중 오류가 발생했습니다. API 연결을 확인해주세요.');
    } finally {
      setTesting(false);
    }
  };

  const charCount  = prompt.length;
  const lineCount  = prompt.split('\n').length;
  const tokenEst   = Math.round(charCount / 3.5);
  const selectedModel = MODELS.find(m => m.val === model);

  return (
    <AdminLayout>

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI 프롬프트 관리</h1>
          <p className="text-xs text-slate-400 mt-0.5">AI 시간표 코멘트 생성 로직을 수정합니다</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">기본값</span>
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              saved
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-[#4F7CF3] text-white shadow-[#4F7CF3]/25 hover:bg-[#3B6AE0]'
            }`}
          >
            {saved ? <><CheckCircle2 size={14} />저장됨</> : <><Save size={14} />저장</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── 좌측 사이드바 ── */}
        <div className="space-y-4">

          {/* 모델 선택 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-xl bg-[#EEF2FF] flex items-center justify-center">
                <Bot size={14} className="text-[#4F7CF3]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">모델 설정</h3>
            </div>

            {/* 모델 선택 카드 */}
            <div className="space-y-2 mb-4">
              {MODELS.map((m) => (
                <button
                  key={m.val}
                  onClick={() => setModel(m.val)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    model === m.val
                      ? 'border-[#4F7CF3]/30 bg-[#EEF2FF]/60'
                      : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${model === m.val ? 'bg-[#4F7CF3]' : 'bg-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[12px] font-bold text-slate-700">{m.label}</p>
                      {model === m.val && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${m.badge}`}>선택됨</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Max Tokens 슬라이더 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-slate-600">Max Tokens</label>
                <span className="text-[13px] font-bold text-[#4F7CF3]">{maxTokens}</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={50}
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #4F7CF3 0%, #4F7CF3 ${((maxTokens - 100) / 900) * 100}%, #F1F5F9 ${((maxTokens - 100) / 900) * 100}%, #F1F5F9 100%)`,
                  accentColor: '#4F7CF3',
                }}
              />
              <div className="flex justify-between text-[10px] text-slate-300 mt-1">
                <span>100</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          {/* 프롬프트 정보 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">프롬프트 정보</h3>
            <div className="space-y-2.5">
              {[
                { icon: Hash,      label: '글자 수',     value: charCount.toLocaleString(),   warn: charCount > 2000 },
                { icon: AlignLeft, label: '줄 수',       value: `${lineCount}줄`,              warn: false            },
                { icon: Zap,       label: '예상 토큰',   value: `~${tokenEst.toLocaleString()}`, warn: tokenEst > 800 },
                { icon: Clock,     label: '마지막 저장', value: '2026-04-25',                  warn: false            },
              ].map(({ icon: Icon, label, value, warn }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={12} className="text-slate-400" />
                    <span className="text-[12px] text-slate-500">{label}</span>
                  </div>
                  <span className={`text-[12px] font-bold ${warn ? 'text-red-500' : 'text-slate-700'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* 글자 수 프로그레스 */}
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>프롬프트 크기</span>
                <span>{Math.round((charCount / 3000) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${charCount > 2000 ? 'bg-red-400' : 'bg-[#4F7CF3]'}`}
                  style={{ width: `${Math.min((charCount / 3000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 작성 팁 */}
          <div className="bg-[#EEF2FF] border border-[#4F7CF3]/15 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-[#4F7CF3]" />
              <span className="text-[12px] font-bold text-[#4F7CF3]">프롬프트 작성 팁</span>
            </div>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                  <span className="w-4 h-4 rounded-md bg-[#4F7CF3]/10 text-[#4F7CF3] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── 우측 메인 에디터 + 테스트 ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* 시스템 프롬프트 에디터 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* 에디터 헤더 */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[12px] font-mono font-semibold text-slate-500">system_prompt.txt</span>
              </div>
              <div className="flex items-center gap-2">
                {selectedModel && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${selectedModel.badge}`}>
                    {selectedModel.label}
                  </span>
                )}
                <span className="text-[11px] text-slate-400">
                  {charCount.toLocaleString()} chars
                </span>
              </div>
            </div>

            {/* 텍스트에어리어 */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={16}
              className="w-full px-5 py-4 text-[13px] font-mono text-slate-700 bg-white resize-none outline-none leading-relaxed placeholder:text-slate-300"
              placeholder="시스템 프롬프트를 입력하세요..."
              spellCheck={false}
            />
          </div>

          {/* 테스트 섹션 */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* 테스트 헤더 */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#E6FAF8] flex items-center justify-center">
                  <PlayCircle size={14} className="text-[#2EC4B6]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">프롬프트 테스트</h3>
                  <p className="text-[10px] text-slate-400">샘플 시간표 데이터로 AI 응답을 확인합니다</p>
                </div>
              </div>
              <button
                onClick={handleTest}
                disabled={testing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2EC4B6] text-white text-sm font-semibold shadow-lg shadow-[#2EC4B6]/25 hover:bg-[#27AFA2] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {testing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    생성 중...
                  </>
                ) : (
                  <>
                    <PlayCircle size={14} />
                    테스트 실행
                  </>
                )}
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 입력 데이터 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">입력 데이터</span>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">JSON</span>
                </div>
                <div className="bg-slate-900 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                      <div className="w-2 h-2 rounded-full bg-slate-600" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">timetable_data.json</span>
                  </div>
                  <pre className="px-4 py-3 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    {TEST_INPUT}
                  </pre>
                </div>
              </div>

              {/* AI 생성 결과 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">AI 응답</span>
                    {testResult && (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">생성 완료</span>
                    )}
                  </div>
                  {testResult && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      {copied ? '복사됨' : '복사'}
                    </button>
                  )}
                </div>

                {testing ? (
                  <div className="h-full min-h-[160px] bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#2EC4B6] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium">AI가 코멘트를 생성하는 중...</p>
                  </div>
                ) : testResult ? (
                  <div className="bg-[#EEF2FF] rounded-xl border border-[#4F7CF3]/15 p-4 min-h-[160px]">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Bot size={13} className="text-[#4F7CF3]" />
                      <span className="text-[10px] font-bold text-[#4F7CF3] uppercase tracking-wide">Claude 응답</span>
                    </div>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{testResult}</p>
                  </div>
                ) : (
                  <div className="min-h-[160px] bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 p-4">
                    <Bot size={24} className="text-slate-300" />
                    <p className="text-[12px] text-slate-400 text-center font-medium">
                      테스트 실행 버튼을 클릭하면<br />AI 코멘트가 여기에 표시됩니다
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

    </AdminLayout>
  );
}
