export const config = {
  github: {
    login: 'glink25', // github login name, not user name
    repo: "glink25.github.io", //"urodele",
    logInUrl: 'https://github-login.link-ai.workers.dev/',
    logInAuthUrl: 'https://github-login.link-ai.workers.dev/',
  },
  head: {
    title: "Urodele",
  },
  footer: {
    copyright: "© Glink",
    copyrightUrl: "https://github.com/glink25",
  },
  giscus: false as object | false,
} as const;

export default config;
