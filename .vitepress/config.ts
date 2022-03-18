import getCustomConfig from "./utils/get-config";
import { VitePWA } from "vite-plugin-pwa";

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
    ["link", { rel: "manifest", href: "/manifest.webmanifest" }],

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
    { title: "MyDays - 倒数日", href: "https://glink25.gitee.io" },
  ],
  outDir: "dist",
  vite: {
    plugins: [
      VitePWA({
        includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
        manifest: {
          name: "Blog - GLink",
          short_name: "Blog",
          description: "Blog",
          theme_color: "#000000",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          display: "standalone",
          start_url: "/",
          orientation: "portrait-primary",
        },
      }),
    ],
  },
});
