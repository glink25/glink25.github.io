const ID = (() => {
    let i = 0;
    return () => i++
})()

type GetterFn<T> = () => T
type Getter<T> = GetterFn<T> & { __is_getter: true, __with_effect: (fn: Callback<T>) => () => void }

const isGetter = <T>(v: any): v is Getter<T> => {
    return typeof v === 'function' && v.__is_getter
}

type Props = {
    className: string | Getter<string>,
    onClick: (e: MouseEvent) => void
    // onXXX
}


const StaticProps = {
    base: ['className', "data-"],
    func: ["click", "keydown", "keyup"]
}

type IfEl = {}
type Child = HTMLElement | string | number | IfEl
type LoopEl = {}
type Children = Child[] | LoopEl

export const h = <K extends keyof Props>(tag: string, props: Partial<Props>, children?: Children) => {
    const el = document.createElement(tag)
    const x = [...Object.entries(props)] as [K, Props[K]][]
    x.forEach(([_key, _value]) => {
        const key = _key
        const value = _value
        if (key === 'className') {
            if (isGetter<string>(value)) {
                value.__with_effect((newV) => {
                    el.className = newV
                })
                el.className = value()
                return
            }
            el.className = value as string
            return
        }
        if (key === 'onClick') {
            el.addEventListener('click', value as any)
        }
    })

    return el
}

const ifh = <T>(val: T | Getter<T>, a: Child, b: Child): IfEl => { }

const looph = (): LoopEl => { }

type Callback<T> = (newV: T) => void
const createSignal = <T>(v: T) => {
    const id = ID()
    let insideV = v
    const effects: Callback<T>[] = []
    const getter: Getter<T> = () => {

        return insideV
    }
    getter.__is_getter = true
    getter.__with_effect = (fn: Callback<T>) => {
        effects.push(fn)
        return () => effects.splice(effects.findIndex(f => f === fn), 1)
    }
    const setter = (newV: T | ((v: T) => T)) => {
        let val
        if (typeof newV === 'function') {
            val = (newV as any)(insideV)
        }
        else val = newV
        effects.forEach(fn => {
            fn(val)
        })

    }
    return [getter, setter] as const
}
const computed = <T>(cop: () => T): Getter<T> => { }




const Test = () => {
    const [count, setCount] = createSignal(0)
    const body = h("div", {}, [
        h("div", {}, [
            "hhh",
            count,
            ifh(computed(() => count() === 0),
                h("div", {}, "Yes"),
                h("div", {}, "No"))
        ]),
        h("button", {
            onClick: () => {
                setCount(c => c + 1)
            }
        })
    ])
    return body
    // const [items] = createSignal(["hi", "hello", "bye"])
    // const wrapper = h("div", { className: "" }, items.map((v) => {
    //     return h("button", {
    //         onclick: () => {
    //             console.log(v)
    //         }
    //     })
    // }))
}