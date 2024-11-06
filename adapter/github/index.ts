import { idToPath, parseMeta, toMeta } from "@/shared/transform";
import { PageData } from "@/shared/type";
import { Octokit } from "octokit";

const PREFIX = "/fs-plugin-api";

const REPO = "test-for-anything";

let _oc: Octokit | undefined;
const getOc = () => {
    if (_oc) return _oc;
    const token = localStorage.getItem("github_token");
    if (!token) return undefined;
    const octokit = new Octokit({ auth: token });
    return octokit;
};

export const readPageById = async (id: string): Promise<PageData> => {
    const path = idToPath(id);
    console.log(path, "path");
    const content = await (await fetch(`${PREFIX}${path}`)).text();
    const json = JSON.parse(content);
    const meta = parseMeta(json);
    return {
        content: content,
        ...meta,
        id,
        path,
    };
};

function fileToBase64(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64Data = (reader.result as string).split(",")[1]; // 移除 Data URI 的前缀
            resolve(base64Data);
        };
        reader.onerror = (error) => reject(error);
    });
}

async function getFileSHA(file: File) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

export const writePage = async (
    id: string,
    data: Pick<PageData, "content" | "title" | "tags">,
    assets: { name: string; url: string; file: File }[]
) => {
    const octokit = getOc();
    console.log(octokit, "oc");
    if (!octokit) return;
    const { data: user } = await octokit.request({ url: "/user" });
    const x = await octokit.rest.git


};

// export const writePage = async (
//     id: string,
//     data: Pick<PageData, "content" | "title" | "tags">,
//     assets: { name: string; url: string; file: File }[]
// ) => {
//     const octokit = getOc();
//     console.log(octokit, "oc");
//     if (!octokit) return;
//     const { data: user } = await octokit.request({ url: "/user" });
//     const meta = toMeta({ ...data, updateTime: Date.now() });
//     const rawString = JSON.stringify({ ...meta, ...JSON.parse(data.content) });
//     await Promise.all(
//         [
//             ...assets.map(({ file }) => ({
//                 path: `/public/post-assets/${file.name}`,
//                 file,
//             })),
//             {
//                 path: idToPath(id),
//                 file: rawString
//             },
//         ].map(async ({ file, path }) => {
//             const fileURI =
//                 typeof file === "string" ? btoa(file) : await fileToBase64(file);
//             const origin = await octokit
//                 .request("GET /repos/{owner}/{repo}/contents/{path}", {
//                     owner: user.name,
//                     repo: REPO,
//                     path: "README.md" //path.replace(/^\//, ""),
//                 })
//                 .catch((err) => {
//                     console.warn(err);
//                     return undefined;
//                 });
//             const SHA = origin?.data?.sha;
//             console.log(origin);
//             const res = await octokit.request(
//                 "PUT /repos/{owner}/{repo}/contents/{path}",
//                 {
//                     owner: user.name,
//                     repo: REPO,
//                     path: path.replace(/^\//, ""),
//                     message: "update by urodele",
//                     committer: {
//                         name: user.name,
//                         email: user.email,
//                     },
//                     sha: SHA,
//                     content: fileURI,
//                 }
//             );
//             return res;
//         })
//     );
// };
