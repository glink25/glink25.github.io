import { debounce } from "lodash-es";
import { ref } from "vue";
import { RepoSearchItem, requestSearch } from "@/shared";
import { useCustomConfig } from "./useCustomConfig";


export const useSearch = () => {
    const { apiOption } = useCustomConfig()
    const repo = apiOption.value?.repo ?? ''
    const path = apiOption.value?.path ?? 'posts'
    const language = "markdown"

    const { categories } = useCustomConfig()
    const resultFilter = (result: RepoSearchItem) => !categories.value.map(c => `${c.name}.md`).includes(result.name)
    const resultFormatter = (result: RepoSearchItem) => {
        const relativePath = result.path.split('/').filter(f => f !== 'posts').join("/").replace('.md', '.html')
        return {
            ...result, relativePath
        }
    }

    const results = ref<(RepoSearchItem & { relativePath: string })[]>([])
    const searching = ref(false)
    const search = debounce(async (text: string) => {
        searching.value = true
        if (!text) {
            results.value = []
            searching.value = false
            return []
        }
        const data = await requestSearch(text, { repo, path, language })
        searching.value = false
        results.value = (data.items ?? []).filter(resultFilter).map(resultFormatter)
        return results.value

    }, 500)

    return {
        search,
        searching,
        results
    }
}