/**
 * adapters/demoAdapter.js
 * 内置演示数据源。
 *
 * 由于当前环境无法连接 GSMArena/techspecs 等真实聚合站，
 * 本适配器用一份“模拟新品发布会”数据源来验证整条自动更新管线：
 *   拉取 → 规范化（字段对齐）→ 去重合并 → 生成可合并的数据更新。
 *
 * 注意：这里返回的是“原始结构”（raw fields 故意是英文/别名字段），
 * 目的就是演示 normalizer/specMap 如何把任意来源字段对齐到前端标准字段。
 * 等有真实可访问的源/API 时，只替换本文件里 fetchNew() 的实现即可。
 */

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** 模拟的「新品」数据集：每个品牌给出几条新发布的、公开配置的产品 */
const MOCK_NEW_RELEASES = [
  {
    brand: 'Apple',
    raw: {
      brand: 'Apple',
      name: 'iPhone 20 Pro',
      type: '手机',
      date: '2026-09',
      price: '¥9999',
      desc: 'Apple A21 Pro（演示新品）',
      specs: {
        'SoC': 'Apple A21 Pro',              // 别名 → “处理器 SoC”
        'Process': '台积电2nm',              // 别名 → “制程”
        'RAM': '12GB',                        // 别名 → “运行内存”
        'Storage': '256GB/512GB/1TB',         // 别名 → “机身存储”
        'Main Camera': '4800万像素融合，f/1.6',
        'Ultrawide': '4800万像素超广角',
        'Battery': '官方未公布容量',
        'Price (MSRP)': '中国版9999元起',
      },
    },
  },
  {
    brand: '小米',
    raw: {
      brand: '小米',
      name: '小米 18 Pro',
      type: '手机',
      date: '2026-11',
      price: 5299,
      desc: '高通骁龙8 Elite Gen 6（演示新品）',
      specs: {
        '处理器 soc': '高通骁龙8 Elite Gen 6', // 别名（大小写/空格不一致）→ “处理器 SoC”
        'ram': '16GB LPDDR5X',                 // 别名 → “运行内存”
        'storage': '512GB UFS 5.0',            // 别名 → “机身存储”
        '显示屏': '6.8英寸 AMOLED LTPO 120Hz',  // 别名 → “主屏”
        '电池容量': '6500mAh',                  // 别名 → “电池”
        '有线充电功率': '120W',                 // 别名 → “有线充电”
        '防水等级': 'IP69',                    // 别名 → “防护等级”
      },
    },
  },
  {
    brand: '华为',
    raw: {
      brand: '华为',
      name: 'Mate 80 Pro',
      type: '手机',
      date: '2026-09',
      price: 6999,
      desc: '麒麟9030（演示新品）',
      specs: {
        'SoC': '麒麟9030',
        'OS': 'HarmonyOS NEXT',               // 别名 → “操作系统”
        'Display': '6.9英寸 OLED LTPO',        // 别名 → “主屏”
        'Front Camera': '1300万像素',
        'Dimensions': '164×78×8.2mm，约220g', // 别名 → “尺寸/重量”
        'Colors': '曜金黑、青山黛',
      },
    },
  },
];

/** 拉取「该品牌」的新品（模拟网络延迟，返回原始结构）。brand 可选，不传则返回全部。 */
export async function fetchDemoNewReleases(brand) {
  await delay(120); // 模拟网络请求耗时
  const list = MOCK_NEW_RELEASES.filter(r => !brand || r.brand === brand);
  return list.map(r => r.raw);
}

export const demoAdapter = {
  id: 'demo-local',
  sourceName: '内置演示源(模拟新品)',
  brands: ['Apple', '小米', '华为'],
  async fetchNew(brand) {
    return fetchDemoNewReleases(brand);
  },
};