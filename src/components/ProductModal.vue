<script setup>
import { computed, watch, onBeforeUnmount } from 'vue';
import { SPEC_TEMPLATE } from '../data/specTemplate.js';

const props = defineProps({
  product: { type: Object, default: null },
});
const emit = defineEmits(['close']);

const show = computed(() => !!props.product);

// Esc 关闭弹窗
function onKeydown(e) {
  if (e.key === 'Escape' && show.value) emit('close');
}
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown));
watch(show, (v) => {
  if (v) document.addEventListener('keydown', onKeydown);
  else document.removeEventListener('keydown', onKeydown);
});

/** 按规范模板把 specs 归为若干分类组 */
const specGroups = computed(() => {
  const p = props.product;
  if (!p) return [];
  const tmpl = SPEC_TEMPLATE[p.type] || SPEC_TEMPLATE['手机'];
  const groups = [];
  tmpl.forEach(group => {
    const rows = group.fields.filter(f => p.specs && p.specs[f]);
    if (rows.length) groups.push({
      icon: group.icon,
      cat: group.cat,
      rows: rows.map(f => ({ key: f, val: p.specs[f] })),
    });
  });
  // 兜底：未被分类覆盖的字段
  const covered = new Set();
  tmpl.forEach(g => g.fields.forEach(f => covered.add(f)));
  const extra = Object.entries(p.specs || {}).filter(([k]) => !covered.has(k));
  if (extra.length) {
    groups.push({ icon: '📋', cat: '其他参数', rows: extra.map(([k, v]) => ({ key: k, val: v })) });
  }
  return groups;
});

function priceLabel(p) {
  if (!p) return '0';
  return Number(p.price || 0).toLocaleString();
}
</script>

<template>
  <Teleport to="body">
    <div v-if="product" class="modal-overlay show" @click.self="emit('close')">
      <div class="modal">
        <div class="modal-head">
          <h3>{{ product.name }}</h3>
          <button class="close-btn" @click="emit('close')">&times;</button>
        </div>
        <div class="modal-body">
          <div class="mb-top">
            <div class="mb-emoji" :style="{ background: `linear-gradient(135deg, ${product.c1}, ${product.c2})` }">
              {{ product.emoji }}
            </div>
            <div>
              <div class="brand-en">{{ product.brand }}</div>
              <div class="mb-meta">类型：{{ product.type }} · 发布：{{ product.date }}</div>
            </div>
          </div>

          <div class="modal-desc">{{ product.desc }}</div>

          <div class="price-bar">
            <span class="price-lbl">参考起售价</span>
            <span class="prod-price">¥{{ priceLabel(product) }}</span>
          </div>

          <h4 class="spec-title">📐 详细参数表 <span>（按标准模板分类）</span></h4>

          <div v-if="specGroups.length" class="spec-cat" v-for="g in specGroups" :key="g.cat">
            <div class="spec-cat-title"><span class="ic">{{ g.icon }}</span>{{ g.cat }}</div>
            <div class="spec-rows">
              <div class="spec-row" v-for="r in g.rows" :key="r.key">
                <div class="rk">{{ r.key }}</div>
                <div class="rv">{{ r.val }}</div>
              </div>
            </div>
          </div>
          <div v-else class="spec-empty">暂无详细参数</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;animation:viewIn .3s ease}
@keyframes viewIn{from{opacity:0;transform:translateY(14px) scale(.99)}to{opacity:1;transform:none}}
.modal{background:var(--panel);border:1px solid var(--border);border-radius:16px;max-width:660px;width:100%;max-height:88vh;overflow:auto;box-shadow:0 30px 80px rgba(0,0,0,.6)}
.modal-head{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg,rgba(124,92,255,.12),transparent);position:sticky;top:0}
.modal-head h3{font-size:19px}
.close-btn{background:none;border:none;color:var(--txt-dim);font-size:26px;cursor:pointer;line-height:1}
.close-btn:hover{color:var(--red)}
.modal-body{padding:24px}
.mb-top{display:flex;align-items:center;gap:16px;margin-bottom:14px}
.mb-emoji{width:64px;height:64px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:34px}
.brand-en{color:var(--accent);font-size:13px;font-weight:600}
.mb-meta{font-size:13px;color:var(--txt-dim)}
.modal-desc{color:var(--txt-dim);font-size:14px;line-height:1.7;margin:12px 0}
.price-bar{display:flex;justify-content:space-between;align-items:center;background:var(--panel2);padding:14px 18px;border-radius:10px;border:1px solid var(--border)}
.price-lbl{color:var(--txt-dim);font-size:13px}
.prod-price{font-size:22px;color:var(--green);font-weight:700}
.spec-title{margin:18px 0 4px;display:flex;align-items:center;gap:8px}
.spec-title span{font-size:12px;color:var(--txt-dim);font-weight:400}
.spec-empty{color:var(--txt-dim);font-size:13px;padding:12px 0}
.spec-cat{margin-top:18px;border:1px solid var(--border);border-radius:10px;overflow:hidden}
.spec-cat-title{
  background:linear-gradient(90deg,rgba(124,92,255,.18),rgba(76,194,255,.10));
  padding:10px 16px;font-size:14px;font-weight:700;color:var(--accent);
  border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;
}
.spec-cat-title .ic{font-size:16px}
.spec-row{display:grid;grid-template-columns:130px 1fr;border-bottom:1px solid var(--border)}
.spec-row:last-child{border-bottom:none}
.spec-row .rk{padding:9px 14px;font-size:12px;color:var(--txt-dim);font-weight:600;background:var(--panel2);border-right:1px solid var(--border);display:flex;align-items:center}
.spec-row .rv{padding:9px 14px;font-size:13px;color:var(--txt);font-weight:500;display:flex;align-items:center}
</style>