import * as React from "jsx-dom";

import { createEditor } from "../../editor";
import adapter from "../../adapter";
import { getLocalUploadImages, travelDoc } from "../../utils/doc";
import { parseTitle, toFilename, toUniqueFilename } from "../../shared/transform";
import { getGlobalData } from "../../utils/data";
import { useAttrRef } from "../../utils/dom";
import { createTagEditor } from "./../TagEditor/TagEditor";
import { debounce } from "../../utils/debounce";
import { createSaver } from "../../utils/saver";
import type { PageData } from "../../shared/type";
import "./style.scss";

const { readPageByPath, writePage } = adapter;

export const mount = async (selector: string, operationSelector: string) => {
  const root = document.querySelector<HTMLElement>(selector);
  const opRoot = document.querySelector<HTMLElement>(operationSelector);

  if (!root || !opRoot) return;

  const url = new URL(location.href);
  const isCreate = url.searchParams.has("new");
  const pagePath = url.searchParams.get("path") ?? undefined;

  const globalData = await getGlobalData();

  const saver = createSaver();

  const { editor, tagEditor, initial } = await (async () => {
    const saved = await saver.read(pagePath);
    const { data: savedPageData } = saved ? await transformSaved(saved) : {};

    const pageDat = await (async () => {
      if (savedPageData) {
        return savedPageData as PageData;
      }
      if (pagePath) {
        return readPageByPath(pagePath);
      }
    })();

    const tagEditor = await createTagEditor(root, pageDat?.tags ?? []);
    const editor = createEditor(root, pageDat?.content ?? "");
    return {
      tagEditor,
      editor,
      initial: pageDat,
    };
  })();

  root.removeAttribute("data-modal-loading");

  const getCurrentDoc = async () => {
    const newContent = editor.getJSON();
    const { assets } = await getLocalUploadImages(editor);
    const newTags: string[] = tagEditor.getValue();

    const title = parseTitle(newContent) ?? "";

    const path = (() => {
      if (!isCreate) return pagePath!;
      if (globalData.some((v) => v.title === title)) {
        return toUniqueFilename(title);
      }
      return toFilename(title);
    })();
    return {
      path,
      content: newContent,
      data: {
        content: JSON.stringify(newContent),
        title,
        tags: newTags,
        createTime: initial?.createTime ?? Date.now(),
      },
      assets,
    };
  };

  const Save = () => {
    const [saveButtonRef, setSaveStatus] = useAttrRef({ disable: false, "data-loading": false });

    const toSave = async (draft = false) => {
      setSaveStatus({ disable: true, "data-loading": true });
      try {
        const { path, data, assets, content } = await getCurrentDoc();
        // 将本地上传的文件转为博客站点路径
        travelDoc(content, (node) => {
          if (node.type === "image") {
            const img = assets.find((asset) => asset.url === (node.attrs?.src as string));
            if (img && node.attrs) {
              node.attrs.src = `/post-assets/${img.file.name}`;
            }
          }
        });

        await writePage(path, { ...data, draft }, assets);
      } finally {
        setSaveStatus({ disable: false, "data-loading": false });
      }
    };

    const saveButton = (
      <div class="group relative">
        <button ref={saveButtonRef} class="buttoned bg-blue-200" onClick={() => toSave()}>
          <div>Publish</div>
          <div class='i-ri:arrow-down-s-fill'></div>
        </button>
        <div class="absolute top-full pt-1 transition-all transition-delay-[0.2s] whitespace-nowrap opacity-0 translate-y--2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
          <button class="buttoned bg-yellow-200" onClick={() => toSave(true)}>Save as draft</button>
        </div>
      </div>
    );

    return saveButton;
  };

  const AutoSaveIndicator = () => {
    const localSaverRef = React.createRef();
    let changeSaved = true;
    const setChangeSaved = (v: boolean) => {
      changeSaved = v;
      (localSaverRef.current as HTMLElement).replaceChildren(render());
    };
    // auto save
    const saveToLocal = debounce(async () => {
      const { data, assets, content } = await getCurrentDoc();
      await saver.save({ data: { ...data, content: undefined }, assets, content }, pagePath);
      setChangeSaved(true);
    });
    const toClearLocalSaved = async () => {
      await saver.clean(pagePath);
      location.reload();
    };
    const onUpdate = () => {
      setChangeSaved(false);
      saveToLocal();
    };
    editor.on("update", onUpdate);
    tagEditor.onChange(onUpdate);

    const render = () => (
      <>
        <button class={["text-button", changeSaved ? "text-green-500" : ""].join(" ")}>
          <div
            class={[
              changeSaved ? "i-material-symbols:sync-saved-locally-outline-rounded" : "i-svg-spinners:ring-resize",
            ].join(" ")}></div>
        </button>
        <div class="absolute right-0 z-[50] local-save-tooltip bg-white flex flex-col justify-center text-xs w-[200px] shadow rounded gap-2 p-2">
          {changeSaved ? (
            <div class="text-center text-green-500">Changes saved</div>
          ) : (
            <div class="text-center">Saving Changes to local</div>
          )}
          <button class="buttoned bg-red text-xs" onClick={toClearLocalSaved}>
            Clear
          </button>
          <div class="text-xs text-red text-center">saved doc will be cleared!</div>
        </div>
      </>
    );

    return (
      <div ref={localSaverRef} class="relative local-save mr-6 text-sm">
        {render()}
      </div>
    );
  };

  opRoot.appendChild(AutoSaveIndicator());
  opRoot.appendChild(Save());
};

const transformSaved = async (saved: any) => {
  const { data, assets, content } = saved;
  travelDoc(content, (node) => {
    if (node.type === "image") {
      const img = (assets as any[]).find((asset) => asset.url === (node.attrs?.src as string));
      if (img && node.attrs) {
        const blobUrl = URL.createObjectURL(img.file);
        node.attrs.src = blobUrl;
      }
    }
  });

  data.content = JSON.stringify(content);

  return {
    data,
    assets,
    content,
  };
};
