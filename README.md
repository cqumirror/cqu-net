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

`public/guide/` 目录中应始终且仅保留一个名为 `重大校园网那些事V*.md` 的 Markdown 文件。更新时直接替换或重命名该文件即可；页面会在开发预览和生产构建时自动识别新版本，无需修改任何源代码。

若同时保留两个版本，应用会报错提示清理旧文件，以防发布错误版本。

将与 Markdown 文件同名的 PDF（扩展名换成 `.pdf`）放入 `public/guide/` 后，页面右上角会自动出现 Markdown 与 PDF 两个下载按钮；没有 PDF 时只显示 Markdown 下载。版本号变更时，把 `public/guide/` 里的 Markdown 与 PDF 改名为新版本号即可，代码无需任何改动。
