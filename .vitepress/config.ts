import { defineCustomConfig } from "./utils";
import WindiCSS from "vite-plugin-windicss";
import { fileURLToPath, URL } from "url";

export default defineCustomConfig({
  title: "Blog",
  description: "",
  head: [
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "link",
      {
        rel: "apple-touchicon",
        href: "/apple-touch-icon.png",
        size: "180x180",
      },
    ],
    ["meta", { name: "theme-color", content: "#fff" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
  ],
  apiOption: {
    repo: "glink25/glink25.github.io",
  },
  categories: [
    { name: "tech", folder: "posts/tech", title: "Tech" },
    { name: "story", folder: "posts/story", title: "Story" },
  ],
  friendLinks: [
    {
      title: "Peek - 点对点通讯聊天",
      href: "https://peek-transfer.github.io",
    },
    { title: "MyDays - 倒数日", href: "https://glink25.gitee.io" },
    { title: "Oncent - 日计", href: "https://oncent.github.io" },
  ],
  outDir: "dist",
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("../.vitepress", import.meta.url)),
      },
    },
    plugins: [
      WindiCSS({
        config: ".vitepress/windi.config.ts",
        scan: {
          // By default only `src/` is scanned
          dirs: [".vitepress/theme"],
          // We only have to specify the file extensions we actually use.
          fileExtensions: ["vue", "js", "ts", "jsx", "tsx"],
        },
      }),
    ],
  },
});
