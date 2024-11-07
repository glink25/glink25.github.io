import { Editor, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import GlobalFrontHandle from "./frontHandle";
import "./style.scss";
import Document from "@tiptap/extension-document";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { generateHTML } from "@tiptap/html";
import { h } from "./utils/h";

import { createSlashCommandPlugin } from "./commands";
import { createBubbleMenuPlugin } from "./bubbleMenu";
import { createLowlightCodePlugin, createLowlightCodeSSRPlugin } from "./lowlight";
import { createPlaceholderPlugin } from "./placeholder";
import { createHandleImageProps } from "./image";

export const getBasicExtensions = (ssr = false) => {
  const CustomDocument = Document.extend({
    content: "heading block*",
  });
  const displayExtension = [
    CustomDocument,
    StarterKit.configure({
      document: false,
      codeBlock: false,
    }),
    Image,
    Link.configure({
      autolink: false,
    }),
    Underline,
    ssr ? createLowlightCodeSSRPlugin() : createLowlightCodePlugin(),
    createPlaceholderPlugin(),
  ];
  return displayExtension;
};

export const getHTML = (json: JSONContent, ssr = false) => {
  const ex = getBasicExtensions(ssr);
  return generateHTML(json, ex);
};

export const createEditor = (parent: HTMLElement, initialContent: string) => {
  const root = h("div", { className: "ud-root" });
  parent?.appendChild(root);

  const basicExtension = getBasicExtensions();
  const extensions = [
    GlobalFrontHandle,

    ...basicExtension,
    createBubbleMenuPlugin(root, () => editor),
    createSlashCommandPlugin(),
  ];

  const initialHtml = initialContent === "" ? "" : generateHTML(JSON.parse(initialContent), basicExtension);

  console.log(initialHtml);
  const editor: Editor = new Editor({
    element: root,
    extensions: extensions,
    content: initialHtml,
    editorProps: {
      ...createHandleImageProps(() => editor),
    },
  });

  return editor;
};
