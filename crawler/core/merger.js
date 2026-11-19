/**
 * core/merger.js
 * 把适配器拉取的新产品与现有产品库去重、合并，输出增量。
 *
 * 去重键：品牌 + 产品名（同名不同品类时追加类型）。
 * 与 src/utils/index.js 的 PRODUCT_INDEX 口径保持一致：enterprise 按 brand+name 去重，
 * 同名不同 type 视为两条。
 */

/** 构造产品的稳定去重键 */
export function productKey(p) {
  return `${p.brand || ''}|${p.name || ''}`;
}

/**
 * 合并新一批标准产品与现有列表。
 * @param {Array} existing - 现有标准产品数组（来自 products.js）
 * @param {Array} incoming - 适配器返回、已标准化的产品数组
 * @returns {{ merged: Array, added: Array, updated: Array, unchanged: number }}
 *   merged: 合并后的完整列表；added: 新增；updated: 同键但内容有变化的；unchanged: 未变化数量
 */
export function mergeProducts(existing, incoming) {
  const byKey = new Map();
  existing.forEach(p => {
    // 处理同名不同 type：若同键已存在，用 key+type 区分
    const k = byKey.has(productKey(p)) ? productKey(p) + '|' + p.type : productKey(p);
    byKey.set(k, p);
  });

  const added = [];
  const updated = [];
  let unchanged = 0;

  for (const item of incoming) {
    let k = productKey(item);
    if (byKey.has(k)) {
      // 可能要进一步区分 type
      if (byKey.get(k).type !== item.type && !byKey.has(k + '|' + item.type)) {
        k = k + '|' + item.type;
      }
    } else if (!byKey.has(k)) {
      // 尝试按 name+type 完全匹配
      if (byKey.has(k + '|' + item.type)) k = k + '|' + item.type;
    }

    if (!byKey.has(k)) {
      byKey.set(k, item);
      added.push(item);
    } else {
      const prev = byKey.get(k);
      if (!sameContent(prev, item)) {
        byKey.set(k, item); // 用新内容覆盖
        updated.push({ before: prev, after: item });
      } else {
        unchanged++;
      }
    }
  }

  return { merged: [...byKey.values()], added, updated, unchanged };
}

/** 判断两条产品内容是否完全一致（比较可序列化字段，忽略数组/对象键顺序差异） */
function sameContent(a, b) {
  return JSON.stringify(strip(a)) === JSON.stringify(strip(b));
}
function strip(o) {
  const { brand, name, type, date, price, desc, specs, emoji, c1, c2 } = o || {};
  return { brand, name, type, date, price, desc, specs, emoji, c1, c2 };
}