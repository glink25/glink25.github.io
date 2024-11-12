import { PageData } from "@/shared/type";
import { Editor, JSONContent } from "@tiptap/core";
import { getLocalUploadImages, travelDoc } from "../utils/doc";

type EditParams = [data: { pageData: PageData | undefined; tags: string[] }, editor: Editor | undefined];
type EditReturned = {
  pageData: PageData;
  editorJSON: JSONContent;
  tags: string[];
  assets: {
    file: File;
    name: string;
    url: string;
  }[];
};
export const transformEdited = async (...[data, editor]: EditParams): Promise<EditReturned | undefined> => {
  if (!editor) return;
  const { assets, editorJSON } = await getLocalUploadImages(editor);
  return {
    pageData: {
      ...data.pageData!,
    },
    editorJSON,
    tags: data.tags,
    assets,
  };
};

export const transformSaved = async (data: any): Promise<EditParams[0]> => {
  const { pageData, editorJSON, tags, assets } = data as EditReturned;
  console.log(assets, "asss");
  travelDoc(editorJSON, (node) => {
    if (node.type === "image") {
      const img = assets.find((asset) => asset.url === (node.attrs?.src as string));
      if (img && node.attrs) {
        const blobUrl = URL.createObjectURL(img.file);
        node.attrs.src = blobUrl;
      }
    }
  });
  pageData.content = JSON.stringify(editorJSON);
  return {
    pageData,
    tags,
  };
};
