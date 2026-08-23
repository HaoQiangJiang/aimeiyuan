# Our Little Universe · 我们爱的小宇宙

两个人的数字爱情纪念馆。React + Vite + Cloudflare Workers + D1，照片存 GitHub 仓库随部署上线。

## 功能

- 🌌 星空开场动画 + 鼠标视差星野 Hero（在一起计时）
- 💞 纪念日倒计时（领证日 / 结婚纪念日，自动滚动下一年）
- 🎞 人生胶片：时间轴逐格显影，节点点击打开「记忆胶囊」（大图轮播 / 歌曲 / 时刻感受）
- 🗺 我们去过的地方：手绘风坐标地图
- ✉️ 写给未来的你：可编辑的信封 + 逐字显影
- ✨ 未来清单：共同愿望打卡
- ♫ 我们的歌：主动式音乐播放器（音频走仓库部署）
- 🔐 只有我们知道：问答解锁的秘密胶囊
- 🎬 开场动画 + 终章 Ending
- 管理模式（页脚 ♡ 旁 ⚙）：时间轴 / 故事 / 照片分组上传（自动推 GitHub）/ 地点 / 歌曲管理

## 常用命令

```bash
npm run dev            # 本地前端开发
npx wrangler dev       # Worker + D1 联调
npm run photos:sync    # 清理网盘临时文件 + 压缩大图 + 生成缩略图（提交前会自动执行）
npm run deploy         # 构建 + 部署
npm run db:remote      # 应用 D1 迁移到远程
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
