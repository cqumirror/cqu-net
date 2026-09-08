# 重大校园网那些事

一个使用 Typora LaTeX 风格排版的静态 Markdown 阅读页。

## 使用

安装依赖后启动本地预览：

```bash
npm install
npm run dev
```

构建可部署的静态文件：

```bash
npm run build
```

构建结果在 `dist/` 目录。

## 更新内容

`public/guide/` 目录可保留多个名为 `重大校园网那些事V*.md` 的 Markdown 文件。页面会按版本号从新到旧排序，默认打开最新版本；存在多个版本时，顶部会显示版本选择器。

可通过 `?version=3.1.0` 直接访问指定版本。新增版本时只需将新的 Markdown 文件放入该目录，无需修改任何源代码。

将与 Markdown 文件同名的 PDF（扩展名换成 `.pdf`）放入 `public/guide/` 后，所选版本的页面右上角会自动出现 Markdown 与 PDF 下载按钮；没有 PDF 时只显示 Markdown 下载。
