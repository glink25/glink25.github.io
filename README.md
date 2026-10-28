# 用 Tio 搭建个人博客

这是一个可以直接 Fork 的个人博客模板：在 [Tio](https://github.com/glink25/tio) 中编辑文档、管理标签和文件，通过 [`@glink25/tio-pages`](https://www.npmjs.com/package/@glink25/tio-pages) 生成静态站点，再由 GitHub Actions 发布到 GitHub Pages。

[查看在线示例](https://glink25.github.io/) · [打开 Tio 编辑器](https://tio.linkai.work) · [Tio 源码与文档](https://github.com/glink25/tio)

不需要搭建博客服务端，也不需要为每篇文章维护 Markdown front matter。文章、数据库、自动化和附件都保存在标准 Tio workspace 中；模板、样式和路径规则由你自己的配置决定。

## 快速开始：Fork 后部署自己的博客

### 1. 创建自己的仓库

Fork 本仓库，将仓库命名为 `<你的 GitHub 用户名>.github.io`。本模板默认部署在域名根路径；使用这个命名可以直接部署个人主页。如果使用其他仓库名并部署到子路径，需要自行调整模板、资源和站内链接的路径。

仓库包含示例文章和文件，方便先预览效果。建议先完成下面的个性化设置，再发布自己的站点。

### 2. 修改站点配置

编辑 `.tio-page/config.ts`：

- 修改站点标题、简介、语言和 `siteUrl`，将地址指向自己的 GitHub Pages 域名。
- 修改 `headerHtml`、`footerHtml` 中的导航、署名、Tools 链接，替换 favicon 文件。
- 关闭示例仓库的评论配置：将 `giscus` 设为 `false`。需要评论时，按 [giscus 官方配置页](https://giscus.app/) 为自己的仓库重新配置。
- 移除 `analytics.ts` 的导入以及 `gtmHead`、`gtmBody` 的拼接，避免沿用示例站点的统计。需要统计时，再接入自己的服务。

模板和样式分别在 `.tio-page/template.ts`、`.tio-page/style.css`。正文布局、页头页脚、分页、slug 算法和文章路径都可以自行修改，无需改动 npm 包。

### 3. 在 Tio 中管理内容

打开 [Tio 编辑器](https://tio.linkai.work)，连接 Fork 后的 GitHub 仓库；也可以先克隆到本地，再通过文件夹连接打开仓库目录。

工作空间中的主要内容：

| 内容           | 用途                                             |
| -------------- | ------------------------------------------------ |
| `post`         | 文章父页面，直属子页面作为博客文章               |
| `Tags`         | 标签数据库                                       |
| `PageMap`      | 文章发布设置：页面提及、标签、可选 Slug 和 Draft |
| `Bed`          | 单独发布的图片和文件                             |
| 两条页面自动化 | 新建文章时生成 PageMap，删除文章时移除映射       |

直接使用模板时，可以修改显示名称，保留已有对象和字段的内部 ID。更换空间或重建数据库后，需要同步修改配置中的 ID 和自动化目标。

删除示例文章、添加自己的文章，并按需清理 Bed 中的示例文件。`.tio-page/legacy-assets.json` 是示例站点旧图片路径的别名映射；新博客通常可以将它清空为 `{}`，之后再删除不需要的示例附件。

### 4. 启用 GitHub Pages

1. 在 Fork 仓库的 **Actions** 页面启用工作流。
2. 在 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。
3. 如果为 `github-pages` 环境设置了部署分支限制，允许 `main`。
4. 将配置和内容推送到 `main`，或在 Actions 中手动运行 **Tio Pages**。

工作流会安装正式发布的 npm 包、构建当前 workspace 并部署站点，不依赖 Tio 源码仓库。它使用 GitHub 自动提供的令牌和 OIDC，不需要额外填写 PAT、部署 secret 或 npm token。

## 日常写作

1. 在 Tio 中为 `post` 创建直属子页面，编写正文。
2. 自动化会生成 PageMap 记录，**默认开启 Draft**，避免未完成的文章发布。
3. 在 PageMap 中关联标签，完成后关闭 Draft。
4. 保存并同步到 GitHub，`main` 的推送会自动构建发布。

自动化在打开的 Tio 空间会话中运行；直接修改仓库文件、导入备份或外部同步不会补发页面创建事件。这些情况下，需要自行建立发布映射。

文章日期由页面系统元数据自动维护。普通文章按创建时间倒序；带 `Pin` 标签的文章置顶，并按修改时间倒序。标签页和相邻文章沿用创建时间顺序。

### 固定文章链接

PageMap 的 Slug 可以不填：默认按标题生成，保留大小写和中文、去除标点、将空格转为连字符。文章默认发布到 `/post/<slug>`。

需要固定链接时，填写 Slug。留空时修改标题也会改变 URL。默认算法由 `slugify(title)` 配置，文章路径由 `routes.post(slug)` 配置；重复路径或无法生成有效 slug 时，构建会报错。

### 发布独立文件

在 Bed 新增记录，填写 Name，在 File 中上传一个附件。Slug 可选：

- 留空：使用 `/post-assets/<名称 slug><文件扩展名>`。
- 填写：使用指定文件名，需包含扩展名，例如 `download-guide.pdf`。

适合存放供其他网站、README 或应用引用的图片与下载文件。修改 Slug 或删除文件会影响这些外链；尚未上传文件的空记录不会发布。

## 本地预览

需要 Node.js 24。克隆自己的仓库，在仓库根目录执行：

```sh
nvm use
npx --yes @glink25/tio-pages@0.1.0 build
node .tio-page/preview.mjs
```

打开 <http://127.0.0.1:4321>。修改内容或配置后，重新构建并刷新页面即可。输出位于 `.tio-page/dist/`，不需要提交 Git。

代码高亮和 Mermaid 在构建时生成最终结构，阅读页面不需要加载编辑器、语法解析器或 Mermaid 运行时。HTML 示例使用按需加载的沙箱预览脚本，支持代码、预览和分屏模式。

如果文章包含 Mermaid，构建机需要 Chrome/Chromium。可以使用 Puppeteer 安装的浏览器，也可以通过 `PUPPETEER_EXECUTABLE_PATH` 指向已安装的浏览器。

## 从空白工作空间开始

也可以只复用本仓库的 `.tio-page/` 和 `.github/workflows/pages.yml`：

1. 在 Tio 中创建自己的工作空间、文章父页面，以及 Tags、PageMap 数据库；需要独立文件发布时再创建 Bed。
2. 在 PageMap 中准备页面提及、标签关联、Slug 文本和 Draft 布尔字段。
3. 设置两条自动化：监听文章父页面下的页面创建，新增发布映射；监听页面删除，按触发页面提及匹配并删除映射。
4. 更新配置中的工作空间、父页面、数据库和字段 ID；Bed 的字段与路径配置位于 `bed.ts`。
5. 清空示例图片别名，替换个人配置，再按前面的步骤构建和部署。

[Tio Pages 文档](https://github.com/glink25/tio/tree/main/packages/pages)介绍了公开 API。你可以继续扩展归档页、专题页或自定义块渲染，保持内容数据与个人站点实现分离。

## 文件结构

```text
.github/workflows/pages.yml   自动构建与部署
.tio-page/
  config.ts                  站点配置与路径规则
  template.ts                页面模板
  style.css                  站点样式
  bed.ts                     独立文件发布
  legacy-assets.json         可选的历史图片路径别名
  analytics.ts               示例站点的可选统计接入
  preview.mjs                本地静态预览
workspaces/                  Tio 标准工作空间数据与附件
```

本地备份 `.tio-page/blog.tio.zip` 和构建目录已加入忽略规则。仓库不应保存 GitHub/npm 登录凭据。
