import { WeekOption } from './types';

// =================================================================
// [중요] Google Apps Script 배포 후 받은 웹 앱 URL을 아래 따옴표 안에 넣으세요.
// 예: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzBwHrV24F0VOcha7894Wgb80I53JZi0gbe6SYH8HX7TIgxUsQXJiG2o_sPRGewZBzr/exec"; 
// =================================================================

// 2026년 1학기 제자훈련 연간 계획 반영
export const TRAINING_WEEKS: WeekOption[] = [
  // 1권: 비전의 사람
  { id: 'week-0', label: 'OT', section: '1권: 비전의 사람 (상반기)', startDate: '2026-01-25' },
  { id: 'week-1', label: '1주차', topic: '1-1 내가 만난 예수님', section: '1권: 비전의 사람 (상반기)', startDate: '2026-02-01' },
  { id: 'week-2', label: '2주차', topic: '1-2 제자란 누구인가', section: '1권: 비전의 사람 (상반기)', startDate: '2026-02-08' },
  { id: 'week-3', label: '3주차', topic: '1-3 하나님의 주재권', section: '1권: 비전의 사람 (상반기)', startDate: '2026-02-22' },
  { id: 'week-4', label: '4주차', topic: '1-4 영적전쟁', section: '1권: 비전의 사람 (상반기)', startDate: '2026-03-01' },
  { id: 'week-5', label: '5주차', topic: '1-5 무릎으로 승부하라', section: '1권: 비전의 사람 (상반기)', startDate: '2026-03-08' },
  { id: 'week-6', label: '6주차', topic: '1-6 성경의 권위 (암송시험)', section: '1권: 비전의 사람 (상반기)', startDate: '2026-03-15' },
  { id: 'week-7', label: '7주차', topic: '1-7 하나님은 누구신가?', section: '1권: 비전의 사람 (상반기)', startDate: '2026-03-22' },
  { id: 'week-8', label: '8주차', topic: '1-8 인간은 누구인가?', section: '1권: 비전의 사람 (상반기)', startDate: '2026-03-29' },
  { id: 'week-9', label: '9주차', topic: '1-9 예수 그리스도는 누구신가?', section: '1권: 비전의 사람 (상반기)', startDate: '2026-04-05' },
  { id: 'week-10', label: '10주차', topic: '1-10 십자가와 구원', section: '1권: 비전의 사람 (상반기)', startDate: '2026-04-12' },
  { id: 'week-11', label: '11주차', topic: '1-11 성령 하나님은 누구신가? (암송시험)', section: '1권: 비전의 사람 (상반기)', startDate: '2026-04-19' },
  { id: 'week-12', label: '12주차', topic: '1-12 거룩한 삶 (1권 중간고사)', section: '1권: 비전의 사람 (상반기)', startDate: '2026-04-26' },
  
  // 2권: 성령의 사람
  { id: 'week-13', label: '13주차', topic: '공동체 연합의 시간', section: '2권: 성령의 사람 (하반기)', startDate: '2026-05-03' },
  { id: 'week-14', label: '14주차', topic: '2-1 교회란 무엇인가', section: '2권: 성령의 사람 (하반기)' }, // 같은 주간 또는 별도 날짜 없음
  { id: 'week-15', label: '15주차', topic: '2-2 예수 그리스도의 재림과 영원한 소망', section: '2권: 성령의 사람 (하반기)', startDate: '2026-05-10' },
  { id: 'week-16', label: '16주차', topic: '2-3 주가 오실 길을 예비하라', section: '2권: 성령의 사람 (하반기)', startDate: '2026-05-17' },
  { id: 'week-17', label: '17주차', topic: '2-4 하나님의 임재가 충만한 예배', section: '2권: 성령의 사람 (하반기)', startDate: '2026-05-24' },
  { id: 'week-18', label: '18주차', topic: '2-5 순종의 삶', section: '2권: 성령의 사람 (하반기)', startDate: '2026-05-31' },
  { id: 'week-19', label: '19주차', topic: '2-6 말의 능력 (암송시험)', section: '2권: 성령의 사람 (하반기)' }, // 같은 주간
  { id: 'week-20', label: '20주차', topic: '2-7 재정 관리', section: '2권: 성령의 사람 (하반기)', startDate: '2026-06-07' },
  { id: 'week-21', label: '21주차', topic: '2-8 다음세대를 준비하라', section: '2권: 성령의 사람 (하반기)', startDate: '2026-06-14' },
  { id: 'week-22', label: '22주차', topic: '2-9 섬김과 나눔을 실천하라', section: '2권: 성령의 사람 (하반기)', startDate: '2026-06-21' },
  { id: 'week-23', label: '23주차', topic: '2-10 영향력 있는 사람을 세우라 (최종 암송)', section: '2권: 성령의 사람 (하반기)', startDate: '2026-06-28' },
  { id: 'week-24', label: '24주차', topic: '2-11 비전의 사람이 되라 (2권 기말고사)', section: '2권: 성령의 사람 (하반기)', startDate: '2026-07-05' },
];

export const MAX_FILE_SIZE_MB = 10;