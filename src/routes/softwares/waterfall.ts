import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.papermc.io/v2/projects/waterfall'

/**
 * @swagger
 * /softwares/waterfall/versions/game:
 *   get:
 *     summary: Retrieve a list of all Waterfall versions available.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: A list of Waterfall versions, sorted from newest to oldest.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example: ["1.20", "1.19", "1.18"]
 *       500:
 *         description: Server error retrieving Waterfall versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch Waterfall versions.
 */
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

/**
 * @swagger
 * /softwares/waterfall/versions/{minecraftVersion}:
 *   get:
 *     summary: Retrieve a list of Waterfall builds available for a specific Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: true
 *         schema:
 *           type: string
 *           example: "1.20"
 *     responses:
 *       200:
 *         description: A list of build numbers for the specified Minecraft version.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *             example: [551, 550, 549]
 *       500:
 *         description: Server error retrieving Waterfall builds for the specified Minecraft version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch Waterfall versions.
 */
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

/**
 * @swagger
 * /softwares/waterfall/download/{minecraftVersion}/{waterfallVersion}:
 *   get:
 *     summary: Redirect to the download URL for the specified Waterfall version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: false
 *         schema:
 *           type: string
 *           example: "1.20"
 *       - in: path
 *         name: waterfallVersion
 *         required: false
 *         schema:
 *           type: string
 *           example: "551"
 *     responses:
 *       302:
 *         description: Redirects to the download URL for the specified Waterfall version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                   description: The URL to which the client will be redirected.
 *                   example: "https://api.papermc.io/v2/projects/waterfall/versions/1.20/builds/551/downloads/waterfall-1.20-551.jar"
 *       500:
 *         description: Server error during redirect to Waterfall download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to redirect to Waterfall download.
 */
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