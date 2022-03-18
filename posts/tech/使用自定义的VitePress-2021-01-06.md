---
date: 2021-01-06
title: 使用自定义的VitePress构建自己的博客
tags:
  - Vue
  - GitHub
---

## 使用自定义的 VitePress 构建自己的博客

### 什么是 VitePress

VitePress 的原理是利用 Vue 的 SSR 特性，服务端先把包含 Markdown 文本内容的 Vue 组件渲染成多个静态 HTML 文件，再配合内置的简易路由系统生成一个博客站点，这其实与 VuePress 的原理如出一辙，不过 VitePress 舍弃了许多臃肿的功能，只保留最简单的渲染系统，并且重新实现了一个简易的 router，保持了轻量性，同时也因为使用 Vite 提高了开发时的速度，对于拥有大量文档的项目十分友好。

### 开始使用

按照 VitePress 官方网站的[教程](https://VitePress.vuejs.org/guide/getting-started.html)，一个标准的 VitePress 项目文件结构如下：

```sh
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  └─ index.md
└─ package.json
```

从这里就可以看出，`.vitepress`这个文件夹包含了 VitePress 所需的配置结构，并且可以指定特定文件夹为主目录。出于个人习惯，我比较喜欢把文档与配置分开，变成如下目录结构

```sh
├─ docs
│    └─ other-documents.md
├─ .vitepress
│    └─ config.js
├─ index.md
└─ package.json
```

`index.md` 作为博客的入口文件，一般我们不会使用它的具体内容，简单设置 frontmatter 即可。
VitePress 会自动使用文档的路径作为访问的 URL，例如上面的`other-documents.md`对应的页面就是`localhost:3000/#/docs/other-documents.html`

### 主题

VitePress 的默认主题作为普通文档项目已经很不错了，不过作为博客还是有点不够个性化，因此也提供了主题功能。新建文件夹`.VitePress/theme`，结构如下

```sh
├─ docs
│    └─ other-documents.md
├─ .vitepress
│    └─ config.js
│    └─ theme
│        └─ index.js
│        └─ Layout.vue
│        └─ NotFound.vue
├─ index.md
└─ package.json
```

一般来说，VitePress 的主题文件需要至少导出`Layout`和`NotFound`两个组件，前者即渲染 HTML 所用的模版组件，后者则为 404 页面。
一个简单的 Layout 页面如下

```vue
<script setup lang="ts">
import { useData } from "vitepress";
const { site, page } = useData<CustomThemeConfig>();
</script>
<template>
  <div>Hello VitePress</div>
  <Content />
</template>
<style lang="scss"></style>
```

`<Content />`是 VitePress 的内置组件，用于渲染默认的 markdown 文件；`useData`是 VitePress 提供的内置 hoook，其中包含了每个页面的标题、描述、内容等数据，我们就可以通过这些数据来渲染个性化的博客页面，就像写一个普通的 Vue 组件一样。

### SSR 相关问题

因为 VitePress 使用的是服务端渲染，所以一些客户端的组件在渲染时可能会报错`Hydration is completed but contains mismatches`，例如使用了自定义指令或者使用了`onMounted`等服务端不支持的生命周期函数，对于这些特殊组件，我们可以使用 VitePress 内置的组件`<ClientOnly></ClientOnly>`来包裹特定组件，告诉 VitePress 只在客户端渲染这些组件。如果仍然报错，可以优化自定义指令的实现逻辑，增加对客户端环境的判断然后再条件执行.

```typescript
const isClient = typeof window !== "undefined";
if (isClient) {
  // do something
}
```

### 额外的配置数据

对于需要展示文章列表的博客，VitePress 并没有提供一个方便的 API 来获取所有文章的数据，因此我们需要手动读取文章数据，得益于 Node 强大的生态，这件事情做起来很简单。

```typescript
// utils.ts
import { readFile } from "fs";
// gray-matter 用于读取markdown文件的frontmatter
import matter from "gray-matter";

export default async function getArticles() {
  // 读取文件夹中的markdown文件并解析
  // await reading...
  return [];
}
```

<br>

```typescript
// config.ts
import { defineConfigWithTheme } from "vitepress";
// getArticles 函数中实现读取文章列表的功能
import getArticles from "./utils";

// config.ts 可以导出异步函数
export default async () =>
defineConfigWithTheme<CustomThemeConfig}>({
  themeConfig: {
    articles: await getArticles(),
  },
});

```

<br>

```vue
<script setup lang="ts">
import { useData } from "vitepress";
const data = useData<CustomThemeConfig>();
// 使用useData获得themeConfig中传入的articles数据
const articles = computed(() => site.value.themeConfig.articles);
</script>
<template>
  <div class="list">
    <div v-for="(article, index) in articles" class="item">
      {{ article.title }}
    </div>
  </div>
</template>
<style></style>
```

同样的方法可以获取到配置文件传递的其他数据。要注意只能从 VitePress 提供的数据中获取数据，因为在渲染完成后无法访问到 Node 环境。

## Tips

1. 一些情况下，使用`v-if`指令也会导致 SSR Hydration 出现报错，但不会影响 HTML 到正常渲染，可以使用`v-show`代替。

2. Markdown 文件开头可以设置 fromtmatter，可以包含文章标题、简述、题图等信息，方便自定义渲染，例如

```markdown
---
date: 2021-01-06
title: 首页
describe: 首页
home: true
---
```

3. 可以直接引入 VitePress 内置的样式和主题文件，然后在原始主题基础上进行修改，例如

```typescript
// theme/index.ts
import defaultTheme from "vitepress/theme";
import NotFound from "./NotFound.vue";
import Layout from "./Layout.vue";

export default {
  ...defaultTheme,
  NotFound,
  Layout,
};
```

## 最后

<script setup>
import ClickToPlus from '/.vitepress/theme/components/ClickToPlus.vue'
</script>

VitePress 还支持许多特性，例如自定义 vite 配置、自定义 markdown 渲染器、markdown 文件内引入 vue 组件(例如： <ClickToPlus /> )等等，这些都可以在 VitePress 的[官方文档](https://VitePress.vuejs.org)内看到，默默等待 VitePress 正式版发布吧。
