export const config = {
  github: {
    login: "glink25", // github login name, not user name
    repo: "glink25.github.io", //"urodele",
    logInUrl: "https://github-login.link-ai.workers.dev/",
    logInAuthUrl: "https://github-login.link-ai.workers.dev/",
  },
  head: {
    title: "Urodele",
  },
  footer: {
    copyright: "© Glink",
    copyrightUrl: "https://github.com/glink25",
  },
  giscus: {
    src: "https://giscus.app/client.js",
    "data-repo": "glink25/glink25.github.io",
    "data-repo-id": "R_kgDONTJ_KQ",
    "data-category": "Announcements",
    "data-category-id": "DIC_kwDONTJ_Kc4Ckrg6",
    "data-mapping": "pathname",
    "data-strict": "0",
    "data-reactions-enabled": "1",
    "data-emit-metadata": "0",
    "data-input-position": "bottom",
    "data-theme": "preferred_color_scheme",
    "data-lang": "zh-CN",
    crossorigin: "anonymous",
    async: true,
  } as object | false,
} as const;

export default config;
