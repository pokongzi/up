/**
 * 处理 data.json：只保留省份、市两级数据（过滤掉区/县/乡镇）
 * 规则：area === 0 且 town === 0 的为省或市
 *
 * 用法：node process_areas.js
 * 输出：data_province_city.json（原 data.json 不改动）
 * 若需覆盖原文件：将下方 outputPath 改为 inputPath 即可
 */

const fs = require('fs');
const path = require('path');

const dir = __dirname;
const inputPath = path.join(dir, 'data.json');
const outputPath = path.join(dir, 'data_province_city.json');

function isProvinceOrCity(item) {
  const a = item.area;
  const t = item.town;
  return (a === 0 || a === '0') && (t === 0 || t === '0');
}

console.log('读取', inputPath, '...');
const raw = fs.readFileSync(inputPath, 'utf8');
const data = JSON.parse(raw);

if (!Array.isArray(data)) {
  console.error('data.json 应为数组');
  process.exit(1);
}

const filtered = data.filter(isProvinceOrCity);
console.log('原始条数:', data.length, '→ 保留(省/市):', filtered.length);

fs.writeFileSync(outputPath, JSON.stringify(filtered, null, 2), 'utf8');
console.log('已写入', outputPath);
