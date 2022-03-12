import { defineConfig } from "vitepress";
import getCustomConfig from "./utils/get-config";

export default getCustomConfig({
  title: "Blog",
  description: "",
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
  outDir: "docs",
});
