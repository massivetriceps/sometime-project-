/**
 * 공유 날짜/시간 포맷 유틸리티
 * AdminDashboard, AdminLogs, Notice 등 여러 파일에서 import하여 사용합니다.
 */

/** ISO 문자열 → "HH:MM" (24시간, 한국어 로케일) */
export const fmtTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch {
    return '';
  }
};

/** ISO 문자열 → "YYYY. MM. DD. HH:MM:SS" (한국어 로케일 날짜 + 시각) */
export const formatDateTime = (isoStr) => {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    const date = d.toLocaleDateString('ko-KR');
    const time = d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${date} ${time}`;
  } catch {
    return isoStr;
  }
};

/** 날짜 문자열 → "YYYY.MM.DD" (한국어 로케일, 점 구분) */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');
};
