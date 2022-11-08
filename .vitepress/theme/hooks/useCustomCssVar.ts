import { onMounted, Ref, watch } from "vue";

export const useCssVar = (ref: Ref<string>, el: Ref<HTMLElement | undefined>, name: string) => {
    const update = () => {
        if (el.value) {
            el.value.style.setProperty(name, ref.value)
        }
    }
    onMounted(() => {
        update()
        watch(ref, () => {
            console.log('hi')
            update()
        })
    })
}