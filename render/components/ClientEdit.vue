<template>
  <Teleport defer to=".header-operations">
    <div class="relative local-save mr-6 text-sm">
      <button :class="['text-button', changeSaved ? 'text-green-500' : '']">
        <div
          :class="[
            changeSaved ? 'i-material-symbols:sync-saved-locally-outline-rounded' : 'i-svg-spinners:ring-resize',
          ]"></div>
      </button>
      <div
        class="absolute right-0 z-[50] local-save-tooltip bg-white flex flex-col justify-center text-xs w-[200px] shadow rounded gap-2 p-2">
        <div v-if="changeSaved" class="text-center text-green-500">Changes saved</div>
        <div v-else class="text-center">Saving Changes to local</div>
        <button class="buttoned bg-red text-xs" @click="toClearLocalSaved">Clear</button>
        <div class="text-xs text-red text-center">saved doc will be cleared!</div>
      </div>
    </div>
    <button :disabled="saving || loading" @click="toSave" class="buttoned bg-blue-200" :data-loading="saving">
      save
    </button>
  </Teleport>
  <div :data-modal-loading="loading" class="flex flex-col w-full px-2 md:px-16 min-h-[40vh]">
    <TagEditor v-model="tags" />
    <div ref="editorRef"></div>
  </div>
  <LeaveGuard :safe="changeSaved" />
</template>
<script lang="ts" setup>
import adapter from "@/adapter";

import type { createEditor } from "@/editor";
import { parseTitle, toFilename, toUniqueFilename } from "@/shared/transform";
import { PageData } from "@/shared/type";
import { onBeforeUnmount, onMounted, ref, toRaw, watch } from "vue";
import { useRoute } from "vue-router";
import TagEditor from "./TagEditor.vue";
import LeaveGuard from "./LeaveGuard.vue";
import { usePageData } from "../hooks/page";
import { getLocalUploadImages, travelDoc } from "../utils/doc";
import { debounce } from "../utils/debounce";
import { createSaver } from "../utils/autoSave";
import { transformEdited, transformSaved } from "../hooks/saver";

const { readPageByPath, writePage } = adapter;
const loading = ref(true);

const route = useRoute();
const path = route.query.path as string;

const pageData = ref<PageData>();
const tags = ref<string[]>([]);
const isCreateMode = route.query.new !== undefined;
const init = async () => {
  console.log(path, "path");
  const locals = await saver.read(path);
  if (locals) {
    const x = await transformSaved(locals);
    console.log(x, "xxx");
    pageData.value = x.pageData;
    tags.value = x.tags;
    return;
  }
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
        tags.value = v.tags;
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

let editor: ReturnType<typeof createEditor> | undefined;
const editorRef = ref<HTMLDivElement>();

const create = async (...args: Parameters<typeof createEditor>) => (await import("@/editor")).createEditor(...args);

const saver = createSaver();
const changeSaved = ref(true);
const registerAutoSave = () => {
  const saveToLocal = debounce(async () => {
    console.log("auto save start...");
    const persisted = {
      pageData: toRaw(pageData.value),
      tags: toRaw(tags.value),
    };
    const res = await transformEdited(persisted, editor);
    await saver.save(res, path);
    changeSaved.value = true;
    console.log("auto save success");
  });
  editor?.on("update", () => {
    changeSaved.value = false;
    saveToLocal();
  });
};
const toClearLocalSaved = async () => {
  await saver.clean(path);
  location.reload();
};

onMounted(async () => {
  await init();
  const el = editorRef.value;
  if (!el) return;

  loading.value = true;
  if (isCreateMode) {
    editor = await create(el, pageData.value?.content ?? "");
    loading.value = false;
    registerAutoSave();
  } else {
    watch(
      () => pageData.value,
      async (v) => {
        if (v) {
          stop();
        }
        editor = await create(el, pageData.value?.content ?? "");
        loading.value = false;
        registerAutoSave();
      },
      { once: true }
    );
  }
});
onBeforeUnmount(() => {
  editor?.destroy();
});

const short = usePageData();

const saving = ref(false);
const toSave = async () => {
  saving.value = true;
  try {
    console.log("save", pageData.value, editor);
    if (!editor || !pageData.value) return;
    const newContent = editor.getJSON();
    const { assets } = await getLocalUploadImages(editor);
    // 将本地上传的文件转为博客路径
    travelDoc(newContent, (node) => {
      if (node.type === "image") {
        const img = assets.find((asset) => asset.url === (node.attrs?.src as string));
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
      const utitle = (() => {
        // 防止重复名
        if (short.value?.pageData.some((v) => v.title === title)) {
          return toUniqueFilename(title);
        }
        return toFilename(title);
      })();
      const newPath = `/pages/${utitle}.json`;
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
<style lang="scss" scoped>
.local-save {
  .local-save-tooltip {
    display: none;
  }
  &:focus-within {
    .local-save-tooltip {
      display: flex;
    }
  }
}
</style>
