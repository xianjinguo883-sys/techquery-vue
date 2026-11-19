/**
 * core/normalizer.js
 * 规范化 + 构建「标准产品对象」，与 src/data/products.js 中现有产品的字段结构完全一致。
 *
 * 产品标准结构（与现有数据保持一致）：
 * {
 *   brand, name, type, date, price, desc,
 *   specs: { 标准字段键: 值 },   // 键需能落回 specTemplate 的字段
 *   emoji, c1, c2
 * }
 */

import { normalizeSpecs } from './specMap.js';

/** 类型 → 图标（来自 TYPE_ORDER，键需一致：手机/电脑/平板/穿戴/耳机） */
export const TYPE_EMOJI = {
  '手机': '📱',
  '电脑': '💻',
  '平板': '📊',
  '穿戴': '⌚',
  '耳机': '🎧',
};

/** 类型 → 默认卡片渐变色（同现有风格） */
export const TYPE_COLORS = {
  '手机': ['#2a3340', '#1a2028'],
  '电脑': ['#1a5a8a', '#0a2a4a'],
  '平板': ['#1a6a6a', '#0a3a3a'],
  '穿戴': ['#4a8a4a', '#1a5a1a'],
  '耳机': ['#5a4a9a', '#2a2a5a'],
};

/** 把 yyyy-mm / yyyy- mm-dd / yyyy 归一为前端日期格式（yyyy-mm），适配器可能给任意位数 */
export function normalizeDate(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  const m = s.match(/^(\d{4})[-/.]?(\d{1,2})?/);
  if (!m) return s.slice(0, 7);
  const y = m[1];
  const mm = m[2] ? String(m[2]).padStart(2, '0') : '01';
  return `${y}-${mm}`;
}

/** 价格转数字：去除货币符号/千分位；无法解析返回 0（与现有“官方未公布”用 0 一致） */
export function normalizePrice(raw) {
  if (raw === undefined || raw === null || raw === '') return 0;
  const s = String(raw).replace(/[^\d.-]/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

/**
 * 构建标准产品对象。
 * @param {object} raw - 适配器返回的原始产品，字段约定：
 *   brand, name, type, date, price, desc,
 *   specs  原始 specs（任意键，会经 normalizeSpecs 对齐标准键）
 * @returns {object} 标准产品对象
 */
export function buildProduct(raw) {
  const type = raw.type || '手机';
  const colors = TYPE_COLORS[type] || TYPE_COLORS['手机'];
  return {
    brand: raw.brand,
    name: raw.name,
    type,
    date: normalizeDate(raw.date),
    price: normalizePrice(raw.price),
    desc: raw.desc || '',
    specs: normalizeSpecs(raw.specs || {}),
    emoji: raw.emoji || TYPE_EMOJI[type] || '📱',
    c1: raw.c1 || colors[0],
    c2: raw.c2 || colors[1],
  };
}

/** 从一批原始产品构建标准产品数组 */
export function buildProducts(rawList = []) {
  return rawList.map(buildProduct);
}