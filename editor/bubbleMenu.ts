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
          console.log(isActive, event.target);
          // if (isActive) {
          //     event.target?.classList.add("active")
          // } else {
          //     event.target?.classList.remove("active")
          // }
        },
      },
      "B"
    ),
    h(
      "button",
      {
        onClick: () => {
          const editor = getEditor();
          editor.chain().focus().toggleItalic().run();
        },
      },
      "I"
    ),
    h(
      "button",
      {
        onClick: () => {
          const editor = getEditor();
          editor.chain().focus().toggleUnderline().run();
        },
      },
      "U"
    ),
    h(
      "button",
      {
        onClick: () => {
          const editor = getEditor();
          editor.chain().focus().toggleStrike().run();
        },
      },
      "S"
    ),
    h(
      "button",
      {
        onClick: () => {
          const editor = getEditor();
          editor.chain().focus().toggleCode().run();
        },
      },
      "<>"
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
