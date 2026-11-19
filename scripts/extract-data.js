/**
 * extract-data.js
 * 从旧的单文件 index.html 中提取顶层 JS 数据常量，输出为 ES 模块到 src/data/。
 * 通过词法括号匹配提取每个声明块，避免逐行手工复制数千行产品数据。
 */
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', '..', 'index.html');
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'data');

const html = fs.readFileSync(SRC, 'utf8');
// 取出 <script> 块
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) throw new Error('找不到 <script> 块');
const js = scriptMatch[1];

/** 字符级括号配平，返回 [startIndex, endIndexInclusive] 指向声明块 */
function matchDeclaration(src, declName) {
  const re = new RegExp('(^|[\\s(,;])(const ' + declName + '\\s*=)');
  const m = re.exec(src);
  if (!m) {
    // 允许没找到时静默返回 null
    return null;
  }
  const start = m.index + m[1].length; // 跳过前置分隔符
  // 找到 '=' 之后第一个值字符
  let i = src.indexOf('=', start);
  // 跳过等号后空白
  i++;
  while (i < src.length && /\s/.test(src[i])) i++;

  const open = src[i];
  const closer = open === '{' ? '}' : open === '[' ? ']' : open === '(' ? ')' : null;
  if (!closer) {
    // 标量值：提取到行尾分号
    const semi = src.indexOf(';', i);
    return { start, end: semi === -1 ? src.length - 1 : semi, declStart: start };
  }
  // 深度配平
  let depth = 0;
  let inStr = false;
  let strCh = '';
  let j = i;
  for (; j < src.length; j++) {
    const c = src[j];
    if (inStr) {
      if (c === '\\') { j++; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue; }
    if (c === open) depth++;
    else if (c === closer) {
      depth--;
      if (depth === 0) break;
    }
  }
  return { start, end: j, declStart: start };
}

/** 把匹配到的「const X = ...;」文本转成模块导出 */
function extractAsModule(declName) {
  const r = matchDeclaration(js, declName);
  if (!r) return null;
  // 从 declStart 到 end 的文本，形如 "const X = {...};"。去掉末尾分号。
  let block = js.slice(r.declStart, r.end + 1).trim();
  block = block.replace(/;\s*$/, '').trim();
  // 替换 "const NAME = " -> "export const NAME = "
  const head = block.indexOf('=');
  const namePart = block.slice(0, head).trim(); // "const NAME"
  const valuePart = block.slice(head);          // "= {...}"
  const constName = /const\s+([A-Za-z_$][\w$]*)/.exec(namePart)[1];
  return `// 自动生成：从原 index.html 提取\n/* eslint-disable */\nexport const ${constName} = ${valuePart.slice(1).trim()};\n`;
}

const configs = [
  { name: 'BRAND_META', file: 'brandMeta.js' },
  { name: 'BRAND_COVERAGE', file: 'brandCoverage.js' },
  { name: 'BRAND_IMAGE_SOURCE', file: 'brandImageSource.js' },
  { name: 'TYPE_ORDER', file: 'typeOrder.js' },
  { name: 'SPEC_TEMPLATE', file: 'specTemplate.js' },
  { name: 'PRODUCTS', file: 'products.js' },
];

fs.mkdirSync(OUT_DIR, { recursive: true });
for (const cfg of configs) {
  const mod = extractAsModule(cfg.name);
  if (!mod) { console.warn('[warn] 未找到 ' + cfg.name); continue; }
  fs.writeFileSync(path.join(OUT_DIR, cfg.file), mod, 'utf8');
  // 统计该模块产品数量（若为数组）
  if (cfg.name === 'PRODUCTS') {
    const re = /\{brand:\s*"/g;
    const n = (mod.match(re) || []).length;
    console.log('PRODUCTS 条目数 ≈ ' + n);
  }
  console.log('已生成 ' + cfg.file + '  (' + (mod.length / 1024).toFixed(1) + ' KB)');
}
console.log('完成。输出目录：' + OUT_DIR);