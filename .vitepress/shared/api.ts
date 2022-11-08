const SEARCH_API = "https://api.github.com/search/code"

export type RepoSearchItem = { path: string, name: string, score: number }

export type RepoSearchResult = { items: RepoSearchItem[] }

export const requestSearch = async (text: string, { repo, path, language }: { repo: string, path: string, language: string }) => {
    const params = [text, ...Object.entries({
        repo, path, language
    }).map(([k, v]) => `${k}:${v}`)].join(' ')
    const url = `${SEARCH_API}?q=${encodeURIComponent(params)}`;
    const data = await (await fetch(url)).json()
    return data as RepoSearchResult;
}

// const GRAPH_API='https://sourcegraph.com/.api/graphql'
const CONTENT_API = 'https://api.github.com/repos'

type RepoContentResult = {}

export const requestContent = async ({ owner, repo, path }: { owner: string, repo: string, path: string }) => {
    const url = `${CONTENT_API}/${owner}/${repo}/contents/${path}`
    const data = await (await fetch(url)).json()
    return data as RepoContentResult
}
