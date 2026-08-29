import { WeekOption } from './types';

// =================================================================
// [중요] Google Apps Script 배포 후 받은 웹 앱 URL을 아래 따옴표 안에 넣으세요.
// 예: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBwHrV24F0VOcha7894Wgb80I53JZi0gbe6SYH8HX7TIgxUsQXJiG2o_sPRGewZBzr/exec"; 
// =================================================================

// 2026년 하반기 사역훈련 일정 및 과제표 반영
export const TRAINING_WEEKS: WeekOption[] = [
  { id: 'ot', label: 'OT (8/30 주일)', topic: '사역훈련 오리엔테이션', section: '오리엔테이션', startDate: '2026-08-30' },

  // 리더십 & 교리 코칭
  { id: 'week-1', label: '1주차 (9/6 주일)', topic: '1과 소그룹이란 무엇인가', assignmentItems: ['성경읽기: 창세기 1-25', 'D형큐티: 느 8:1-10'], memoryVerse: { reference: '시 57:1' }, section: '리더십 & 교리 코칭', startDate: '2026-09-06' },
  { id: 'week-2', label: '2주차 (9/13 주일)', topic: '2과 소그룹 리더를 위한 리더십', assignmentItems: ['성경읽기: 창세기 26-50', 'D형큐티: 창 28:10-22'], memoryVerse: { reference: '요 10:14-15' }, section: '리더십 & 교리 코칭', startDate: '2026-09-13' },
  { id: 'week-3', label: '3주차 (9/20 주일)', topic: '3과 소그룹 인도법', assignmentItems: ['성경읽기: 요한복음', 'D형큐티: 요 4:4-26'], memoryVerse: { reference: '약 1:19' }, section: '리더십 & 교리 코칭', startDate: '2026-09-20' },
  { id: 'holiday-chuseok', label: '추석 휴강 (9/27 주일)', topic: '주일반 추석 휴강', assignmentItems: ['성경읽기: 로마서'], section: '휴강', startDate: '2026-09-27' },
  { id: 'week-4', label: '4주차 (10/4 주일)', topic: '4과 칭의와 성화', assignmentItems: ['성경읽기: 고린도전서', 'D형큐티: 롬 6:1-4', '독후감: 사람들이 몰려오는 소그룹 인도법'], memoryVerse: { reference: '롬 3:25' }, section: '리더십 & 교리 코칭', startDate: '2026-10-04' },
  { id: 'week-5', label: '5주차 (10/11 주일)', topic: '5과 세례와 성찬', assignmentItems: ['성경읽기: 고린도후서', 'D형큐티: 마 26:26-28'], memoryVerse: { reference: '요 6:53' }, section: '리더십 & 교리 코칭', startDate: '2026-10-11' },
  { id: 'week-6', label: '6주차 (10/18 주일)', topic: '6과 예배와 찬양', assignmentItems: ['성경읽기: 갈, 엡, 빌, 골', 'D형큐티: 시 63:1-11', '소그룹 실습 및 순장 평가서 제출'], memoryVerse: { reference: '딤전 6:16' }, section: '리더십 & 교리 코칭', startDate: '2026-10-18' },
  { id: 'week-7', label: '7주차 (10/25 주일)', topic: '7과 재림과 신앙생활', assignmentItems: ['성경읽기: 살전, 살후, 딤전, 딤후', 'D형큐티: 마 25:1-13', '암송시험 및 기말고사'], memoryVerse: { reference: '눅 21:36' }, section: '리더십 & 교리 코칭', startDate: '2026-10-25' },

  // 다니엘 프로젝트
  { id: 'week-8', label: '8주차 (11/1 주일)', topic: '8과 다니엘 프로젝트 PART 1. 뜻을 정함', assignmentItems: ['성경읽기: 딛, 몬, 히', '과제: 다니엘기도회 요약', '다니엘 프로젝트 1권'], memoryVerse: { reference: '빌 2:1-11' }, section: '다니엘 프로젝트', startDate: '2026-11-01' },
  { id: 'week-9', label: '9주차 (11/8 주일)', topic: '9과 다니엘 프로젝트 PART 2. 기도', assignmentItems: ['성경읽기: 약, 벧전, 벧후', '과제: 다니엘기도회 요약', '다니엘 프로젝트 2권'], section: '다니엘 프로젝트', startDate: '2026-11-08' },
  { id: 'week-10', label: '10주차 (11/15 주일)', topic: '10과 다니엘 프로젝트 PART 3. 감사', assignmentItems: ['성경읽기: 요일, 요이, 요삼, 유', '과제: 다니엘기도회 요약', '다니엘 프로젝트 3권', '전체 누적 암송시험'], section: '다니엘 프로젝트', startDate: '2026-11-15' },

  // 교회론 코칭
  { id: 'week-11', label: '11주차 (11/22 주일)', topic: '11과 오륜교회 교회론 / 철학과 비전', assignmentItems: ['성경읽기: 요한계시록 1-11', '과제: 교회론, 철학/비전 요약'], section: '교회론 코칭', startDate: '2026-11-22' },
  { id: 'week-12', label: '12주차 (11/22 주일)', topic: '12과 오륜교회 직분론', assignmentItems: ['성경읽기: 요한계시록 12-22', '과제: 직분론 요약'], section: '교회론 코칭', startDate: '2026-11-22' },
  { id: 'outing', label: '교제와 나눔 (11/29 주일)', topic: '아웃팅', section: '마무리', startDate: '2026-11-29' },
  { id: 'graduation', label: '수료식 (11/27 금)', topic: '제자·사역훈련 수료식', section: '마무리', startDate: '2026-11-27' },
];

export const MAX_FILE_SIZE_MB = 10;
