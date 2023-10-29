import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.purpurmc.org/v2/purpur'

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
        console.error(`Error fetching PurpurMC versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch PurpurMC versions' })
    }
})

router.get('/versions/:minecraftVersion', async (request: express.Request, response: express.Response) => {
    const minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
    try {
        const res = await axios.get(`${baseUrl}/${minecraftVersion}`)
        const versions = res.data.builds.all
        const sortedVersions = versions.sort((a: number, b: number) => { return b - a })
        response.json(sortedVersions)
    } catch (error: any) {
        console.error(`Error fetching PurpurMC versions for Minecraft ${minecraftVersion} (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch PurpurMC versions' })
    }
})

router.get('/download/:minecraftVersion?/:purpurmcVersion?', async (request: express.Request, response: express.Response) => {
    try {
        let minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
        let purpurmcVersion: string = String(request.params.purpurmcVersion || '').trim()
        if (!minecraftVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/purpurmc/versions/game`)
            minecraftVersion = res.data[0]
        }
        if (!purpurmcVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/purpurmc/versions/${minecraftVersion}`)
            purpurmcVersion = res.data[0]
        }
        const downloadUrl = `${baseUrl}/${minecraftVersion}/${purpurmcVersion}/download`
        response.redirect(downloadUrl)
    } catch (error: any) {
        console.error(`Error redirecting to PurpurMC download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to PurpurMC download' })
    }
})

export default router