import { inject, ref } from "vue"
import { JSONContent } from "@tiptap/core";
import { getSSRHTML } from "../editor/extensions";
import { parseIntro, parseMeta, pathToId } from "../shared/transform";
import { readdir, readFile } from "fs/promises";
import { Plugin } from "vite";

const virtualIdPrefix = "__SSR_DATA";


export const useSSRRouteData = () => {
    const routePathToId = (path: string) => `__SSR_DATA_ROUTE_${path}`

    const route: any = {}
    const id = routePathToId(route.path)
    const injected = inject(id)
    const data = ref<any>()
    if (typeof window === undefined) {
        data.value = injected
    } else {
        data.value = injected
    }
}

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
                // content: JSON.stringify(content),
                ...meta,
                id: pathToId(path),
                path,
                intro: parseIntro(content) ?? "",
                // html: getSSRHTML(content),
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


export const SSRRouteDataPlugin = (): Plugin => {

    let includedDataRoute: Awaited<ReturnType<typeof _getIncludeRoutes>>
    const _getIncludeRoutes = async () => {
        const { pageData, tags } = await getPageData()
        const pageSize = 10;
        const pageCount = Math.ceil(pageData.length / pageSize);
        const includedRoutes =
            [
                // homepage
                {
                    route: "/",
                    provide: async () => {
                        return { pageData }
                    }
                },
                // pagination
                ...Array.from({ length: pageCount }, (_, i) => `/${i}`).map(route => ({
                    route,
                    provide: () => ({ pageData })
                })),
                // post page
                ...pageData.map((v) => `/pages/${v.id}`).map(route => ({
                    route,
                    provide: async (route: string) => {
                        const id = route.replace('/pages/', '')
                        const res = pageData.find(v => v.id === id)
                        const page = await getSinglePageData(id)
                        console.log(id, 'trnaform id', route)
                        return { pageData, page }
                    }
                })),
                // tags page
                {
                    route: "/tags",
                    provide: () => ({ pageData })
                },
                ...tags.map((tag) => `/tags/${encodeURIComponent(tag)}`).map((route) => ({
                    route,
                    provide: () => ({ pageData })
                })),
                // editor
                {
                    route: '/edit',
                    provide: () => ({ pageData })
                },
            ];
        return includedRoutes
    }
    const getGlobalData = () => getPageData()
    const getIncludeRoutes = async () => {
        if (includedDataRoute) return includedDataRoute
        includedDataRoute = await _getIncludeRoutes()
        return includedDataRoute
    }

    // const jsons: string[] = [];
    const transformers = [
        {
            match: (id: string) => id === '__SSR_DATA_GLOBAL',
            transform: async () => {
                const globalData = await getGlobalData()
                const source = `
            export default ${JSON.stringify(globalData)}
          `
                return source
            }
        },
        {
            match: (id: string) => id === '__SSR_DATA_DEV_LOADER',
            transform: async (_id: string) => {
                const routes = await getIncludeRoutes();
                const globalData = await getPageData()
                const source = `
            const pages = {
            ${routes.map(p => `'${p.route}': () => import('__SSR_DATA_ROUTE_${p.route}'),`).join("\n")}
            };
            
            export function loadPage(page) {
              if (pages[page]) {
                return pages[page]();
              } else {
                throw new Error(\`Page \${page} not found\`);
              }
            }
            export default ${JSON.stringify(globalData)}
          `
                return source
            },
        },
        {
            match: (id: string) => id.startsWith('__SSR_DATA_ROUTE_'),
            transform: async (id: string) => {
                const route = id.replace('__SSR_DATA_ROUTE_', '');
                const res = await getIncludeRoutes();
                const provided = await res.find(v => v.route === route)?.provide(route)
                console.log(provided, 'provide', route, res.find(v => v.route === route))
                return `export default ${JSON.stringify(provided)}`;
            },
        },
    ];

    return {
        name: "my-plugin", // required, will show up in warnings and errors
        resolveId(id) {
            if (id.startsWith(virtualIdPrefix)) {
                return id;
            }
        },
        async load(id) {
            if (id.startsWith(virtualIdPrefix)) {


                const transformer = transformers.find((v) => {
                    return v.match(id);
                });
                console.log(id, 'id', transformer)
                const result = (await transformer?.transform(id)) ?? `export default {}`;
                return result;
            }
        },
        async config() {
            const routes = await getIncludeRoutes()
            const includedRoutes = routes.map(v => typeof v === 'string' ? v : v.route)
            return {

                ssgOptions: {
                    // async onBeforePageRender(route, indexHTML, appCtx) {
                    //     appCtx.app.provide('hello', { hello: '0823' })
                    //     const r = routes.find(v => v.route === route)
                    //     if (!r) {
                    //         return undefined
                    //     }
                    //     const provided = await r.provide(route)
                    //     appCtx.app.provide(`__SSR_DATA_ROUTE_${route}`, provided)

                    //     console.log('injected', route, provided)
                    // },
                    includedRoutes: () => includedRoutes
                },
            }
        },
    };
};
