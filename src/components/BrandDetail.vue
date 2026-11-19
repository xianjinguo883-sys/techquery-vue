<script setup>
import { ref, computed, watch } from 'vue';
import { TYPE_ORDER } from '../data/typeOrder.js';
import { BRAND_IMAGE_SOURCE } from '../data/brandImageSource.js';
import { PRODUCTS_BY_BRAND, getBrandMeta, findProductByName } from '../utils/index.js';

const props = defineProps({
  brand: { type: String, default: null },
});
const emit = defineEmits(['open-product', 'back']);

const search = ref('');
let searchTimer = null;

const brandPros = computed(() =>
  props.brand ? PRODUCTS_BY_BRAND.get(props.brand) || [] : []
);

const meta = computed(() => getBrandMeta(props.brand, { c1: '#2a3340', c2: '#1a2028' }));
const imgSource = computed(() =>
  BRAND_IMAGE_SOURCE.find(s => s.brand === props.brand)
);

const years = computed(() => {
  const ys = [...new Set(brandPros.value.map(p => p.date.slice(0, 4)))].sort();
  return { first: ys[0], last: ys[ys.length - 1] };
});

const types = computed(() => [...new Set(brandPros.value.map(p => p.type))]);

// 展开的分类集合
const openTypes = ref(new Set());

/** 过滤后按类别分组，返回有序分组 */
const groups = computed(() => {
  let list = brandPros.value;
  const q = search.value.trim().toLowerCase();
  if (q) {
    list = list.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q)
    );
  }
  const map = {};
  list.forEach(p => { if (!map[p.type]) map[p.type] = []; map[p.type].push(p); });
  const out = [];
  TYPE_ORDER.forEach(t => {
    if (map[t.key]) {
      out.push({
        key: t.key, icon: t.icon, label: t.label,
        items: map[t.key].slice().sort((a, b) => b.date.localeCompare(a.date)),
      });
    }
  });
  return out;
});

// 防抖搜索
function onSearch() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    // 搜索时自动展开所有分组
    if (search.value.trim()) {
      openTypes.value = new Set(groups.value.map(g => g.key));
    }
  }, 200);
}

function toggle(type) {
  const next = new Set(openTypes.value);
  if (next.has(type)) next.delete(type);
  else next.add(type);
  openTypes.value = next;
}

function isOpen(type) {
  return openTypes.value.has(type);
}

function openProduct(p) {
  emit('open-product', p);
}

// 进入详情时默认展开第一个分组
watch(
  () => props.brand,
  () => {
    openTypes.value = new Set();
    search.value = '';
  },
  { immediate: true }
);

watch(groups, (g) => {
  if (openTypes.value.size === 0 && g.length && !search.value.trim()) {
    openTypes.value = new Set([g[0].key]);
  }
});
</script>

<template>
  <section class="fade-view">
    <div class="brand-header" :style="{ '--bc': `linear-gradient(135deg, ${meta.c1}, ${meta.c2})` }">
      <span v-html="meta.svg"></span>
      <div class="bh-info">
        <div class="bh-name">{{ brand }}</div>
        <div class="bh-en">{{ brandPros.length ? brandPros[0].brandEn : brand }}</div>
        <div class="bh-meta">共 {{ brandPros.length }} 款产品 · 类型：{{ types.join(' / ') }} · 时间：{{ years.first }} - {{ years.last }}</div>
      </div>
      <a
        v-if="imgSource"
        :href="imgSource.url"
        target="_blank"
        rel="noopener"
        class="img-source-btn"
        :title="imgSource.tip"
      >🖼️ 官方图片素材入口</a>
    </div>

    <div class="search-box">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input v-model="search" type="text" placeholder="搜索该品牌的产品名称或描述..." @input="onSearch">
    </div>

    <div v-if="groups.length" class="cat-list">
      <div
        v-for="g in groups"
        :key="g.key"
        class="cat-group"
        :class="{ open: isOpen(g.key) }"
      >
        <div class="cat-head" @click="toggle(g.key)">
          <span class="cat-icon">{{ g.icon }}</span>
          <span class="cat-title">{{ g.label }}</span>
          <span class="cat-count">{{ g.items.length }} 款</span>
          <span class="cat-chevron">▶</span>
        </div>
        <div class="cat-body">
          <div class="cat-body-inner">
            <div class="cat-grid">
              <div class="prod-card" v-for="p in g.items" :key="p.name + '|' + p.type" @click="openProduct(p)">
                <div class="prod-thumb" :style="{ '--pc1': p.c1, '--pc2': p.c2 }">{{ p.emoji }}</div>
                <div class="prod-body">
                  <div class="prod-name">{{ p.name }}</div>
                  <div class="prod-desc">{{ p.desc }}</div>
                  <div class="prod-foot">
                    <span class="prod-price">¥{{ Number(p.price || 0).toLocaleString() }}</span>
                    <span class="prod-date">{{ (p.date || '').slice(0, 7) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <div class="big">🔍</div>没有找到匹配的产品
    </div>
  </section>
</template>

<style scoped>
.brand-header{
  display:flex;align-items:center;gap:18px;padding:22px;border-radius:16px;margin-bottom:24px;
  background:var(--bc,linear-gradient(135deg,#2a3340,#1a2028));border:1px solid var(--border);position:relative;overflow:hidden;
}
.brand-header::before{content:"";position:absolute;top:-30px;right:-30px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%)}
.brand-header svg{width:64px;z-index:1;filter:drop-shadow(0 6px 16px rgba(0,0,0,.5))}
.brand-header .bh-info{z-index:1}
.brand-header .bh-name{font-size:26px;font-weight:800}
.brand-header .bh-en{color:var(--accent);font-size:14px;font-weight:600;margin-top:2px}
.brand-header .bh-meta{color:var(--txt-dim);font-size:13px;margin-top:8px}
.img-source-btn{
  margin-left:auto;z-index:1;padding:10px 16px;border-radius:9px;
  background:rgba(0,0,0,.3);color:#fff;text-decoration:none;font-size:13px;font-weight:600;
  border:1px solid rgba(255,255,255,.2);transition:all .2s;display:inline-flex;align-items:center;gap:6px;
  backdrop-filter:blur(6px);white-space:nowrap;
}
.img-source-btn:hover{background:var(--accent);color:#0a0e14;border-color:var(--accent)}

.search-box{margin-bottom:22px;position:relative}
.search-box input{
  width:100%;padding:12px 14px 12px 40px;border-radius:10px;border:1px solid var(--border);
  background:var(--panel);color:var(--txt);font-size:14px;outline:none;transition:border .2s;
}
.search-box input:focus{border-color:var(--accent)}
.search-box svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--txt-dim)}

.cat-group{margin-bottom:14px;background:var(--panel);border:1px solid var(--border);border-radius:14px;overflow:hidden;animation:cardIn .45s cubic-bezier(.22,.61,.36,1) both}
@keyframes cardIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.cat-head{padding:16px 20px;display:flex;align-items:center;gap:12px;cursor:pointer;user-select:none;transition:background .2s}
.cat-head:hover{background:var(--panel2)}
.cat-icon{font-size:24px}
.cat-title{font-size:17px;font-weight:700;flex:1}
.cat-count{font-size:12px;color:var(--txt-dim);background:var(--panel2);padding:4px 12px;border-radius:20px;font-weight:600}
.cat-chevron{width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:var(--txt-dim);transition:transform .35s cubic-bezier(.22,.61,.36,1);font-size:14px}
.cat-group.open .cat-chevron{transform:rotate(90deg);color:var(--accent)}
.cat-body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.22,.61,.36,1)}
.cat-group.open .cat-body{grid-template-rows:1fr}
.cat-body-inner{overflow:hidden}
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;padding:4px 20px 20px}

.prod-card{
  background:var(--panel2);border:1px solid var(--border);border-radius:12px;overflow:hidden;
  transition:transform .15s ease,border-color .15s,box-shadow .15s;cursor:pointer;will-change:transform;
}
.prod-card:hover{transform:translateY(-3px);border-color:var(--accent);box-shadow:0 8px 24px rgba(0,0,0,.4)}
.prod-thumb{height:110px;display:flex;align-items:center;justify-content:center;font-size:42px;background:linear-gradient(135deg,var(--pc1,#2a3340),var(--pc2,#1a2028))}
.prod-body{padding:13px}
.prod-name{font-size:15px;font-weight:700;margin-bottom:5px}
.prod-desc{font-size:12px;color:var(--txt-dim);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:10px}
.prod-foot{display:flex;justify-content:space-between;align-items:center;font-size:13px}
.prod-price{color:var(--green);font-weight:700}
.prod-date{color:var(--txt-dim);font-size:11px}
.empty{text-align:center;padding:50px 20px;color:var(--txt-dim)}
.empty .big{font-size:54px;margin-bottom:10px}
</style>