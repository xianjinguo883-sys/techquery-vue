<script setup>
import { ref } from 'vue';
import BrandGrid from './components/BrandGrid.vue';
import BrandDetail from './components/BrandDetail.vue';
import InfoView from './components/InfoView.vue';
import ProductModal from './components/ProductModal.vue';

// 视图状态：'brands' | 'detail' | 'info'
const view = ref('brands');
// 当前选中品牌
const currentBrand = ref(null);
// 选中的产品（弹窗）
const activeProduct = ref(null);

function goBrands() {
  view.value = 'brands';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function enterBrand(brand) {
  currentBrand.value = brand;
  view.value = 'detail';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goInfo() {
  view.value = 'info';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openProduct(p) {
  activeProduct.value = p;
}
</script>

<template>
  <header class="site-header">
    <div class="logo" @click="goBrands">📱<span>TechQuery</span> 🖥️</div>
    <div class="subtitle">电子产品发布查询系统 · 2020年至今</div>
    <div class="header-nav">
      <button
        v-if="view !== 'info'"
        class="nav-btn"
        :class="{ hide: view === 'detail' }"
        @click="goInfo"
      >📋 资料说明</button>
      <button class="back-btn show" v-if="view === 'detail'" @click="goBrands">
        ← 返回品牌
      </button>
    </div>
  </header>

  <main>
    <BrandGrid v-if="view === 'brands'" @select-brand="enterBrand" />
    <BrandDetail
      v-else-if="view === 'detail'"
      :brand="currentBrand"
      @back="goBrands"
      @open-product="openProduct"
      @go-info="goInfo"
    />
    <InfoView v-else-if="view === 'info'" @back-brands="goBrands" />
  </main>

  <ProductModal :product="activeProduct" @close="activeProduct = null" />

  <footer class="site-footer">
    TechQuery · 电子产品发布查询系统 · 数据为教学示例整理 · 仅供 ASP.NET 综合编程上机实验使用
  </footer>
</template>