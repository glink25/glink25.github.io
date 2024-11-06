import { h } from "../utils/h"

export const createMenu = (props: {
    items: { title: string, command: any }[], editor: any, command: any
}) => {
    const { items } = props
    const buttons = items.map((item) => {
        return h("button", {
            className: "",
            onClick: () => {
                props.command(item)
            }
        }, item.title)
    })
    const root = h("div", { className: "ud-root slash-menu" }, buttons)
    let selectedIndex = 0
    const setSelectedIndex = (index) => {
        buttons.forEach((bt, i) => {
            if (index === i) {
                bt.classList.add("selected")
            } else {
                bt.classList.remove("selected")
            }
        })
    }
    setSelectedIndex(0)
    const upHandler = () => {
        selectedIndex = selectedIndex === 0 ? buttons.length - 1 : selectedIndex - 1
        setSelectedIndex(selectedIndex)
    }
    const downHandler = () => {
        selectedIndex = selectedIndex === buttons.length - 1 ? 0 : selectedIndex + 1
        setSelectedIndex(selectedIndex)
    }
    const enterHandler = () => {
        props.command(items[selectedIndex])
    }
    root.append(...buttons)
    const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
            upHandler()
            return true
        }

        if (event.key === 'ArrowDown') {
            downHandler()
            return true
        }

        if (event.key === 'Enter') {
            enterHandler()
            return true
        }

        return false
    }
    const updateProps = (p: any) => { }

    return {
        dom: root,
        updateProps,
        onKeyDown,
        destroy: () => root.remove()
    }
}