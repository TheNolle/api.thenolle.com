import express from 'express'

const router = express.Router()
const baseUrl = 'https://mediafilez.forgecdn.net/files'

router.get('/versions', async (request: express.Request, response: express.Response) => {
    try {
        response.json([
            "1.0.4-66",
            "1.0.3-45",
            "1.0.3-44",
            "1.0.2-33",
            "1.0.1",
            "1.0.0-SNAPSHOT"
        ])
    } catch (error: any) {
        console.error(`Error fetching Rift versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch supported Minecraft versions' })
    }
})

router.get('/download/:riftVersion?', async (request, response) => {
    try {
        const riftVersion = String(request.params.riftVersion || '1.0.4-66').trim()
        if (!riftVersion) return response.status(400).json({ error: 'Missing Rift version' })
        let riftUrl = null
        switch (riftVersion) {
            case '1.0.4-66':
                riftUrl = `${baseUrl}/2610/741/Rift-1.0.4-66.jar`
                break
            case '1.0.3-45':
                riftUrl = `${baseUrl}/2602/796/Rift-1.0.3-45.jar`
                break
            case '1.0.3-44':
                riftUrl = `${baseUrl}/2602/533/Rift-1.0.3-44.jar`
                break
            case '1.0.2-33':
                riftUrl = `${baseUrl}/2598/229/Rift-1.0.2-33.jar`
                break
            case '1.0.1':
                riftUrl = `${baseUrl}/2589/428/Rift-1.0.1.jar`
                break
            case '1.0.0-SNAPSHOT':
                riftUrl = `${baseUrl}/2579/932/Rift-1.0.0-SNAPSHOT.jar`
                break
            default:
                return response.status(400).json({ error: 'Invalid Rift version' })
        }
        response.redirect(riftUrl)
    } catch (error: any) {
        console.error(`Error redirecting to Forge download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to Forge download' })
    }
})

export default router