<script setup>
import { computed } from 'vue';
import { PRODUCTS } from '../data/products.js';
import { BRAND_COVERAGE } from '../data/brandCoverage.js';
import { BRAND_IMAGE_SOURCE } from '../data/brandImageSource.js';

const totalProd = computed(() => PRODUCTS.length);
const totalBrand = computed(() => new Set(PRODUCTS.map(p => p.brand)).size);
</script>

<template>
  <section class="fade-view">
    <div class="page-title">资料库说明</div>
    <div class="page-sub">统计口径、品牌覆盖、参数字段定义、数据来源与质量规范</div>

    <div class="info-stat">
      <div class="item"><div class="num">{{ totalProd }}</div><div class="lbl">产品总数</div></div>
      <div class="item"><div class="num">{{ totalBrand }}</div><div class="lbl">品牌数量</div></div>
      <div class="item"><div class="num">2020-2026</div><div class="lbl">统计期间</div></div>
      <div class="item"><div class="num">5</div><div class="lbl">产品类别</div></div>
    </div>

    <div class="info-section">
      <h2>一、统计范围与去重规则</h2>
      <table class="data-table">
        <thead><tr><th style="width:22%">项目</th><th>采用口径</th></tr></thead>
        <tbody>
          <tr><td><b>统计时间</b></td><td>2020-01-01 至 2026-11-14（含首尾日期）</td></tr>
          <tr><td><b>市场范围</b></td><td>全球市场；记录产品首次发布地区、后续上市地区及地区版本差异</td></tr>
          <tr><td><b>产品类别</b></td><td>智能手机、平板电脑、笔记本电脑、智能手表、智能手环、耳机</td></tr>
          <tr><td><b>计数单位</b></td><td>以独立产品型号为主；颜色不单独计数；存储/内存版本列为配置变体</td></tr>
          <tr><td><b>折叠设备</b></td><td>折叠屏手机归入智能手机；二合一电脑按主要操作系统与产品定位归类</td></tr>
          <tr><td><b>耳机</b></td><td>真无线、颈挂式、头戴式/头戴降噪耳机均纳入</td></tr>
          <tr><td><b>未发布/传闻</b></td><td>不纳入正式发布统计；仅在备注中说明且必须标注传闻</td></tr>
          <tr><td><b>价格</b></td><td>保留首发地区及原币种；不同市场价格不可直接混为同一价格</td></tr>
          <tr><td><b>参数缺失</b></td><td>统一填写"官方未公布/待核验"，不推测、不用第三方估值替代</td></tr>
        </tbody>
      </table>
    </div>

    <div class="info-section">
      <h2>二、品牌覆盖清单（{{ totalBrand }}个品牌）</h2>
      <table class="data-table">
        <thead><tr><th style="width:12%">品牌</th><th style="width:42%">主要纳入产品线</th><th>统计注意事项</th></tr></thead>
        <tbody>
          <tr v-for="r in BRAND_COVERAGE" :key="r[0]">
            <td><b style="color:var(--txt)">{{ r[0] }}</b></td><td>{{ r[1] }}</td><td>{{ r[2] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="info-section">
      <h2>三、每款产品应采集的详细参数字段</h2>
      <table class="data-table">
        <thead><tr><th style="width:18%">字段组</th><th>具体字段</th></tr></thead>
        <tbody>
          <tr><td><b>基础信息</b></td><td>品牌、产品全名、型号代码、产品类别、发布会日期、正式上市日期、首发国家/地区、全球上市地区</td></tr>
          <tr><td><b>价格信息</b></td><td>首发建议零售价、币种、容量/配置对应价格、首发地区、价格来源链接、是否含税</td></tr>
          <tr><td><b>手机/平板</b></td><td>SoC、CPU/GPU、屏幕尺寸/面板/分辨率/刷新率/峰值亮度、RAM、存储、后摄/前摄、电池、充电、无线充电、网络频段、Wi-Fi、蓝牙、NFC、接口、系统、尺寸、重量</td></tr>
          <tr><td><b>笔记本</b></td><td>处理器完整型号、核心/线程、独显/核显、显存、屏幕尺寸/分辨率/刷新率/色域、内存类型与容量、SSD容量/规格、电池Wh、接口、无线连接、摄像头、键盘、系统、尺寸、重量、适配器功率</td></tr>
          <tr><td><b>手表/手环</b></td><td>屏幕尺寸/类型/分辨率、芯片、传感器、定位系统、健康/运动功能、防水等级、电池容量/标称续航、充电方式、兼容系统、尺寸、重量、表带规格</td></tr>
          <tr><td><b>耳机</b></td><td>形态、单元尺寸/类型、主动降噪、通透模式、空间音频、蓝牙版本、编解码、麦克风数量、续航、充电盒续航、快充、无线充电、防水等级、重量、接口</td></tr>
          <tr><td><b>来源与质量</b></td><td>官方参数页、新闻稿、说明书/支持页、第三方交叉核验页、核验日期、信息可信度、备注</td></tr>
        </tbody>
      </table>
    </div>

    <div class="info-section">
      <h2>三-2、手机详细参数表标准模板（分类—参数项目—详细配置）</h2>
      <p>统一采用"分类—参数项目—详细配置"三列结构。每个型号单独建立一张参数表；同一型号的地区版、芯片版或关键配置不同的版本，分别列出差异。详情弹窗即按此模板分类展示。</p>
      <table class="data-table">
        <thead><tr><th style="width:14%">分类</th><th style="width:22%">参数项目</th><th>详细配置说明</th></tr></thead>
        <tbody>
          <tr><td rowspan="4"><b>基本信息</b></td><td>品牌/型号</td><td>品牌全称、产品名称、型号代码</td></tr>
          <tr><td>发布/开售时间</td><td>分别填写发布会日期、首销日期；注明时区或市场</td></tr>
          <tr><td>首发/销售地区</td><td>全球版、中国版、欧洲版、北美版等；注明地区差异</td></tr>
          <tr><td>产品类别</td><td>手机/平板/笔记本/手表/手环/耳机</td></tr>
          <tr><td rowspan="2"><b>核心性能</b></td><td>处理器</td><td>SoC完整名称、制程、CPU架构/核心数/最高频率、GPU</td></tr>
          <tr><td>NPU/AI能力</td><td>芯片型号或官方公布的AI算力/功能；未公布则注明</td></tr>
          <tr><td rowspan="2"><b>内存闪存</b></td><td>运行内存</td><td>LPDDR代际、容量及各销售版本</td></tr>
          <tr><td>机身存储</td><td>UFS代际/规格、容量版本、是否支持扩展</td></tr>
          <tr><td><b>散热</b></td><td>散热系统</td><td>VC均热板、石墨片、风扇/主动散热等；记录官方名称</td></tr>
          <tr><td><b>系统</b></td><td>操作系统</td><td>首发系统名称及版本、底层平台、承诺更新周期</td></tr>
          <tr><td rowspan="2"><b>屏幕</b></td><td>主屏</td><td>尺寸、面板、分辨率、比例、PPI、刷新率、LTPO、亮度、调光、HDR、玻璃</td></tr>
          <tr><td>副屏/背屏</td><td>尺寸、面板、分辨率、刷新率、用途；无则填不适用</td></tr>
          <tr><td rowspan="4"><b>后置相机</b></td><td>主摄</td><td>像素、传感器型号/尺寸、光圈、等效焦距、OIS、对焦</td></tr>
          <tr><td>超广角</td><td>像素、视角、光圈、自动对焦/微距</td></tr>
          <tr><td>长焦/潜望长焦</td><td>像素、传感器、光圈、光学变焦倍率、等效焦距、OIS</td></tr>
          <tr><td>其他/闪光灯</td><td>景深/黑白/光谱/ToF等及闪光灯配置</td></tr>
          <tr><td><b>前置相机</b></td><td>前置摄像头</td><td>像素、光圈、对焦方式、视频规格</td></tr>
          <tr><td rowspan="3"><b>电池充电</b></td><td>电池</td><td>典型/额定容量，单位mAh或Wh；注明官方口径</td></tr>
          <tr><td>有线充电</td><td>最高功率、协议、充电时间（注明测试条件）</td></tr>
          <tr><td>无线/反向充电</td><td>无线充电功率、反向无线/有线功率</td></tr>
          <tr><td rowspan="2"><b>机身结构</b></td><td>尺寸/重量</td><td>长×宽×厚、重量；按材质/版本分别记录</td></tr>
          <tr><td>材质/配色</td><td>中框、前后盖材质；全部官方配色</td></tr>
          <tr><td><b>机身防护</b></td><td>防护等级</td><td>IP等级、官方测试条件；避免将实验室条件扩大解释</td></tr>
          <tr><td><b>生物识别</b></td><td>解锁方式</td><td>指纹类型/位置、人脸识别等级</td></tr>
          <tr><td><b>音频</b></td><td>扬声器/麦克风</td><td>扬声器数量、立体声、杜比等认证、麦克风配置</td></tr>
          <tr><td rowspan="2"><b>网络连接</b></td><td>蜂窝网络</td><td>5G/4G制式、SA/NSA、频段；按地区版本区分</td></tr>
          <tr><td>无线连接</td><td>Wi-Fi版本、蓝牙版本、NFC、UWB、卫星通信</td></tr>
          <tr><td><b>接口传感器</b></td><td>接口/传感器</td><td>USB规格、红外、定位系统、陀螺仪、气压计等</td></tr>
          <tr><td rowspan="2"><b>价格与来源</b></td><td>首发价格</td><td>地区、币种、存储版本、首发建议零售价</td></tr>
          <tr><td>官方资料链接</td><td>官方产品页、新闻稿、规格页；附核验日期</td></tr>
        </tbody>
      </table>
    </div>

    <div class="info-section">
      <h2>五、质量控制规范</h2>
      <ul>
        <li>先从品牌官方发布新闻稿建立型号清单，再用规格数据库补充参数</li>
        <li>每个型号至少记录一个官方来源；关键硬件字段尽量使用第二个独立来源交叉核验</li>
        <li>严格区分发布日、预售日、正式开售日和不同国家/地区上市日</li>
        <li>全球同名型号若处理器、网络频段、屏幕或电池存在差异，必须拆分地区版本</li>
        <li>笔记本电脑不能只记录产品系列名；必须记录完整子型号或配置代码</li>
        <li>首发价格保留原币种、地区和配置，不把后期促销价当作首发价</li>
        <li>产品未公布的电池容量、RAM等参数标记为未公布，不根据拆机或传闻擅自填入</li>
        <li>完成数据后按品牌、年份、类别做重复项检查，并保留原始来源链接与核验日期</li>
      </ul>
      <h3 style="margin-top:16px">填写与核验规则</h3>
      <ul>
        <li>官方已公布的参数优先使用官方规格页、产品说明书和新闻稿</li>
        <li>官方未公布的参数写"官方未公布"；第三方拆解值必须标注"第三方测得/拆解"，不得混写成官方参数</li>
        <li>不同地区处理器、网络频段、电池、充电器或存储版本不同的，分地区/版本记录</li>
        <li>处理器制程、峰值亮度、续航、防水等容易被营销表述混淆的字段，必须记录来源和测试条件</li>
        <li>发布日期、上市日期、首发价分别记录；价格必须同时写明地区、币种和配置</li>
        <li>每条产品记录至少保留一个官方来源链接和核验日期；关键参数建议交叉核验</li>
      </ul>
    </div>

    <div class="info-section">
      <h2>六、18品牌官方图片素材入口</h2>
      <p>本清单优先列出品牌官方媒体中心、Press Photos、产品新闻资料包或官方产品页。点击链接可跳转至对应品牌的官方素材库获取高清产品图。使用前请查看各品牌的图片使用授权规范。</p>
      <div class="info-note" style="margin-bottom:14px">
        <b>重要：</b>这是一份"官方入口索引"，不是已下载的图片。品牌官方网站、媒体中心和产品页的图片使用条件不同；下载前请检查授权范围。若用于正式商业网站，请向品牌公关/媒体部门确认网页展示、缓存、裁切和再分发权限。优先使用无水印高清产品主图。
      </div>
      <table class="data-table">
        <thead><tr><th style="width:10%">品牌</th><th style="width:26%">官方素材入口/页面</th><th style="width:28%">网址</th><th>使用提示</th></tr></thead>
        <tbody>
          <tr v-for="s in BRAND_IMAGE_SOURCE" :key="s.brand">
            <td><b style="color:var(--txt)">{{ s.brand }}</b></td>
            <td>{{ s.entry }}</td>
            <td><a :href="s.url" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none;word-break:break-all">{{ s.url }}</a></td>
            <td>{{ s.tip }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="info-note">
      <b>完整性说明：</b>本资料库是可继续扩充的第一版资料底稿。全球范围内，同一产品可能存在不同国家/地区版本、蜂窝版/Wi-Fi版、不同内存组合、运营商定制型号及区域独占型号。未能从可靠来源确认的项目标记为"待核验"，不自行补值。统计截止日期：2026年11月14日。
    </div>
  </section>
</template>

<style scoped>
.info-section{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:22px 24px;margin-bottom:18px}
.info-section h2{font-size:18px;font-weight:700;margin-bottom:12px;color:var(--accent);padding-bottom:8px;border-bottom:1px solid var(--border)}
.info-section h3{font-size:15px;font-weight:700;margin:14px 0 8px;color:var(--txt)}
.info-section p{font-size:13px;color:var(--txt-dim);margin-bottom:10px;line-height:1.8}
.info-section ul{list-style:disc;padding-left:22px;margin-bottom:10px}
.info-section li{font-size:13px;color:var(--txt-dim);margin-bottom:6px;line-height:1.7}
.data-table{width:100%;border-collapse:collapse;margin:10px 0;font-size:12px}
.data-table th{background:var(--panel2);color:var(--accent);padding:9px 11px;text-align:left;font-weight:700;border:1px solid var(--border);font-size:11px}
.data-table td{padding:8px 11px;border:1px solid var(--border);color:var(--txt-dim);vertical-align:top;line-height:1.6}
.data-table tr:hover td{background:var(--panel2)}
.info-note{background:rgba(76,194,255,.08);border-left:3px solid var(--accent);padding:12px 16px;border-radius:6px;font-size:13px;color:var(--txt-dim);margin:12px 0;line-height:1.8}
.info-stat{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:14px 0}
.info-stat .item{background:var(--panel2);border:1px solid var(--border);border-radius:10px;padding:14px;text-align:center}
.info-stat .item .num{font-size:26px;font-weight:800;color:var(--accent)}
.info-stat .item .lbl{font-size:11px;color:var(--txt-dim);margin-top:4px}
</style>