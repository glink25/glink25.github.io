import { ViteSSGContext } from "vite-ssg";
import { inject, ref } from "vue";
import { useRoute } from "vue-router";
export const useSSRRouteData = () => {
    const routePathToId = (path: string) => `__SSR_DATA_ROUTE_${path}`

    const route = useRoute()
    const id = routePathToId(route.path)
    const injected = inject(id)
    const data = ref<any>(injected)
    return data
}

export const useSSRGlobalData = () => {
    const injected = inject('__SSR_DATA_GLOBAL')
    return injected
}

export const register = async ({ app, isClient, router }: ViteSSGContext<true>) => {
    console.log(isClient, 'isclient', import.meta.env.SSR, typeof window !== 'undefined' && window.__SSR_DATA_BUILDED)
    const { default: globalData } = await import('__SSR_DATA_GLOBAL')
    app.provide(`__SSR_DATA_GLOBAL`, globalData)
    // if (import.meta.env.PROD) {
    //     return globalData
    // }
    // if (isClient) {
    //   return
    // }
    const { loadPage } = await import('__SSR_DATA_DEV_LOADER')
    router.beforeEach(async (to) => {
        const route = to.path
        try {
            const { default: data } = await loadPage(route)
            app.provide(`__SSR_DATA_ROUTE_${route}`, data)
        } catch (error) {
            console.error(error, 'register error')
        }
    })
    return globalData
}