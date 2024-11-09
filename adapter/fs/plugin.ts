import { readFile, writeFile } from "fs/promises";
import { join, resolve } from "path";
import { Plugin } from "vite";
import jsonBody from "body/json";
import { PageData } from "../../shared/type";
import formidable from "formidable";

export const FSAdapterPlugin = () => {
  const config: Plugin = {
    name: "FSAdapterPlugin",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/fs-plugin-api", async (req, res, next) => {
        // 自定义请求处理...
        const epath = req.url;
        if (epath === undefined) {
          res.statusCode = 400;
          res.end();
          return;
        }
        const path = decodeURIComponent(epath);
        const realpath = resolve(__dirname, `../..${path}`);
        if (req.method === "GET") {
          try {
            const text = await readFile(realpath, "utf-8");
            res.write(text);
            res.end();
          } catch (error) {
            console.error(error);
            res.statusCode = 400;
            res.end();
          }
          return;
        }
        if (req.method === "POST") {
          jsonBody(req, res, async (err, v) => {
            const data = v as Partial<PageData>;
            await writeFile(realpath, JSON.stringify(data));
            res.end();
            // server.ws.send({ type: "full-reload" });
            server.restart();
          });

          return;
        }
        if (req.method === "PATCH") {
          const form = formidable({
            uploadDir: resolve(__dirname, `../../public/post-assets`),
            filename(name, ext, part, form) {
              return part.originalFilename ?? name;
            },
          });
          try {
            const [fileds, files] = await form.parse(req);
            console.log(fileds, files);
            const file = files.file?.[0];
            if (!file) {
              throw new Error("no file upload");
            }
            res.end();
            return;
          } catch (error) {
            console.error(error);
            res.statusCode = 400;
            res.end(error);
          }
          res.statusCode = 400;
          res.end();
          return;
        }
        next();
      });
    },
  };
  return config;
};
