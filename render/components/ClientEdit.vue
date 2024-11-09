<template>
  <Teleport defer to=".header-operations">
    <button
      :disabled="saving || loading"
      @click="toSave"
      class="buttoned bg-blue-200"
      :data-loading="saving"
    >
      save
    </button>
  </Teleport>
  <div
    :data-modal-loading="loading"
    class="flex flex-col justify-center w-full px-2 md:px-16 min-h-[40vh]"
  >
    <TagEditor v-model="tags" />
    <div ref="editorRef"></div>
  </div>
</template>
<script lang="ts" setup>
import adapter from "@/adapter";

import type { createEditor } from "@/editor";
import { parseTitle, toUniqueFilename } from "@/shared/transform";
import { PageData } from "@/shared/type";
import { JSONContent } from "@tiptap/core";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import TagEditor from "./TagEditor.vue";

const { readPageByPath, writePage } = adapter;
const loading = ref(true);

const route = useRoute();
const path = route.query.path as string;

const pageData = ref<PageData>();
const tags = ref<string[]>([]);
const content = ref("");
const isCreateMode = route.query.new !== undefined;
if (isCreateMode) {
  // create post
  pageData.value = {
    id: "",
    tags: [],
    title: "",
    content: "",
    path: "",
    createTime: 0,
    updateTime: 0,
  };
} else {
  loading.value = true;
  readPageByPath(path)
    .then((v) => {
      // edit post
      pageData.value = v;
      content.value = v.content;
      tags.value = v.tags;
    })
    .finally(() => {
      loading.value = false;
    });
}

let editor: ReturnType<typeof createEditor> | undefined;
const editorRef = ref<HTMLDivElement>();

const create = async (...args: Parameters<typeof createEditor>) =>
  (await import("@/editor")).createEditor(...args);

onMounted(async () => {
  const el = editorRef.value;
  if (!el) return;

  loading.value = true;
  if (isCreateMode) {
    editor = await create(el, content.value);
    loading.value = false;
  } else {
    watch(
      content,
      async () => {
        editor = await create(el, content.value);
        loading.value = false;
      },
      { once: true }
    );
  }
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

const saving = ref(false);
const toSave = async () => {
  saving.value = true;
  try {
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
        const file = new File([blob], toUniqueFilename(v.name));
        return { ...v, file };
      })
    );

    travelDoc(newContent, (node) => {
      if (node.type === "image") {
        const img = assets.find(
          (asset) => asset.url === (node.attrs?.src as string)
        );
        if (img && node.attrs) {
          node.attrs.src = `/post-assets/${img.file.name}`;
        }
      }
    });
    const newTags = [...tags.value];
    const title = parseTitle(newContent) ?? "";
    // TODO: validate title length
    if (!title) {
      alert("Title can not be empty!");
      return;
    }
    if (isCreateMode) {
      const newPath = `/pages/${toUniqueFilename(title)}.json`;
      await writePage(
        newPath,
        {
          content: JSON.stringify(newContent),
          title,
          tags: newTags,
          createTime: Date.now(),
          path: newPath,
        },
        assets
      );
      if (import.meta.env.DEV) {
        location.replace("/");
      }
    } else {
      await writePage(
        path,
        {
          content: JSON.stringify(newContent),
          title,
          tags: newTags,
          createTime: pageData.value.createTime,
        },
        assets
      );
    }
  } catch (err) {
    alert(err);
  } finally {
    saving.value = false;
  }
};
</script>
