import { Editor } from "@tiptap/core";
import { h } from "./utils/h";
import BubbleMenu from "@tiptap/extension-bubble-menu";

export const createBubbleMenu = (getEditor: () => Editor) => {
  // const menus = [
  //     {
  //         label:"",
  //         className:"",
  //         onClick:()=>{

  //         }
  //     }
  // ]
  return h("div", { className: "ud-root bubble-menu" }, [
    h(
      "button",
      {
        className: "",
        onClick: (event: MouseEvent) => {
          const editor = getEditor();
          editor.chain().focus().toggleBold().run();
          const isActive = editor.isActive("bold");
          if (isActive) {
            (event.target as HTMLElement)?.classList.add("active")
          } else {
            (event.target as HTMLElement)?.classList.remove("active")
          }
        },
      },
      "B"
    ),
    h(
      "button",
      {
        onClick: (event: MouseEvent) => {
          const editor = getEditor();
          editor.chain().focus().toggleItalic().run();
          const isActive = editor.isActive("italic");
          if (isActive) {
            (event.target as HTMLElement)?.classList.add("active")
          } else {
            (event.target as HTMLElement)?.classList.remove("active")
          }
        },
      },
      "I"
    ),
    h(
      "button",
      {
        onClick: (event: MouseEvent) => {
          const editor = getEditor();
          editor.chain().focus().toggleUnderline().run();
          const isActive = editor.isActive("underline");
          if (isActive) {
            (event.target as HTMLElement)?.classList.add("active")
          } else {
            (event.target as HTMLElement)?.classList.remove("active")
          }
        },
      },
      "U"
    ),
    h(
      "button",
      {
        onClick: (event: MouseEvent) => {
          const editor = getEditor();
          editor.chain().focus().toggleStrike().run();
          const isActive = editor.isActive("strike");
          if (isActive) {
            (event.target as HTMLElement)?.classList.add("active")
          } else {
            (event.target as HTMLElement)?.classList.remove("active")
          }
        },
      },
      "S"
    ),
    h(
      "button",
      {
        onClick: (event: MouseEvent) => {
          const editor = getEditor();
          editor.chain().focus().toggleCode().run();
          const isActive = editor.isActive("code");
          if (isActive) {
            (event.target as HTMLElement)?.classList.add("active")
          } else {
            (event.target as HTMLElement)?.classList.remove("active")
          }
        },
      },
      "<>"
    ),
    h(
      "button",
      {
        onClick: (event: MouseEvent) => {
          const editor = getEditor();
          if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run()
          }
          else {
            const result = prompt("Input link")
            if (!result) return
            editor.chain().focus().setLink({ href: result, target: "_blank", rel: "noreferer" }).run();
          }
          const isActive = editor.isActive("link");
          if (isActive) {
            (event.target as HTMLElement)?.classList.add("active")
          } else {
            (event.target as HTMLElement)?.classList.remove("active")
          }
        },
      },
      "🔗"
    ),
  ]);
};

export const createBubbleMenuPlugin = (root: HTMLElement, getEditor: () => Editor) => {
  const bubble = createBubbleMenu(getEditor);
  root.appendChild(bubble);
  return BubbleMenu.configure({
    element: bubble,
    shouldShow({ editor, state }) {
      const { selection } = state;
      const { $from, $to } = selection;
      const isEmptyTextBlock = $from.sameParent($to) && $from.parent.isTextblock && !$from.parent.textContent;
      const isCodeBlock = $from.sameParent($to) && $from.parent.type.name === "codeBlock";

      // 不显示 BubbleMenu 的条件：
      // 1. 当前没有任何选中内容（例如光标在空白处）
      // 2. 选区是在 CodeBlock 中
      if (selection.empty || isEmptyTextBlock || isCodeBlock) {
        return false;
      }

      return true;
    },
  });
};
