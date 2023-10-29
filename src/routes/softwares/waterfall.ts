import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.papermc.io/v2/projects/waterfall'

router.get('/versions/game', async (request: express.Request, response: express.Response) => {
    try {
        const res = await axios.get(`${baseUrl}`)
        const versions = res.data.versions
        const sortedVersions = versions.sort((a: any, b: any) => {
            const partsA: number[] = a.split('.').map((part: any) => parseInt(part, 10))
            const partsB: number[] = b.split('.').map((part: any) => parseInt(part, 10))
            for (let i: number = 0; i < Math.max(partsA.length, partsB.length); i++) {
                const partA: number = partsA[i] || 0
                const partB: number = partsB[i] || 0
                if (partA > partB) return -1
                else if (partA < partB) return 1
            }
            return 0
        })
        response.json(sortedVersions)
    } catch (error: any) {
        console.error(`Error fetching Waterfall versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Waterfall versions' })
    }
})

router.get('/versions/:minecraftVersion', async (request: express.Request, response: express.Response) => {
    const minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
    try {
        const res = await axios.get(`${baseUrl}/versions/${minecraftVersion}`)
        const versions = res.data.builds
        const sortedVersions = versions.sort((a: number, b: number) => { return b - a })
        response.json(sortedVersions)
    } catch (error: any) {
        console.error(`Error fetching Waterfall versions for Minecraft ${minecraftVersion} (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Waterfall versions' })
    }
})

router.get('/download/:minecraftVersion?/:waterfallVersion?', async (request: express.Request, response: express.Response) => {
    try {
        let minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
        let waterfallVersion: string = String(request.params.waterfallVersion || '').trim()
        if (!minecraftVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/waterfall/versions/game`)
            minecraftVersion = res.data[0]
        }
        if (!waterfallVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/waterfall/versions/${minecraftVersion}`)
            waterfallVersion = res.data[0]
        }
        const downloadUrl = `${baseUrl}/versions/${minecraftVersion}/builds/${waterfallVersion}/downloads/waterfall-${minecraftVersion}-${waterfallVersion}.jar`
        response.redirect(downloadUrl)
    } catch (error: any) {
        console.error(`Error redirecting to Waterfall download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to Waterfall download' })
    }
})

export default router