# Our Little Universe · 我们爱的小宇宙

两个人的数字爱情纪念馆。React + Vite + Cloudflare Workers + D1，照片存 GitHub 仓库随部署上线。

**线上地址**：https://our-little-universe.jjhhqq380.workers.dev

---

## 功能总览

### 🔒 访问密码

访客打开网站必须回答问题才能进入（默认：**九月一号是什么纪念日** → 答案：**领证纪念日**）。
- 全屏暗星空遮罩 + 毛玻璃卡片动画
- 答错抖动提示，限流 6 次/分钟
- 答对后 localStorage 记住，同一浏览器不再重复
- 管理员可随时修改问题和答案（⚙ → 访问密码）

### 🌌 星空开场动画

全屏暗色星空，两行诗逐步浮现（"有些故事不必从开头讲起 / 因为它还在继续"），品牌名淡入。67 颗星星分三层闪烁动画。点击/按键/6 秒后自动关闭，sessionStorage 记住本次已跳过。

### 🌠 Hero 主视觉

深色星空大图，90 颗三层景深星星随鼠标视差。framer-motion 入场动画依次：脉动心 → 名字 → 起始日期 → 天数计数器（从 0 动画增长到实际天数）→ 引言 → 向下滚动提示。

### ⏱ 相爱计数器

固定横幅实时跳动：**天 / 时 : 分 : 秒**，每秒更新，支持大数千位分隔符。

### 🎂 纪念日倒计时

两张卡片：**领证纪念日**（9.1 💍）+ **结婚纪念日**（10.1 🥂）。显示距离天数、全年进度条、"就是今天！纪念日快乐" 特效。自动计算下一次日期。

### 🎞 人生胶片（时间轴）

垂直时间线 + IntersectionObserver 渐显动画。每条回忆节点包含：emoji 点（呼吸动画）→ 标题（逐字模糊→清晰）→ 日期 → 描述 → 缩略图横滑条（自动滚动 Reel）→ 歌曲提示。点击节点打开**记忆胶囊**弹窗。

### 📸 记忆胶囊

点击时间轴节点弹出：大图轮播（3.6 秒自动切换，悬停暂停）+ 毛玻璃模糊底图 + 进度条 + 歌曲链接 + 纪念时刻。还有"打开相册"入口查看全部照片。

### 🖼 相册（灯箱）

相册弹窗内瀑布流网格（桌面 3 列 / 平板 2 列），支持年份和地点筛选。点击照片进入全屏灯箱：左右滑动/键盘/按钮切换，显示标题、地点、描述、计数器。

### 🧲 记忆墙（拍立得）

拍立得风格照片墙，随机倾斜角度，悬停放大，懒加载缩略图。默认展示 18 张，点击"展开全部"查看所有。点击任意张进入灯箱。

### 🗺 足迹地图

SVG 贝塞尔曲线串联所有地点，心形标记 + 呼吸动画 + 地点名标签。点击心形打开地点详情（日期 + 描述 + 该地照片）。

### 📖 故事专栏

毛玻璃卡片，编号 CHAPTER，标题 + 摘要 + "阅读故事"按钮。点击进入全屏阅读弹窗（白空格保持）。

### ✉️ 写给未来的信

CSS 3D 信封动画：点击开盖 → 抽出信纸 → 逐字浮现问候、正文、落款。内容管理员可随时修改。

### ✨ 未来清单

愿望列表：空心圆打勾变实心心，完成项划线，进度统计（"已完成 N / M"）。

### 🎬 终章揭幕

四阶段电影式文字揭幕：`故事写到这里了吗？→ 没有。→ 下一页，还要和你一起写。→ 我爱你 ♥`。Framer Motion AnimatePresence 入场，背景锁定。

### ♫ 音乐播放器

浮动 ♫ 按钮（播放时脉动），点击展开播放器卡：歌曲列表 + 可拖拽进度条 + 当前时间/总时长 + 上一曲/暂停/下一曲。自动下一首。

### 🔐 密室

页脚隐藏 ♡ 入口，回答秘密问题后进入。支持存入 4 种类型：悄悄话、照片、视频链接、小情书。管理员可设置问题/答案/寄语。

---

## 管理模式

导航栏 ⚙ 按钮 → 输入密码进入（Token 仅存浏览器本地）。

| 模块 | 可执行操作 |
|------|-----------|
| **时间轴** | ＋新建回忆 / ✎ 编辑（标题、描述、日期、emoji、关联歌曲、纪念时刻）/ 🗑 删除 |
| **照片上传** | 拖拽选择 → 前端自动压缩（>2000px / JPEG 85%）→ 四阶段实时进度条（压缩→读取→上传 N%→部署中）→ 自动推送 GitHub |
| **照片管理** | 灯箱 / 记忆墙 / 相册网格三处入口，✎ 编辑信息 / 🗑 删除照片（D1 + GitHub 同删） |
| **故事** | ＋新建 / ✎ 编辑 / 🗑 删除 |
| **信件** | 修改问候语、正文、落款 |
| **地点** | 可视化小地图点击定位 + X/Y 滑杆微调 / 编辑 / 删除 |
| **歌曲** | ＋上传音频（带进度条）/ × 删除 |
| **愿望** | ＋添加 / × 删除 / 点击标记已完成 |
| **访问密码** | 修改访客需回答的问题和答案 |
| **密室** | 设置密钥问题和答案 / 存入秘密 / × 删除 |

---

## 技术架构

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + Vite + Framer Motion |
| 后端 | Cloudflare Workers（单文件 `worker/index.js`） |
| 数据库 | Cloudflare D1（8 张表） |
| 照片/音频存储 | GitHub 仓库（通过 GitHub API 推送，自动生成缩略图） |
| 部署 | GitHub Actions 自动 CI/CD（push main → build → wrangler deploy） |
| 安全 | Bearer Token + Rate Limiting（6 次/分钟密室/访问密码，30 次/分钟管理操作） |
| 移动端 | safe-area、vh/svh/dvh 渐进增强、触控滑动、viewport-fit=cover、prefers-reduced-motion 全适配 |
| UI 设计 | 暖玫瑰金设计系统（`variables.css`）、毛玻璃、渐变按钮、shimmer 加载骨架屏 |

### 数据库表（8 张）

| 表 | 说明 |
|---|------|
| `settings` | 键值配置（起始日期、名字、信件、访问密码等） |
| `timeline_events` | 时间轴事件（日期、标题、描述、emoji、歌曲、纪念时刻） |
| `stories` | 故事（标题、正文） |
| `photos` | 照片（路径、标题、描述、事件分组、地点） |
| `places` | 地点（名称、日期、描述、坐标 x/y） |
| `songs` | 歌曲（名称、文件路径、关联事件） |
| `wishes` | 愿望（文本、完成状态） |
| `secret_contents` | 密室内容（类型、标题、内容、媒体路径） |

### API 端点（24 个）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/settings` | 公共配置（不含 gate_/secret_ 前缀） |
| GET | `/api/timeline` | 时间轴列表 |
| GET | `/api/stories` | 故事列表 |
| GET | `/api/photos` | 照片列表 |
| GET | `/api/places` | 地点列表 |
| GET | `/api/songs` | 歌曲列表 |
| GET | `/api/wishes` | 愿望列表 |
| GET | `/api/gate/question` | 获取访问密码问题（公开） |
| POST | `/api/gate/check` | 验证访问密码（限流） |
| POST | `/api/secret/check` | 验证密室密码（限流） |
| GET | `/api/secret/contents` | 获取密室内容（需 x-secret 头） |
| POST | `/api/timeline` | 新建事件（管理） |
| PUT | `/api/timeline/:id` | 编辑事件（管理） |
| DELETE | `/api/timeline/:id` | 删除事件（管理） |
| POST | `/api/stories` | 新建故事（管理） |
| PUT | `/api/stories/:id` | 编辑故事（管理） |
| DELETE | `/api/stories/:id` | 删除故事（管理） |
| POST | `/api/photos/upload` | 上传照片（管理） |
| PUT | `/api/photos/:id` | 编辑照片信息（管理） |
| DELETE | `/api/photos/:id` | 删除照片（管理） |
| POST | `/api/places` | 新建地点（管理） |
| PUT | `/api/places/:id` | 编辑地点（管理） |
| DELETE | `/api/places/:id` | 删除地点（管理） |
| POST | `/api/songs/upload` | 上传歌曲（管理） |
| DELETE | `/api/songs/:id` | 删除歌曲（管理） |
| PUT | `/api/settings` | 更新配置（管理） |
| POST | `/api/wishes` | 新建愿望（管理） |
| PUT | `/api/wishes/:id` | 编辑愿望（管理） |
| DELETE | `/api/wishes/:id` | 删除愿望（管理） |
| POST | `/api/secret/contents` | 存入密室内容（管理） |
| DELETE | `/api/secret/contents/:id` | 删除密室内容（管理） |

---

## 常用命令

```bash
npm run dev              # 本地前端开发
npx wrangler dev         # Worker + D1 联调
npm run build            # 构建生产版本
npm run deploy           # 构建 + 部署到 Cloudflare
npm run db:local         # 本地 D1 迁移
npm run db:remote        # 远程 D1 迁移
npm run photos:sync      # 压缩大图 + 生成缩略图
```

## 添加照片

把照片放进 `public/photos/<分组文件夹>/` 后 `git push` 即自动部署；再在管理模式「传照片」或直接往 D1 `photos` 表写元数据。提交前 pre-commit 钩子会自动压缩大图并生成缩略图（长边 2000px 主图 / 480px 缩略图）。

> 原图备份在本地 `~/Documents/ourlove/photos-originals/`，请勿直接提交 >1.2MB 的原图。

## 环境变量 / Secrets

| 名称 | 说明 |
|---|---|
| `LOVE_ADMIN_TOKEN` | 管理密钥（wrangler secret） |
| `GITHUB_TOKEN` | 推送照片/歌曲到仓库用的 PAT（wrangler secret） |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions 部署 Secrets |
