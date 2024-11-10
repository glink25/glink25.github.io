import { inject, ref } from "vue";
import { useRoute } from "vue-router";
export const useSSRRouteData = () => {
    const routePathToId = (path: string) => `__SSR_DATA_ROUTE_${path}`

    const route = useRoute()
    const id = routePathToId(route.path)
    const injected = inject(id)
    const data = ref<any>(injected)
    console.log(data, 'dataheree', id)
    return data
}