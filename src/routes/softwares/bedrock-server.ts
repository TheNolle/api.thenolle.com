import express from 'express'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const router = express.Router()
const BASE_URL = 'https://bedrock.dev'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 * 60 * 60 * 1000 = 3,600,000 milliseconds = 1 hour

interface Cache {
    versions: Map<string, string>,
    lastUpdated: number
}

let cache: Cache = {
    versions: new Map(),
    lastUpdated: 0
}

const fetchPage = async (url: string): Promise<JSDOM> => {
    return new JSDOM((await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).data)
}

const formatVersion = (version: string): string => {
    const parts = version.split('.')
    parts[parts.length - 1] = parts[parts.length - 1].padStart(2, '0')
    return parts.join('.')
}

const scrapeVersions = async (): Promise<Map<string, string>> => {
    if (Date.now() - cache.lastUpdated < CACHE_DURATION) return cache.versions
    try {
        const dom = await fetchPage(BASE_URL)
        const versions = new Map<string, string>()
        for (const option of dom.window.document.querySelectorAll('#tag option') as NodeListOf<HTMLOptionElement>) {
            const versionText = option.textContent?.split(' ')[0]
            if (versionText) {
                const formattedVersion = formatVersion(versionText)
                if (option.value === 'stable') {
                    versions.set('win', formattedVersion)
                    versions.set('linux', formattedVersion)
                } else if (option.value === 'beta') {
                    versions.set('win-preview', formattedVersion)
                    versions.set('linux-preview', formattedVersion)
                }
            }
        }
        cache.versions = versions
        cache.lastUpdated = Date.now()
        return versions
    } catch (error) {
        console.error("Error scraping versions:", error)
        throw error
    }
}

router.get('/versions/os', async (request: express.Request, response: express.Response) => {
    try {
        const versions = await scrapeVersions()
        response.json([...versions.keys()])
    } catch (error: any) {
        console.error(`Error fetching Bedrock versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Bedrock versions' })
    }
})

router.get('/download/:os?', async (request: express.Request, response: express.Response) => {
    try {
        let os: string = String(request.params.os || '').trim().toLowerCase().replace(' ', '-').replace('windows', 'win')
        if (!os) os = 'win'
        const versions = await scrapeVersions()
        const version = versions.get(os)
        if (!version) return response.status(404).json({ error: 'Invalid OS' })
        const downloadLink = `https://minecraft.azureedge.net/bin-${os}/bedrock-server-${version}.zip`
        response.redirect(downloadLink)
    } catch (error: any) {
        console.error(`Error fetching Bedrock download link (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Bedrock download link' })
    }
})

export default router