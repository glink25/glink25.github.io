## 差一点就完美的Vite

### 打包顺序问题

vite在开发时和打包时使用的构建引擎是不一样的，并且由于开发时并非全量打包，所以在某些包的引入顺序上可能会不同，大部分情况下并不会出什么问题，但是在css的权重计算上可能会出现一些差异，例如这个使用windicss的例子

```vue
<template>
    <div class="w-10 h-10 hover:bg-[red] active"></div>
</template>
<style scoped>
.active{
    background:green;
}
</style>
```

在开发环境下，windicss的类名的引入顺序在style scoped里的类名之前，所以在鼠标hover时应该显示背景为绿色。但是在打包之后，
如果使用了splitChunk配置的话,windicss的类名和style内的类名会被打包到不同文件内，且windicss的顺序可能会在style标签之后，导致鼠标hover时显示为红色，与开发环境出现了差异

测试一下是否成功。
