## 使用类型既是

### Tips

1, 使用别名alias可以有效防止```../../folder```这样的情况，常见配置为把```@/```作为```/src```目录，配置如下：
``` json
{
  "compilerOptions": {
    "paths": {
      "@/*": [
        "./.vitepress/*"
      ]
    },
  },
}
```
注意paths是写在compilerOptions里面的，不要写在外面，否则会报错而且完全搜不到为什么