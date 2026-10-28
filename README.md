# Link AI · Tio Blog

[![Deploy Pages](https://github.com/glink25/glink25.github.io/actions/workflows/pages.yml/badge.svg)](https://github.com/glink25/glink25.github.io/actions/workflows/pages.yml)

个人博客：[glink25.github.io](https://glink25.github.io/)。内容使用 [Tio](https://github.com/glink25/tio) 管理，由 [`@glink25/tio-pages`](https://www.npmjs.com/package/@glink25/tio-pages) 在构建时输出静态 HTML，部署到 GitHub Pages。

Tio 是本地优先的文档与数据库工作空间：富文本、标签关联、文件附件和自动化都使用可保存到文件夹或 GitHub 的开放数据。通过 [Tio Web](https://tio.linkai.work) 连接本仓库或本地目录，即可编辑博客，不需要维护 Markdown front matter 或手动修改 HTML。

## 目录

- `workspaces/glink-blog/`：标准 Tio workspace，包含文章、数据库、自动化和附件。
- `.tio-page/config.ts`：站点、路径、代码展示、评论和发布配置。
- `.tio-page/template.ts`、`style.css`：个人博客模板与样式。
- `.tio-page/bed.ts`、`legacy-assets.json`：独立文件发布及原图片外链。
- `.tio-page/analytics.ts`：Google Tag Manager 公开容器配置。
- `.github/workflows/pages.yml`：构建并部署当前 workspace，不依赖 Tio 源码仓库。

## 写文章

1. 在 Tio 中打开 `Link AI`，在 `post` 下创建直属子页面，编写正文。
2. 空间的“新建文章时添加 PageMap”自动化会生成对应记录，**默认 Draft 开启**，防止尚未完成的内容发布。自动化由打开的 Tio 空间会话运行；直接修改 Git 文件或导入备份不触发自动化。
3. 在 PageMap 配置标签，完成后关闭 Draft。Slug 可留空，默认按标题使用原博客的 GitHub slug 算法生成；填写时固定使用该值。改标题会改变自动生成的路径，需要固定链接时填写 Slug。当前 7 篇历史文章保留原 slug。
4. 保存并同步/推送到 `main`，GitHub Actions 自动构建发布。删除文章页面时，第二条自动化按页面提及身份软删除 PageMap 映射。

文章日期取页面系统创建/修改时间。普通文章按创建时间倒序；标签 `Pin` 置顶并按修改时间倒序。标签页及相邻文章保持创建时间顺序。页面正文与时间不依赖 PageMap 记录标题或修改时间。

## 独立文件与图片外链

`Bed` 用于不出现在博客正文中的文件，例如支付宝和 Solana 收款码：新增记录，填写 Name，File 上传一个附件，Slug 可选。默认路径为 `/post-assets/<标题 slug><文件扩展名>`，填写 Slug 时使用完整文件名（含扩展名），例如 `sponsor-alipay.jpg`。同一路径不可重复；暂未上传文件的空记录不发布。

原站 60 个 `/post-assets/` 链接均保留：56 个文章附件通过别名输出，4 个独立文件由 Bed 发布。包括 Cent README 使用的截图和收款码，均保留原文件内容与 URL。删除或更改这些 Slug 会影响外部引用。

## 本地构建

使用 Node.js 24（`.nvmrc`）。在本目录执行：

```sh
nvm use
npx --yes @glink25/tio-pages@0.1.0 build
node .tio-page/preview.mjs
```

打开 <http://127.0.0.1:4321>。输出位于 `.tio-page/dist/`，不提交 Git。代码高亮和 Mermaid 在构建时生成最终结构；HTML 示例按需加载小型沙箱预览脚本。若文章包含 Mermaid，构建机需安装 Chromium；可用 `PUPPETEER_EXECUTABLE_PATH` 指定已安装的浏览器。

## GitHub Pages 与配置

`main` 的每次推送自动触发 `pages.yml`，也可以手动运行。仓库 Settings → Pages 使用 **GitHub Actions**，部署环境为 `github-pages`，允许 `main`。工作流使用 GitHub 自动提供的 `GITHUB_TOKEN` 和 OIDC，只授予所需的 `contents: read`、`pages: write`、`id-token: write`，不需要自定义 PAT、部署 secret 或 npm token。

- 站点 URL：`https://glink25.github.io`，无自定义域名。
- GTM：`GTM-WGC4G65Z`，页面 head 加载标准脚本，body 提供 noscript iframe；容器 ID 是公开配置。
- giscus：保留当前 GitHub 仓库、仓库 ID `R_kgDONTJ_KQ`、Announcements 分类及 pathname 映射，继续使用原有评论。首次安装见 [giscus](https://giscus.app/)；本地环境不保证评论服务接受 localhost。
- `.tio-page/blog.tio.zip` 为本地完整备份，不提交；不在仓库保存 GitHub/npm 登录凭据。旧工作流的 `ACCESS_TOKEN` 不再使用。

当前线上分支从本 Tio workspace 开始新历史，旧博客 Git 历史仅保存在本地镜像备份，不合并到本仓库的新提交中。
