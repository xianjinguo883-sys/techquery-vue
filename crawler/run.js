#!/usr/bin/env node
/**
 * crawler/run.js
 * 手动触发「新品抓取」的命令行入口。
 *
 * 用法：
 *   node crawler/run.js                 # 预览：抓取全部适配器，显示新增/更新，但不写入
 *   node crawler/run.js --apply         # 抓取并真正写回 src/data/products.js
 *   node crawler/run.js --brand 小米     # 只抓指定品牌
 *   node crawler/run.js --brand 小米,Apple --apply
 *
 * package.json 里可加脚本： "crawl": "node crawler/run.js"
 */

import { REGISTRY } from './adapters/index.js';
import { runCrawl } from './core/engine.js';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const brandOpt = args.find((a, i) => a === '--brand' && args[i + 1]);

let brands;
if (brandOpt) {
  brands = args[args.indexOf('--brand') + 1]
    .split(/[,， 、]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function fmt(n) { return String(n).padStart(3, ' '); }

console.log('==================================================');
console.log(' TechQuery 新品抓取器');
console.log('==================================================');
console.log('模式:', apply ? '写回数据(APPLY)' : '仅预览(不写回)');
if (brands) console.log('仅品牌:', brands.join('、'));
console.log('适配器:', REGISTRY.map(a => `${a.id}(${a.brands.join('/')})`).join('  '));
console.log('--------------------------------------------------');

try {
  const { reports, added, updated, merged, wroteBack, incrementFile } =
    await runCrawl(REGISTRY, { brands, apply });

  console.log('\n—— 各品牌抓取报告 ——');
  let totalRaw = 0, totalAdded = 0, totalUpdated = 0;
  for (const r of reports) {
    totalRaw += r.rawCount || 0;
    totalAdded += r.addedCount || 0;
    totalUpdated += r.updatedCount || 0;
    if (r.error) {
      console.log(` ${r.brand.padEnd(12)}  [错误] ${r.error}`);
    } else {
      console.log(
        ` ${r.brand.padEnd(12)} 原始 ${fmt(r.rawCount)} · 新增 ${fmt(r.addedCount)} · 更新 ${fmt(r.updatedCount)} · 未变 ${fmt(r.unchangedCount)}`
      );
    }
  }

  console.log('\n—— 汇总 ——');
  console.log(` 抓取原始记录: ${totalRaw}`);
  console.log(` 新增产品:     ${totalAdded}`);
  console.log(` 更新产品:     ${totalUpdated}`);
  console.log(` 合并后产品总数: ${merged.length}`);

  if (added.length) {
    console.log('\n—— 新增产品明细 ——');
    added.forEach(p => console.log(`  + [${p.brand}] ${p.name} (${p.type}/${p.date}) ¥${p.price}`));
  }
  if (updated.length) {
    console.log('\n—— 更新产品明细 ——');
    updated.forEach(({ before, after }) =>
      console.log(`  ~ ${before.brand} ${before.name}: "${before.desc}" → "${after.desc}"`));
  }

  if (incrementFile) console.log('\n 增量明细已写入: ' + incrementFile);
  if (wroteBack) console.log(' 数据已写回: src/data/products.js ✅');
  else console.log('\n（未写回。确认无误后加 --apply 才会真正更新网站数据）');

  process.exit(0);
} catch (e) {
  console.error('\n抓取失败:', e.stack || e.message);
  process.exit(1);
}