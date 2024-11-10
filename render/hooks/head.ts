import config from '@/urodele.config'
import { useHead } from '@unhead/vue'
import { usePage } from './page'

export const useSEOHead = () => {
    const page = usePage()
    useHead({
        title: [config.head?.title, page.value?.title].join("|"),
        meta: [
            {
                name: 'description',
                content: page.value?.intro.slice(0, 50),
            },
            {
                name: 'keywords',
                content: page.value?.tags.join(','),
            },
        ],
    })
}