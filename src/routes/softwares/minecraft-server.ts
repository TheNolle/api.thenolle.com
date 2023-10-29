import express from 'express'
import axios from 'axios'
import { JSDOM } from 'jsdom'

const router = express.Router()
const BASE_URL = 'https://getbukkit.org/download/vanilla'
const CACHE_DURATION = 3600000

interface Cache {
    versions: string[] | null,
    downloadLinks: Map<string, string>,
    lastUpdated: number
}

let cache: Cache = {
    versions: null,
    downloadLinks: new Map(),
    lastUpdated: 0
}

const fetchPage = async (url: string): Promise<JSDOM> => {
    return new JSDOM((await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36' } })).data)
}

const scrapeAvailableVersions = async (): Promise<string[]> => {
    if (cache.versions && Date.now() - cache.lastUpdated < CACHE_DURATION) return cache.versions
    try {
        const dom = await fetchPage(BASE_URL)
        cache.versions = [...dom.window.document.querySelectorAll('#download > div > div > div > div > div > div > h2')].map(btn => btn.textContent?.trim() || '')
        cache.lastUpdated = Date.now()
        return cache.versions
    } catch (error) {
        console.error('Error scraping available versions:', error)
        throw error
    }
}

const scrapeDownloadLink = async (minecraftVersion: string): Promise<string> => {
    if (cache.downloadLinks.has(minecraftVersion) && Date.now() - cache.lastUpdated < CACHE_DURATION) return cache.downloadLinks.get(minecraftVersion) as string
    try {
        const dom = await fetchPage(BASE_URL)
        const versionDiv = [...dom.window.document.querySelectorAll('#download > div > div > div > div > div > div > h2')].find(div => div.textContent?.trim() === minecraftVersion)
        if (!versionDiv) throw new Error(`Version ${minecraftVersion} not found.`)
        const downloadBtn = (versionDiv.parentElement?.parentElement?.querySelector('a.btn-download') as HTMLAnchorElement)
        if (!downloadBtn || !downloadBtn.href) throw new Error(`Download link for version ${minecraftVersion} not found.`)
        const link = downloadBtn.href.trim()
        try {
            const dom = await fetchPage(link)
            const downloadLink = (dom.window.document.querySelector('#get-download > div > div > div:nth-child(2) > div > h2 > a') as HTMLAnchorElement).href
            cache.downloadLinks.set(minecraftVersion, downloadLink)
            cache.lastUpdated = Date.now()
            return downloadLink
        } catch (error) {
            console.error(`Error caching download link for version ${minecraftVersion}:`, error)
            throw error
        }
    } catch (error) {
        console.error(`Error scraping download link for version ${minecraftVersion}:`, error)
        throw error
    }
}

router.get('/versions/game', async (request: express.Request, response: express.Response) => {
    try {
        response.json(await scrapeAvailableVersions())
    } catch {
        response.status(500).json({ error: 'Failed to fetch Minecraft Server versions' })
    }
})

router.get('/download/:minecraftVersion?', async (request: express.Request, response: express.Response) => {
    let minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
    try {
        if (!minecraftVersion) {
            const versions = await scrapeAvailableVersions()
            minecraftVersion = versions[0]
        }
        response.redirect(await scrapeDownloadLink(minecraftVersion))
    } catch {
        response.status(500).json({ error: 'Failed to fetch Minecraft Server download link' })
    }
})

export default router