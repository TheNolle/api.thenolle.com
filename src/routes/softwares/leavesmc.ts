import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.github.com/repos/LeavesMC/Leaves/releases'
const CACHE_DURATION = 1 * 60 * 60 * 1000 // 1 * 60 * 60 * 1000 = 3,600,000 milliseconds = 1 hour

interface Cache {
    versions: Map<string, string>,
    lastUpdated: number
}

let cache: Cache = {
    versions: new Map(),
    lastUpdated: 0
}

const fetchReleases = async (url: string): Promise<any[]> => {
    return (await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })).data
}

const scrapeVersions = async (): Promise<Map<string, string>> => {
    if (Date.now() - cache.lastUpdated < CACHE_DURATION) return cache.versions
    try {
        const releases = await fetchReleases(baseUrl)
        const versions = new Map<string, string>()
        releases.forEach((release: any) => {
            const version = release.tag_name
            const jarAsset = release.assets.find((asset: any) => asset.name.endsWith('.jar'))
            if (jarAsset && jarAsset.browser_download_url) versions.set(version, jarAsset.browser_download_url)
        })
        cache.versions = versions
        cache.lastUpdated = Date.now()
        return versions
    } catch (error) {
        console.error('Error scraping versions:', error)
        throw error
    }
}

router.get('/versions', async (request: express.Request, response: express.Response) => {
    try {
        const versions = await scrapeVersions()
        response.json([...versions.keys()])
    } catch (error: any) {
        console.error(`Error getting LeavesMC versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to get versions' })
    }
})

router.get('/download/:version?', async (request: express.Request, response: express.Response) => {
    let version: string = String(request.params.version || '').trim().toLowerCase()
    try {
        const versions = await scrapeVersions()
        if (!version) version = [...versions.keys()][0]
        if (!versions.has(version)) return response.status(404).json({ error: 'Invalid version' })
        const downloadURL: string = versions.get(version) as string
        response.redirect(downloadURL)
    } catch (error: any) {
        console.error(`Error redirecting to Forge download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to Forge download' })
    }
})

export default router