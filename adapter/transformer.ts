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

const getSinglePageData = async (path: string) => {
  const text = await readFile(`./pages/${path}.json`, { encoding: "utf-8" });
  const content = JSON.parse(text);
  const meta = parseMeta(content);
  return {
    content: text,
    ...meta,
    id: pathToId(path),
    path,
    intro: parseIntro(content) ?? "",
    html: getSSRHTML(content),
  };
};

const virtualIdPrefix = "./virtual:PrivateSSRData:";
export const SSRDataPlugin = (): Plugin => {
  const jsons: string[] = [];
  const transformers = [
    {
      match: (id: string) => id.endsWith(":home"),
      transform: async (_id: string) => {
        const x = await getPageData();
        return `export default ${JSON.stringify(x)}`;
      },
    },
    {
      match: (id: string) => id.endsWith(":meta"),
      transform: async (_id: string) => {
        const x = await getPageData();
        const shorted = {
          tags: x.tags,
          pageData: x.pageData.map((v) => ({
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
        const x = await getSinglePageData(path);
        return `export default ${JSON.stringify(x)}`;
      },
    },
  ];

  return {
    name: "my-plugin", // required, will show up in warnings and errors
    resolveId(id) {
      if (id.includes("virtual:PrivateSSRData")) {
        const newId = "\0" + id.replace("./", "");
        if (jsons.every((v) => v !== id)) {
          jsons.push(newId, id);
        }
        return newId;
      }
    },
    async load(id) {
      if (id.includes("virtual:PrivateSSRData")) {
        const transformer = transformers.find((v) => {
          return v.match(id);
        });
        const result = (await transformer?.transform(id)) ?? `export default {}`;
        return result;
      }
    },
    // async handleHotUpdate({ server, file, timestamp }) {
    //   if (file.includes(".json")) {
    //     const virtualModule = server.moduleGraph.getModuleById(file)!;
    //     server.moduleGraph.invalidateModule(virtualModule);
    //     // server.ws.send({ type: "full-reload" });
    //     // server.ws.send({
    //     //   type: "update",
    //     //   updates: jsons.map((v) => ({
    //     //     acceptedPath: v,
    //     //     path: v,
    //     //     timestamp: timestamp,
    //     //     type: "js-update",
    //     //   })),
    //     // });
    //   }
    // },
  };
};
