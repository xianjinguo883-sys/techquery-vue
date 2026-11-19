/**
 * core/specMap.js
 * 把任意数据源（适配器）返回的「原始字段」规范化为前端使用的标准字段键。
 *
 * 前端 ProductModal 依据 src/data/specTemplate.js 里的字段归类（如“处理器 SoC”“运行内存”…）
 * 来分组展示。所以适配器产出的 specs 键必须能落回这些标准键，才能在前端正确展示。
 *
 * 这里定义：
 *  - FIELD_ALIASES：把常见的别名（英文/简写/中文变体）映射到标准键。
 *  - normalizeSpecs(rawSpecs)：给定原始 specs，输出仅含标准键的干净对象（未命中别名的字段保留原文案）。
 */

/**
 * 标准键 ← 常见别名（小写化后匹配）
 * 顺序重要：长的、更具体的键放在前面，避免被较短键误吞。
 */
const FIELD_ALIASES = {
  '处理器 SoC':   ['soc', 'processor soc', '处理器 soc', 'soc芯片', 'chipset', '处理器'],
  '制程':          ['process', '制程', '制造工艺', 'nm'],
  'CPU':           ['cpu', '中央处理器', 'cortex cpu'],
  'GPU':           ['gpu', '图形处理器'],
  'NPU/AI 能力':  ['npu', 'ai capability', 'ai算力', 'npu/ai能力', 'ai能力'],
  '运行内存':       ['ram', '内存', '运行内存', 'memory (ram)', 'random access memory'],
  '机身存储':       ['storage', 'rom', '机身存储', '内置存储', '内置储存'],
  '散热系统':       ['cooling', '散热', 'thermal', '散热系统'],
  '操作系统':       ['os', 'operating system', '操作系统', '系统'],
  '主屏':           ['display', 'screen', '主屏', '屏幕', '显示屏', 'display size'],
  '主摄':           ['main camera', 'rear camera', '主摄', '后摄', 'camera (main)', '主摄像头'],
  '超广角':         ['ultrawide', '超广角', 'ultra wide'],
  '长焦/潜望长焦': ['telephoto', 'periscope', '长焦', '潜望长焦'],
  '前置摄像头':     ['front camera', '前置摄像头', 'selfie', '前置'],
  '电池':           ['battery', '电池', '电池容量', 'battery capacity', '典型容量'],
  '有线充电':       ['wired charging', 'charging', '有线充电', '有线充电功率', '快充', '有线快充'],
  '无线/反向充电': ['wireless charging', 'reversed charging', '无线充电', '反向充电', '无线充电功率'],
  '尺寸/重量':     ['dimensions', 'size/weight', '尺寸', '重量', 'dimension', 'dimensions and weight'],
  '材质/配色':     ['materials', 'colors', '配色', '材质', 'color'],
  '防护等级':       ['ip rating', 'water resistance', '防护等级', '防水等级', '防水', 'ip68', 'ip等级'],
  '解锁方式':       ['unlock', '指纹', 'face id', '解锁方式', 'fingerprint'],
  '蜂窝网络':       ['cellular', '5g', '4g', '蜂窝网络', 'network'],
  '无线连接':       ['wifi', 'bluetooth', 'nfc', '无线连接', 'connectivity'],
  '接口/传感器':   ['ports', 'sensors', '接口', '传感器', 'usb'],
  '首发价格':       ['price', '首发价', 'price (msrp)', '首发价格'],
};

/** 去重 + 变小写 + 去特殊符号，用于别名匹配 */
function keyId(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[\s_\/\\\-\(\)\.:]+/g, ' ');
}

/** 由原始字段键 → 标准键（未命中返回 null） */
export function mapField(rawKey) {
  const id = keyId(rawKey);
  for (const [std, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const a of aliases) {
      if (id === keyId(a)) return std;
    }
  }
  return null;
}

/**
 * 规范化 specs：原始 {k:v} → 仅标准键。
 * - 能映射到标准键的，统一键名；
 * - 无法映射的字段保留（前端会兜底显示在“其他参数”）。
 */
export function normalizeSpecs(rawSpecs = {}) {
  const out = {};
  for (const [k, v] of Object.entries(rawSpecs)) {
    if (v === undefined || v === null || v === '') continue;
    const std = mapField(k) || k;
    out[std] = String(v);
  }
  return out;
}

/** 辅助：可以把规范化后的字段方便地传给标准化产品构建器 */
export { FIELD_ALIASES };