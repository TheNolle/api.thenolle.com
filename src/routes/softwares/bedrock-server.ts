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

/**
 * @swagger
 * /softwares/bedrock-server/versions/os:
 *   get:
 *     summary: Returns a list of available operating systems for Bedrock server versions.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: An array of operating systems.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: Operating system identifier.
 *                 example: ["win", "win-preview", "linux", "linux-preview"]
 *       500:
 *         description: Error fetching Bedrock versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to fetch Bedrock versions
 */
router.get('/versions/os', async (request: express.Request, response: express.Response) => {
    try {
        const versions = await scrapeVersions()
        response.json([...versions.keys()])
    } catch (error: any) {
        console.error(`Error fetching Bedrock versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Bedrock versions' })
    }
})

/**
 * @swagger
 * /softwares/bedrock-server/download/{os}:
 *   get:
 *     summary: Redirects to the download link for the Bedrock server for a specific OS.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: os
 *         schema:
 *           type: string
 *         required: false
 *         description: The operating system for which to get the download link. Defaults to Windows if not specified.
 *         example: win
 *     responses:
 *       200:
 *         description: Redirect to the download link.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: uri
 *               description: The download link for the Bedrock server.
 *               example: https://minecraft.azureedge.net/bin-win/bedrock-server-1.20.40.01.zip
 *       404:
 *         description: Invalid OS specified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Invalid OS
 *       500:
 *         description: Error fetching Bedrock download link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to fetch Bedrock download link
 */
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