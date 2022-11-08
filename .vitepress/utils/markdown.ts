import { type Stats, readFileSync, statSync } from "fs";
import matter from "gray-matter";

const deSuffix = (path: string) => {
    const arr = path.split(".")
    arr.pop()
    return arr.join('.')
}

export const markdownInfo = (folder: string, name: string) => {
    const path = `${folder}/${name}`
    const fileInfo = statSync(path);
    const content = readFileSync(path, "utf-8");
    const createTime = fileInfo.ctimeMs
    const updateTime = fileInfo.atimeMs
    const { data } = matter(content);
    const [_full, _key, match] = content.match(/^(#+)(.*)/) || [undefined, undefined]
    const markdownTitle = match?.replaceAll(" ", "")
    const title = data.title ?? markdownTitle ?? deSuffix(name)
    return {
        title,
        createTime,
        updateTime,
        frontMatter: data,
        regularPath: `${folder.split('/').at(-1)}/${name.replace(".md", ".html")}`,
        relativePath: name,
    }
}