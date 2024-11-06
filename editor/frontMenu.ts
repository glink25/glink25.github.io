import { EditorView } from "@tiptap/pm/view"
import { h } from "./utils/h"
import { TextSelection } from "@tiptap/pm/state"

export const createFrontMenu = (view: EditorView, getCurrentNode: () => Element | undefined) => {
    const menu = h("div", {
        className: "ud-root front-handle",
        "data-front-handle": "",
        draggable: true,
    }, [
        h("button", {
            "data-front-handle": "",
            onClick: () => {
                const currentNode = getCurrentNode()
                if (!currentNode) return
                const { state, dispatch } = view
                const { tr } = state;
                const currentPosition = view.posAtDOM(currentNode, 0)
                const node = state.doc.nodeAt(currentPosition)
                if (!node) return
                const endPos = currentPosition + node.nodeSize
                // 创建一个新的段落节点
                const newParagraph = state.schema.nodes.paragraph.create({}, state.schema.text("/"));

                const newSelectionPos = endPos + newParagraph.nodeSize;
                let transaction = tr.insert(endPos, newParagraph);

                transaction = transaction.setSelection(TextSelection.create(transaction.doc, newSelectionPos));

                // 执行变更
                dispatch(transaction);
                view.focus()

            }
        }, "+"),
        h("button", {
            className: "drag-handle",
            "data-drag-handle": "",
            "data-front-handle": "",
        }, "")
    ])
    return menu
}