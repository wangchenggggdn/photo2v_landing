# photo2v_landing

静态营销落地页（纯 HTML / CSS / JS），品牌 **photo2v**。

行为对齐 `shortpress_landing`：Age Gate → 透传查询参数与 `source` → 跳转主站 `/create` 或 `/template-create`，并注入 Meta Pixel。布局、配色、文案与原站刻意不同，便于爬虫区分。

## 本地预览

用任意静态服务器打开仓库根目录即可，例如：

```bash
npx --yes serve .
```

## GitHub Pages

1. 仓库已推送到 `wangchenggggdn/photo2v_landing`
2. 打开 **Settings → Pages**
3. **Source** 选 **Deploy from a branch**
4. Branch 选 `main`，文件夹选 `/ (root)`，保存

约 1 分钟后访问：

`https://wangchenggggdn.github.io/photo2v_landing/`

## 配置

编辑 `js/app.js` 顶部常量：

| 常量 | 说明 | 默认 |
| --- | --- | --- |
| `SITE_ORIGIN` | 跳转主站 | `https://higoon.art` |
| `FB_PIXEL_ID` | Meta Pixel | `1305891871690133` |

OG / canonical URL 在 `index.html` 的 meta 中，若仓库名或用户名变更请一并更新。
