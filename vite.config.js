import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 8081,
  },
  build: {
    // 数据/转义类产物体积较大，提高 chunk 阈值减少告警
    chunkSizeWarningLimit: 1200,
  },
});