/**
 * 관리자 설정값을 백엔드 data/ 폴더에 JSON 파일로 영속 저장하는 헬퍼 모듈
 */
const fs   = require('fs');
const path = require('path');

// backend/data/ 폴더 (없으면 자동 생성)
const DATA_DIR = path.join(__dirname, '../../../../data');

const getFilePath = (name) => path.join(DATA_DIR, `${name}.json`);

/** JSON 파일 읽기 — 없으면 defaultValue 반환 */
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

/** JSON 파일 쓰기 */
const writeConfig = (name, data) => {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(getFilePath(name), JSON.stringify(data, null, 2), 'utf8');
};

module.exports = { readConfig, writeConfig };
