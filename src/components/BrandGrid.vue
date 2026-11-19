<script setup>
import { computed } from 'vue';
import { getBrands, getBrandMeta } from '../utils/index.js';

const brands = computed(() => getBrands());

function metaOf(brand) {
  return getBrandMeta(brand, { c1: '#2a3340', c2: '#1a2028' });
}
</script>

<template>
  <section class="fade-view">
    <div class="page-title">选择品牌</div>
    <div class="page-sub">点击品牌卡片，查看该品牌 2020 年至今发布的所有电子产品</div>

    <div class="brand-grid">
      <div
        v-for="(b, i) in brands"
        :key="b.brand"
        class="brand-card"
        :style="{ animationDelay: (i * 0.05) + 's' }"
        @click="$emit('select-brand', b.brand)"
      >
        <div class="brand-cover" :style="{ '--bc': `linear-gradient(135deg, ${metaOf(b.brand).c1}, ${metaOf(b.brand).c2})` }">
          <div class="brand-arrow">→</div>
          <span v-html="metaOf(b.brand).svg"></span>
          <div class="cover-model">{{ b.model || b.brand }}</div>
        </div>
        <div class="brand-body">
          <div class="brand-name">{{ b.brand }}</div>
          <div class="brand-en">{{ b.brandEn }}</div>
          <div class="brand-stat">
            <span><b>{{ b.count }}</b> 款产品</span>
            <span>{{ Object.keys(b.types).join(' · ') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===== 品牌卡片墙 ===== */
.brand-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}
.brand-card{
  background:var(--panel);border:1px solid var(--border);border-radius:16px;
  overflow:hidden;cursor:pointer;transition:transform .25s cubic-bezier(.22,.61,.36,1),border-color .25s,box-shadow .25s;
  position:relative;animation:cardIn .5s cubic-bezier(.22,.61,.36,1) both;
}
@keyframes cardIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.brand-card:hover{transform:translateY(-4px);border-color:var(--accent);box-shadow:0 10px 30px rgba(0,0,0,.4)}
.brand-cover{
  height:170px;display:flex;align-items:center;justify-content:center;
  background:var(--bc,linear-gradient(135deg,#2a3340,#1a2028));
  position:relative;overflow:hidden;
}
.brand-cover svg{width:88px;height:auto;transition:transform .2s ease}
.brand-card:hover .brand-cover svg{transform:scale(1.04)}
.brand-cover .cover-model{
  position:absolute;bottom:10px;left:14px;font-size:11px;color:rgba(255,255,255,.7);font-weight:600;z-index:2;
  background:rgba(0,0,0,.35);padding:3px 8px;border-radius:6px;backdrop-filter:blur(4px);
}
.brand-arrow{
  position:absolute;top:14px;right:14px;width:30px;height:30px;border-radius:50%;
  background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:16px;transition:transform .25s;z-index:2;
}
.brand-card:hover .brand-arrow{transform:translateX(3px);background:var(--accent);color:#0a0e14}
.brand-body{padding:16px}
.brand-name{font-size:18px;font-weight:700;margin-bottom:4px}
.brand-en{font-size:12px;color:var(--accent);font-weight:600;margin-bottom:10px}
.brand-stat{display:flex;gap:14px;font-size:12px;color:var(--txt-dim);flex-wrap:wrap}
.brand-stat b{color:var(--txt);font-size:15px;font-weight:700}
</style>