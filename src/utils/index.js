import { PRODUCTS } from '../data/products.js';
import { BRAND_META } from '../data/brandMeta.js';

/** 产品名 → 产品 索引（加速点击查找，避免遍历全部产品） */
export const PRODUCT_INDEX = new Map();
PRODUCTS.forEach(p => {
  if (!PRODUCT_INDEX.has(p.name)) PRODUCT_INDEX.set(p.name, p);
  else PRODUCT_INDEX.set(p.name + '|' + p.type, p); // 同名不同品类，用 name|type 区分
});

/** 按品牌预分组索引（避免每次进入详情都 filter 全部产品） */
export const PRODUCTS_BY_BRAND = new Map();
PRODUCTS.forEach(p => {
  if (!PRODUCTS_BY_BRAND.has(p.brand)) PRODUCTS_BY_BRAND.set(p.brand, []);
  PRODUCTS_BY_BRAND.get(p.brand).push(p);
});

/** 由品牌名解析产品：优先 name|type */
export function findProductByName(name, type) {
  return PRODUCT_INDEX.get(name + '|' + type) || PRODUCT_INDEX.get(name);
}

/** 品牌聚合信息：品牌名 → {brand, brandEn, model, count, types, meta, svg} */
export function getBrands() {
  const map = {};
  PRODUCTS.forEach(p => {
    if (!map[p.brand]) {
      const meta = BRAND_META[p.brand] || { en: p.brand, model: '', emoji: '🏷️' };
      map[p.brand] = { brand: p.brand, brandEn: meta.en, model: meta.model, count: 0, types: {} };
    }
    map[p.brand].count++;
    map[p.brand].types[p.type] = (map[p.brand].types[p.type] || 0) + 1;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

/** 品牌元信息（含预生成的 SVG 封面字符串） */
export function getBrandMeta(brand, fallback = {}) {
  return BRAND_META[brand] || Object.assign({ svg: '', c1: '#2a3340', c2: '#1a2028' }, fallback);
}