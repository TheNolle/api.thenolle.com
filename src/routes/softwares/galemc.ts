import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.github.com/repos/GaleMC/Gale/releases'
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

/**
 * @swagger
 * /softwares/galemc/versions:
 *   get:
 *     summary: Retrieve a list of all GaleMC versions available for download.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: A list of GaleMC versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["v0.6.10", "v0.6.9", "v0.5.1"]
 *       500:
 *         description: Server error retrieving GaleMC versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to get versions.
 */
router.get('/versions', async (request: express.Request, response: express.Response) => {
    try {
        const versions = await scrapeVersions()
        response.json([...versions.keys()])
    } catch (error: any) {
        console.error(`Error getting LeavesMC versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to get versions' })
    }
})

/**
 * @swagger
 * /softwares/galemc/download/{version}:
 *   get:
 *     summary: Redirect to the download URL for the specified GaleMC version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: version
 *         description: The version of GaleMC to download. Defaults to the latest version if not specified.
 *         required: false
 *         schema:
 *           type: string
 *           example: v0.6.10
 *     responses:
 *       302:
 *         description: Redirects to the download URL for the specified GaleMC version.
 *       404:
 *         description: The specified version is invalid or not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Invalid version.
 *       500:
 *         description: Server error during redirect to GaleMC download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to redirect to GaleMC download.
 */
router.get('/download/:version?', async (request: express.Request, response: express.Response) => {
    let version: string = String(request.params.version || '').trim().toLowerCase()
    try {
        const versions = await scrapeVersions()
        if (!version) version = [...versions.keys()][0]
        if (!version.startsWith('v')) version = `v${version}`
        if (!versions.has(version)) return response.status(404).json({ error: 'Invalid version' })
        const downloadURL: string = versions.get(version) as string
        response.redirect(downloadURL)
    } catch (error: any) {
        console.error(`Error redirecting to Forge download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to Forge download' })
    }
})

export default router