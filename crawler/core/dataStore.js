/**
 * core/dataStore.js
 * 读取/写回 前端产品库 src/data/products.js。
 *
 * products.js 是被脚本提取的 ES 模块，格式为 `export const PRODUCTS = [ ...每行一条... ];`。
 * 这里提供：
 *   - loadProducts(): 解析出产品数组
 *   - saveProducts(list): 把合并后的数组写回（保持逐行 JSON 风格，格式合法可被 Vite import）
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_PATH = path.resolve(__dirname, '../../src/data/products.js');

/** 解析 products.js 中的 PRODUCTS 数组（动态 import 该模块，兼容对象字面量键名） */
export async function loadProducts() {
  const mod = await import(pathToFileURL(PRODUCTS_PATH).href + '?' + Date.now());
  const arr = mod.PRODUCTS;
  if (!Array.isArray(arr)) throw new Error('PRODUCTS 不是数组');
  return arr;
}

/** 写回 products.js（逐行一个产品，保持与原文件相似的紧凑风格，仍是合法 ES 模块） */
export function saveProducts(list) {
  const lines = list.map(p => '  ' + JSON.stringify(p));
  const content =
    '// 自动生成：从原 index.html 提取 + 爬虫增量合并\n' +
    '/* eslint-disable */\n' +
    'export const PRODUCTS = [\n' +
    lines.join(',\n') +
    '\n];\n';
  fs.writeFileSync(PRODUCTS_PATH, content, 'utf8');
  return `${PRODUCTS_PATH}  (${list.length} 条)`;
}

/** 写一份「只含新增产品」的独立 JSON 到 crawler/out（便于查看,不影响前端数据） */
export function writeIncrementFile({ added, updated }, label) {
  const outDir = path.resolve(__dirname, '../out');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(outDir, `increment-${stamp}-${label || ''}.json`);
  fs.writeFileSync(
    file,
    JSON.stringify({ generatedAt: new Date().toISOString(), added, updated }, null, 2),
    'utf8'
  );
  return file;
}