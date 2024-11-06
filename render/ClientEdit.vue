<template>
  <div>edit:</div>
  <button @click="toSave">save</button>
  <div ref="editorRef"></div>
</template>
<script lang="ts" setup>
import { readPageById, writePage as _writePage } from "@/adapter/fs";
import { readPageById as _readPageById, writePage } from "@/adapter/github";

import { createEditor } from "@/editor";
import { PageData } from "@/shared/type";
import { JSONContent } from "@tiptap/core";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.query.id as string;

const pageData = ref<PageData>();
const content = ref("");
readPageById(id).then((v) => {
  pageData.value = v;
  content.value = v.content;
});

let editor: ReturnType<typeof createEditor> | undefined;
const editorRef = ref<HTMLDivElement>();
onMounted(() => {
  const el = editorRef.value;
  if (!el) return;
  watch(
    content,
    () => {
      if (!content.value) return;
      editor = createEditor(el, content.value);
    },
    { once: true }
  );
});

const filterRepeat = <T, K extends keyof T>(arr: T[], id: K) => {
  const r: any[] = [];
  return arr.filter((v) => !r.includes(v[id]));
};

const travelDoc = (doc: JSONContent, walker: (v: JSONContent) => void) => {
  walker(doc);
  // doc.content?.forEach((d, i, arr) => walker(arr[i]));
  for (const d of doc.content ?? []) {
    walker(d);
  }
};

const toSave = async () => {
  console.log("save", pageData.value, editor);
  if (!editor || !pageData.value) return;
  const newContent = editor.getJSON();
  console.log(editor.state.doc.content, "res");
  const images: { name: string; url: string }[] = [];
  editor.state.doc.content.forEach((node) => {
    if (node.type.name === "image") {
      const url = node.attrs.src as string;
      if (url.startsWith("blob:")) {
        images.push({ url: node.attrs.src, name: node.attrs.alt });
      }
    }
  });

  const filtered = filterRepeat(images, "url");
  const assets = await Promise.all(
    filtered.map(async (v) => {
      const blob = await (await fetch(v.url)).blob();
      const file = new File([blob], `${Date.now()}_${v.name}`);
      return { ...v, file };
    })
  );

  travelDoc(newContent, (v) => {
    if (v.type === "image") {
      const r = assets.find((x) => x.url === (v.attrs?.src as string));
      if (r && v.attrs) {
        v.attrs.src = `/post-assets/${r.file.name}`;
        console.log(v);
      }
    }
  });
  writePage(
    id,
    {
      content: JSON.stringify(newContent),
      title: pageData.value.title,
      tags: [...pageData.value.tags],
    },
    assets
  );
};
</script>
