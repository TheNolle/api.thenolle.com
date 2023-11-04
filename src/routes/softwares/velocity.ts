import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.papermc.io/v2/projects/velocity'

/**
 * @swagger
 * /softwares/velocity/versions/game:
 *   get:
 *     summary: Retrieve a list of all Velocity versions available.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: A list of Velocity versions, sorted from newest to oldest.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *             example: ["3.2.0-SNAPSHOT", "3.1.2-SNAPSHOT", "3.1.1"]
 *       500:
 *         description: Server error retrieving Velocity versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch Velocity versions.
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
        console.error(`Error fetching Velocity versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Velocity versions' })
    }
})

/**
 * @swagger
 * /softwares/velocity/versions/{minecraftVersion}:
 *   get:
 *     summary: Retrieve a list of Velocity builds available for a specific Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: true
 *         schema:
 *           type: string
 *           example: "3.2.0-SNAPSHOT"
 *     responses:
 *       200:
 *         description: A list of build numbers for the specified Minecraft version.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *             example: [294, 293, 292]
 *       500:
 *         description: Server error retrieving Velocity builds for the specified Minecraft version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch Velocity versions.
 */
router.get('/versions/:minecraftVersion', async (request: express.Request, response: express.Response) => {
    const minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
    try {
        const res = await axios.get(`${baseUrl}/versions/${minecraftVersion}`)
        const versions = res.data.builds
        const sortedVersions = versions.sort((a: number, b: number) => { return b - a })
        response.json(sortedVersions)
    } catch (error: any) {
        console.error(`Error fetching Velocity versions for Minecraft ${minecraftVersion} (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Velocity versions' })
    }
})

/**
 * @swagger
 * /softwares/velocity/download/{minecraftVersion}/{velocityVersion}:
 *   get:
 *     summary: Redirect to the download URL for the specified Velocity version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: false
 *         schema:
 *           type: string
 *           example: "3.2.0-SNAPSHOT"
 *       - in: path
 *         name: velocityVersion
 *         required: false
 *         schema:
 *           type: string
 *           example: "294"
 *     responses:
 *       302:
 *         description: Redirects to the download URL for the specified Velocity version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                   description: The URL to which the client will be redirected.
 *                   example: "https://api.papermc.io/v2/projects/velocity/versions/3.2.0-SNAPSHOT/builds/294/downloads/velocity-3.2.0-SNAPSHOT-294.jar"
 *       500:
 *         description: Server error during redirect to Velocity download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to redirect to Velocity download.
 */
router.get('/download/:minecraftVersion?/:velocityVersion?', async (request: express.Request, response: express.Response) => {
    try {
        let minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
        let velocityVersion: string = String(request.params.velocityVersion || '').trim()
        if (!minecraftVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/velocity/versions/game`)
            minecraftVersion = res.data[0]
        }
        if (!velocityVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/velocity/versions/${minecraftVersion}`)
            velocityVersion = res.data[0]
        }
        const downloadUrl = `${baseUrl}/versions/${minecraftVersion}/builds/${velocityVersion}/downloads/velocity-${minecraftVersion}-${velocityVersion}.jar`
        response.redirect(downloadUrl)
    } catch (error: any) {
        console.error(`Error redirecting to Velocity download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to Velocity download' })
    }
})

export default router