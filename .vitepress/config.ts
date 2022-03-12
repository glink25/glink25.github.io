import { defineConfig } from "vitepress";
import getCustomConfig from "./utils/get-config";

export default getCustomConfig({
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
      { rel: "apple-touchicon", href: "/apple-touch.ico", size: "180x180" },
    ],
    ["meta", { name: "theme-color", content: "#000" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
    ],
  ],
  catagories: [
    { name: "tech", folder: "posts/tech", title: "Tech" },
    { name: "story", folder: "posts/story", title: "Story" },
  ],
  friendLinks: [
    {
      title: "Peek - 点对点通讯聊天",
      href: "https://peek-transfer.github.io",
    },
    { title: "MyDays - 倒数日", href: "" },
  ],
  outDir: "dist",
});
