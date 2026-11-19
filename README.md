# TechQuery · 电子产品发布查询系统（Vue 3 + Vite）

从单文件 `index.html` 重构而来的 Vue 3 + Vite 组件化版本，数据含 829 款电子产品。

## 本地运行

```bash
# 安装依赖
npm install        # 或 pnpm install

# 启动开发服务器（默认 http://localhost:8081）
npm run dev

# 生产构建，产物输出到 dist/
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
techquery-vue/
├── index.html            # Vite 入口
├── vite.config.js        # 构建配置
├── package.json
├── render.yaml           # Render 部署配置
├── vercel.json           # Vercel 部署配置
└── src/
    ├── main.js / App.vue
    ├── styles/main.css   # 全局主题
    ├── data/             # 数据模块（829 款产品）
    ├── utils/            # 工具与逻辑（含 phoneSVG）
    └── components/       # Vue 组件
        ├── BrandGrid.vue      # 品牌卡片墙
        ├── BrandDetail.vue    # 品牌详情（分类折叠+防抖搜索）
        ├── ProductModal.vue   # 产品详情弹窗（标准参数模板）
        └── InfoView.vue       # 资料说明页
```

> 数据是从旧版 `index.html` 用 `scripts/extract-data.js` 自动提取的，位于 `src/data/`。

---

## 部署到公网（别人电脑也能访问）

这是一个**纯前端静态站点**（SPA），数据打包进 JS，因此非常适合用免费云托管平台，**无需自己维护服务器**。推荐以下两种，任选其一即可得到一个永久公网网址（例如 `https://techquery-vue.onrender.com`）。

### 前置准备（必做，约 10 分钟）

1. 注册一个 **GitHub** 账号（https://github.com）——用来存代码。
2. 选择一方注册账号：
   - **Render**：https://render.com （免费额度，适合国内团队，需网络较流畅）
   - **Vercel**：https://vercel.com （同样免费，界面更简单）
3. 把本项目做一个 Git 仓库并推到 GitHub：

```bash
cd techquery-vue
git init
git add .
git commit -m "初版: TechQuery Vue 3 重构"
# 在 GitHub 网页上新建一个空仓库（命名为 techquery-vue），然后：
git remote add origin https://github.com/<你的用户名>/techquery-vue.git
git push -u origin main
```

---

### 方式一：部署到 Render（约 5 分钟）

1. 登录 Render → 点击 **New** → 选 **Static Site**（或 **Blueprint** 并选本仓库）。
2. 授权 Render 连接你的 GitHub，选择 `techquery-vue` 仓库。
3. Render 会根据仓库根目录的 `render.yaml` 自动填好配置（Node 运行环境、构建 `npm install && npm run build`、发布目录 `dist`）。
4. 点 **Create Static Site**。构建完成后，页面会给出一个公网地址，形如
   `https://techquery-vue.onrender.com`。
5. 把这个网址发给任何人，任何地方的电脑/手机打开即可访问。

> Render 免费版会自动休眠保持在线；若 15 分钟无访问会休眠，再次访问时自动唤醒。
> 若你在 `render.yaml` 里配了 `free` 计划并有环境变量，按页面提示补填即可。

---

### 方式二：部署到 Vercel（约 3 分钟）

1. 登录 Vercel → 点 **Add New…** → **Project**。
2. **Import** 你 GitHub 上的 `techquery-vue` 仓库。
3. 保持默认即可（Vercel 会自动识别并运行 `vercel.json`：构建 `npm run build`、输出目录 `dist`）。
4. 点 **Deploy**。浏览器会自动打开一个新的公网网址，形如
   `https://techquery-vue.vercel.app`。
5. 复制该网址给他人访问即可。

> Vercel 免费版域名无需手动备案即可访问（走海外节点），国内访问速度视网络而定。

---

### 部署后的说明

- 静态托管**不运行**本机的 `server.js`——那是本地开发用的临时文件服务器；云平台会直接托管 `dist/` 构建产物，所以**每次改代码都要重新 `git push`，平台会自动重新构建**。
- 想让远程版本与本机一致：`npm run build` 验证无误后提交推送即可。
- 若日后需要**真正的账号登录**或**数据后台可增删改**，就需要引入「后端 API + 数据库」，这属于另一种部署形态（详见你的部署选项）。