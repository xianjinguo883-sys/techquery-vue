/**
 * core/engine.js
 * 爬虫引擎：把「数据源适配器 → 规范化 → 去重合并 → 持久化」整条管线串起来。
 *
 * 运行流程：
 *   1. 读取现有产品库（src/data/products.js，829 条）
 *   2. 遍历要触发的适配器，调用 fetchNew(brand) 拿到原始新品
 *   3. 用 normalizer.buildProduct 规范化成标准产品
 *   4. 用 merger.addToLibrary 与现有库去重合并（得到新增/更新/全量）
 *   5. 记录结果；是否真正写回由调用方决定（CLI 提供 --apply 才写回）
 */

import { loadProducts, saveProducts, writeIncrementFile } from './dataStore.js';
import { buildProducts } from './normalizer.js';
import { mergeProducts } from './merger.js';

/**
 * 执行完整抓取合并。
 * @param {Array} adapters 适配器列表
 * @param {object} opts
 *   - brands?: string[] 只抓指定品牌（默认全部）
 *   - apply?: boolean    为 true 时把合并结果写回 src/data/products.js
 * @returns Promise<{ reports: Array, added: Array, updated: Array, merged, wroteBack, incrementFile }>
 */
export async function runCrawl(adapters, { brands, apply = false } = {}) {
  // 基线：真正的现有产品库
  const baseline = await loadProducts();

  const reports = [];
  const added = [];
  const updated = [];

  for (const adapter of adapters) {
    const brandList = brands
      ? adapter.brands.filter(b => brands.includes(b))
      : adapter.brands;

    for (const brand of brandList) {
      let rawList = [];
      try {
        rawList = await adapter.fetchNew(brand);
      } catch (e) {
        reports.push({ adapter: adapter.id, brand, error: e.message, rawCount: 0, addedCount: 0 });
        continue;
      }
      const standard = buildProducts(rawList);
      const { merged, added: a, updated: u, unchanged } = mergeProducts(baseline, standard);
      // 逐品牌合并时以 merged 为下一批的基线，并把它作为最终 merged
      baseline.splice(0, baseline.length, ...merged);
      added.push(...a);
      updated.push(...u);
      reports.push({
        adapter: adapter.id,
        source: adapter.sourceName,
        brand,
        rawCount: rawList.length,
        addedCount: a.length,
        updatedCount: u.length,
        unchangedCount: unchanged,
      });
    }
  }

  let wroteBack = false;
  let incrementFile = null;
  if (apply) {
    saveProducts(baseline);
    wroteBack = true;
  }
  if (added.length || updated.length) {
    incrementFile = writeIncrementFile({ added, updated }, brands ? brands.join('-') : 'all');
  }

  return { reports, added, updated, merged: baseline, wroteBack, incrementFile };
}