import { JSONContent } from "@tiptap/core";
import { getSSRHTML } from "../editor/extensions";
import { parseIntro, parseMeta, pathToId } from "../shared/transform";
import { readdir, readFile } from "fs/promises";
import { Plugin } from "vite";

const getPageData = async () => {
  const dir = await readdir("./pages", { withFileTypes: true });
  const pageFiles = await Promise.all(
    dir
      .filter((v) => v.isFile() && v.name.endsWith(".json"))
      .map(async (v) => {
        const file = await readFile(`./pages/${v.name}`, { encoding: "utf-8" });
        return [v.name, JSON.parse(file)] as [string, JSONContent];
      })
  );
  const tags = new Set<string>();

  const rawPageData = await Promise.all(
    pageFiles.map(async ([path, content]) => {
      const meta = parseMeta(content);
      meta.tags.forEach((t) => tags.add(t));
      return {
        content: JSON.stringify(content),
        ...meta,
        id: pathToId(path),
        path,
        intro: parseIntro(content) ?? "",
        html: getSSRHTML(content),
      };
    })
  );
  const pageData = rawPageData.sort((a, b) => b.createTime - a.createTime);
  return { pageData, tags: [...tags] };
};

const getSinglePageData = async (id: string) => {
  const text = await readFile(`./pages/${decodeURIComponent(id)}.json`, { encoding: "utf-8" });
  const content = JSON.parse(text);
  const meta = parseMeta(content);
  return {
    content: text,
    ...meta,
    id,
    path: `/pages/${id}.json`,
    intro: parseIntro(content) ?? "",
    html: getSSRHTML(content),
  };
};

export const virtualIdPrefix = "v:ssr-inject";

export const SSRDataPlugin = (): Plugin => {
  // const jsons: string[] = [];
  const transformers = [
    {
      match: (id: string) => id.endsWith(":home"),
      transform: async (_id: string) => {
        const res = await getPageData();
        return `export default ${JSON.stringify(res)}`;
      },
    },
    {
      match: (id: string) => id.endsWith(":meta"),
      transform: async (_id: string) => {
        const res = await getPageData();
        const shorted = {
          tags: res.tags,
          pageData: res.pageData.map((v) => ({
            ...v,
            content: undefined,
            html: undefined,
            intro: undefined,
          })),
        };
        return `export default ${JSON.stringify(shorted)}`;
      },
    },
    {
      match: (id: string) => id.includes(":page:"),
      transform: async (id: string) => {
        const path = id.split(":page:")[1];
        const res = await getSinglePageData(path);
        return `export default ${JSON.stringify(res)}`;
      },
    },
    {
      match: (id: string) => id.endsWith('loader'),
      transform: async (id: string) => {
        const data = await getPageData()
        const source = `
            const pages = {
            ${data.pageData.map(p => `'${p.id}': () => import('v:ssr-inject:page:${p.id}'),`).join("\n")}
            };
            
            export function loadPage(page) {
              if (pages[page]) {
                return pages[page]();
              } else {
                throw new Error(\`Page \${page} not found\`);
              }
            }
          `
        return source;
      },
    },
  ];

  return {
    name: "my-plugin", // required, will show up in warnings and errors
    resolveId(id) {
      if (id.includes("v:ssr-inject")) {
        // const newId = "\0" + id.replace("./", "");
        // if (jsons.every((v) => v !== id)) {
        //   jsons.push(newId, id);
        // }
        return id;
      }
    },
    async load(id) {
      if (id.includes("v:ssr-inject")) {
        const transformer = transformers.find((v) => {
          return v.match(id);
        });
        const result = (await transformer?.transform(id)) ?? `export default {}`;
        return result;
      }
    },
    async config() {
      return {
        ssgOptions: {
          async onBeforePageRender(route, indexHTML, appCtx) {
            if (!route.startsWith('/pages')) {
              return
            }
            console.log("html", route, indexHTML)
            const pageId = route.replace('/pages/', '')
            const data = await getSinglePageData(pageId)
            appCtx.app.provide('__PRIVATE_INJECTED_DATA', data)
            // return indexHTML.replace('</head>', `<script>window.__PRIVATE_INJECTED_DATA = ${JSON.stringify(data)}</script></head>`)
          },
          includedRoutes: async () => {
            const { pageData, tags } = await getPageData()
            const pageSize = 10;
            const pageCount = Math.ceil(pageData.length / pageSize);
            const includedRoutes =
              [
                // homepage
                "/",
                // pagination
                ...Array.from({ length: pageCount }, (_, i) => `/${i}`),
                // post page
                ...pageData.map((v) => `/pages/${v.id}`),
                // tags page
                "/tags",
                ...tags.map((tag) => `/tags/${encodeURIComponent(tag)}`),
                // editor
                "/edit",
              ];
            return includedRoutes
          }
        },
      }
    },
  };
};
