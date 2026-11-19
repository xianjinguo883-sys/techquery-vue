/**
 * adapters/index.js
 * 数据源适配器注册表。
 *
 * 每个适配器是一个模块，必须实现统一的接口：
 *   {
 *     id: string,             // 唯一标识，如 "demo-local"
 *     sourceName: string,     // 人类可读来源名，如 “内置演示源”“GSMArena”
 *     brands: string[],       // 该适配器负责的品牌（用中英文名）
 *     fetchNew(): Promise<Array<rawProduct>>  // 拉取该适配器负责品牌的最新产品（原始结构）
 *   }
 *
 * 后续接入真实源（GSMArena/API 等）时，只需新增一个适配器模块并在
 * REGISTRY 里注册即可，其余（规范化/去重/合并/触发）机制完全复用。
 */

import { demoAdapter } from './demoAdapter.js';

export const REGISTRY = [
  demoAdapter,
];

/** 按品牌返回应使用的适配器（未注册则 null） */
export function resolveAdapter(brand) {
  return REGISTRY.find(a => a.brands.includes(brand)) || null;
}

/** 全部分组，方便一次性触发 */
export function allAdapters() {
  return REGISTRY;
}