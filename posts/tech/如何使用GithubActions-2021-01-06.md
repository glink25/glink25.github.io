---
date: 2021-01-06
title: 如何使用 Github Actions 自动构建静态页面并部署在 Github Pages 上
tags:
  - Vue
  - GitHub
---

## 如何使用 Github Actions 自动构建静态页面并部署在 Github Pages 上

### 本地配置

在本地项目中新建文件夹 `.github/workflows`

在 `workflows` 文件夹中新建 `main.yml`，用于配置 github actions，内容如下

```yml
name: GitHub Actions Build and Deploy
on:
  push:
    branches:
      - main
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2.3.1
        with:
          persist-credentials: false

      - name: Install and Build 🔧
        run: |
          npm install
          npm run build
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@3.7.1
        with:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BRANCH: gh-pages
          FOLDER: dist
          CLEAN: true
```

### Github 配置

新建仓库

打开[Personal access tokens (github.com)](https://github.com/settings/tokens)，点击 `generate new token` 按钮，为按钮添加备注（note），例如 `github-actions-deploy`，勾选 `repos` 选项，然后点击完成，跳转后的页面会有一个 key 显示出来，这个 key 只会在这里显示一次，以后就看不到了，复制这个 key 备用。

在新建的仓库 Settings 中选择 secrets->actions，点击 new repository secret，Name 填 ACCESS_TOKEN，value 填刚刚复制的 key，然后保存即可。

### 部署

按照 github 仓库的提示将本地 git 项目上传至 github，点击 actions，会发现有两个 workflow，另一个是 github 自带的 github pages 部署用的 workflow `pages-build-deployment`，可能会部署失败，需要跳转至仓库 Setting->Pages，将项目 Source 改为 `gh-pages`，文件夹选择 root，回到 actions 页面，会发现 workflow 重新运行，稍等一会就能在 github pages 地址中访问看到部署的静态页面了。
