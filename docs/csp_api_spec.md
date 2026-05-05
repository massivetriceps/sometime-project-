---

# Sometime AI Server - CSP API 스펙

> 작성일: 2026-05-04
> 

---

## 1. 개요

가천대 LLM/CSP 기반 시간표 생성 서비스의 AI 서버는 백엔드로부터 사용자 요청을 받아 OR-Tools CP-SAT 솔버로 시간표 Plan A/B/C를 생성한다.

- **AI 서버**: FastAPI (Python)
- **위치**: `ai-server/` 디렉토리
- **DB**: AWS RDS MySQL (백엔드와 공유)
- **CSP 엔진**: OR-Tools CP-SAT

---

## 2. 엔드포인트

### POST `/api/ai/csp/optimize`

시간표 최적화 요청. 사용자 우선순위와 제약 조건에 따라 Plan A/B/C 3개 시간표를 생성한다.

**Content-Type**: `application/json`

---

## 3. 요청 스키마

### CSPRequest

| 필드 | 타입 | 필수 | 설명 | 예시 |
| --- | --- | --- | --- | --- |
| `user_id` | int | ✅ | 사용자 ID | `1` |
| `major_id` | int | ✅ | 학과 ID (MAJORS 테이블 참조) | `62` (컴퓨터공학과) |
| `grade` | int | ✅ | 학년 (1~4) | `3` |
| `apply_year` | string | ✅ | 학번 마지막 두 자리 | `"23"` |
| `cart_course_ids` | list[int] | ⬜ | 장바구니 강의 ID (반드시 포함) | `[221, 313]` |
| `taken_course_codes` | list[string] | ⬜ | 기수강 강의 코드 (제외) | `["13978001"]` |
| `priority_order` | list[string] | ⬜ | 사용자 우선순위 (드래그앤드롭 순서) | 아래 표 참조 |
| `preferred_time` | string | ⬜ | 선호 시간대 | `"MORNING"` / `"AFTERNOON"` / `"ANY"` |
| `free_days` | list[string] | ⬜ | 공강 원하는 요일 | `["월", "금"]` |
| `credit_intensity` | string | ⬜ | 학점 강도 | `"RELAXED"` / `"NORMAL"` / `"INTENSIVE"` |
| `avoid_uphill` | bool | ⬜ | 오르막 회피 여부 | `true` |
| `prefer_online` | bool | ⬜ | 온라인 강의 선호 | `false` |

### priority_order 가능한 값

| 값 | 의미 |
| --- | --- |
| `"FREE_DAY"` | 공강 요일 확보 |
| `"AVOID_UPHILL"` | 오르막 회피 |
| `"PREFER_ONLINE"` | 온라인 강의 선호 |
| `"PREFER_MORNING"` | 선호 시간대 (오전/오후) |

### credit_intensity 학점 범위

| 값 | 학점 범위 |
| --- | --- |
| `"RELAXED"` | 12~16학점 |
| `"NORMAL"` | 15~21학점 (기본값) |
| `"INTENSIVE"` | 19~23학점 |

### 요청 예시

```json
{
  "user_id": 1,
  "major_id": 62,
  "grade": 3,
  "apply_year": "23",
  "cart_course_ids": [],
  "taken_course_codes": [],
  "priority_order": ["FREE_DAY", "AVOID_UPHILL", "PREFER_ONLINE", "PREFER_MORNING"],
  "preferred_time": "MORNING",
  "free_days": ["금"],
  "credit_intensity": "NORMAL",
  "avoid_uphill": true,
  "prefer_online": false
}
```

---

## 4. 응답 스키마

### CSPResponse

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `result_code` | string | 결과 코드 (아래 표 참조) |
| `found_count` | int | 찾은 plan 개수 (0~3) |
| `plan_a` | TimetablePlan | null | Plan A 시간표 |
| `plan_b` | TimetablePlan | null | Plan B 시간표 |
| `plan_c` | TimetablePlan | null | Plan C 시간표 |
| `conflict_info` | list[ConflictInfo] | 에러 발생 시 상세 정보 |

### result_code

| 값 | 의미 | 플랜 개수 |
| --- | --- | --- |
| `"SUCCESS"` | 정상 (3개 plan 모두 생성) | 3 |
| `"PARTIAL"` | 일부 생성 (1~2개) | 1~2 |
| `"NO_SOLUTION"` | 해 없음 | 0 |

### TimetablePlan

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `plan_type` | string | "A" / "B" / "C" |
| `plan_label` | string | 사용자에게 보여줄 한국어 라벨 (예: "공강 요일 우선") |
| `optimization_score` | int | 최적화 점수 (높을수록 좋음, 절대 비교 X) |
| `characteristics` | list[string] | 시간표 특징 태그 (예: `["#공강금요일", "#오전집중형"]`) |
| `total_credits` | int | 총 학점 |
| `schedules` | list[ScheduleItem] | 강의 시간표 목록 |

### plan_label 생성 규칙

`plan_label`은 사용자 우선순위와 설정에 따라 동적 생성된다.

| 우선순위 키 + 설정 | 생성 라벨 |
| --- | --- |
| FREE_DAY + free_days=["금"] | "금요일 공강 우선" |
| FREE_DAY + free_days=["월", "금"] | "월, 금요일 공강 우선" |
| FREE_DAY + free_days=[] | "공강 요일 우선" |
| AVOID_UPHILL | "오르막 회피 우선" |
| PREFER_ONLINE | "온라인 강의 우선" |
| PREFER_MORNING + preferred_time="MORNING" | "오전 수업 우선" |
| PREFER_MORNING + preferred_time="AFTERNOON" | "오후 수업 우선" |
| (Plan C) | "균형형" (고정) |

### ScheduleItem

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `course_id` | int | 강의 ID |
| `course_code` | string | 강의 코드 |
| `course_name` | string | 강의명 |
| `professor` | string | null | 교수명 |
| `credits` | int | 학점 |
| `classification` | string | 분류 (전필/전선/교필/교선/계교) |
| `day_of_week` | string | 요일 (월/화/수/목/금/토) |
| `start_period` | int | 시작 교시 |
| `end_period` | int | 종료 교시 |
| `building_name` | string | null | 건물명 (온라인 강의는 null) |
| `room_name` | string | null | 강의실 (온라인 강의는 null) |

### ConflictInfo

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `conflict_type` | string | 충돌 유형 (`MISSING_CART_COURSE` / `INFEASIBLE` / `NO_SOLUTION_FOUND`) |
| `message` | string | 사용자에게 보여줄 메시지 |
| `suggestion` | string | 해결 방법 제안 |

### 응답 예시 (SUCCESS)

```json
{
  "result_code": "SUCCESS",
  "found_count": 3,
  "plan_a": {
    "plan_type": "A",
    "plan_label": "금요일 공강 우선",
    "optimization_score": 61,
    "characteristics": ["#공강금요일", "#오전집중형", "#고학점"],
    "total_credits": 21,
    "schedules": [
      {
        "course_id": 232,
        "course_code": "14397001",
        "course_name": "네트워크보안",
        "professor": "오현영",
        "credits": 3,
        "classification": "전필",
        "day_of_week": "월",
        "start_period": 4,
        "end_period": 5,
        "building_name": "AI관",
        "room_name": "AI관-509"
      }
    ]
  },
  "plan_b": { },
  "plan_c": { },
  "conflict_info": []
}
```

### 응답 예시 (NO_SOLUTION)

```json
{
  "result_code": "NO_SOLUTION",
  "found_count": 0,
  "plan_a": null,
  "plan_b": null,
  "plan_c": null,
  "conflict_info": [
    {
      "conflict_type": "INFEASIBLE",
      "message": "주어진 조건을 모두 만족하는 시간표를 찾을 수 없습니다.",
      "suggestion": "장바구니 강의 시간이 겹치는지 확인하거나, 학점 범위를 조정해보세요."
    }
  ]
}
```

---

## 5. CSP 동작 로직

### 적용 제약 조건 (Hard Constraints)

모든 plan에 무조건 적용된다.

1. **시간 충돌 방지**: 같은 요일·교시에 2개 이상 강의 X
2. **기수강 과목 제외**: `taken_course_codes`에 있는 강의 X
3. **장바구니 고정**: `cart_course_ids`에 있는 강의는 반드시 포함
4. **학점 범위**: `credit_intensity`에 따른 최소~최대 학점 만족
5. **이동시간 10분 초과 차단**: 연속 교시 강의 간 이동시간이 10분 넘으면 동시 선택 X
6. **분반 중복 방지**: 같은 과목명(괄호 제거 후)은 한 분반만 선택

### 후보 강의 필터링

요청 시 다음 강의만 후보에 포함된다.

- 사용자 학과(`major_id`) 매핑된 강의 (COURSE_MAJORS 테이블)
- 일반 교양 강의 (교필, 교선, 계교)
- 학년 매칭:
    - 가천리버럴아츠칼리지 강의: N학년 이상 (예: 1 → 1,2,3,4 / 3 → 3,4)
    - 그 외: 정확히 N학년만
- 외국인 유학생용 한국어 강의 제외 (organization=가천리버럴아츠칼리지 + 강의명에 "한국어")
- 특정 학과 계교 강의는 해당 학과 학생만 (예: 운동재활학과 계교는 컴공 학생에게 안 보임)

### Plan A/B/C 생성 로직

3개 plan은 동일한 hard constraint 위에서 다른 가중치(soft preference)로 풀린다.

| Plan | 가중치 분배 |
| --- | --- |
| **Plan A** | 사용자 1순위 우선순위만 압도적 (가중치 20) |
| **Plan B** | 사용자 2순위 우선순위만 압도적 (가중치 20) |
| **Plan C** | 사용자 우선순위 그대로 반영 (1순위 4, 2순위 3, 3순위 2, 4순위 1) |

> 같은 강의 조합이 나오면 dedup 처리되어 해당 plan은 `null`이 될 수 있음 (PARTIAL 응답)
> 

---

## 6. 운영 정보

### 성능

- **솔버 타임아웃**: 단일 plan당 최대 10초
- **전체 응답 시간**: 평균 5~30초 (3개 plan 순차 풀이)
- **권장 백엔드 타임아웃**: 60초

### 한계

- 가천대 학사 데이터 자체의 모호성으로 일부 노이즈 가능 (예: classification이 잘못 기재된 강의)
- 현재 매핑된 학과: **컴퓨터공학과(62), 인공지능학과(61), 소프트웨어전공(71), 인공지능전공(72)**
    - 그 외 학과는 `major_id` 매칭이 안 되어 있어 동작 보장 X

### 에러 처리

| 상황 | 응답 | 처리 권장 |
| --- | --- | --- |
| 장바구니 강의가 후보에 없음 | `MISSING_CART_COURSE` | 사용자에게 강의 ID 재확인 요청 |
| 제약 모순 | `INFEASIBLE` | 학점 범위 완화 또는 장바구니 줄이기 안내 |
| 시간 초과 | `NO_SOLUTION_FOUND` | 재시도 또는 조건 완화 |
| 일부 plan만 생성 | `PARTIAL` | 정상 처리 (1~2개 plan만 사용자에게 표시) |
