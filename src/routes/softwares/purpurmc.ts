import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.purpurmc.org/v2/purpur'

/**
 * @swagger
 * /softwares/purpurmc/versions/game:
 *   get:
 *     summary: Retrieve a list of all Minecraft versions supported by PurpurMC.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: A list of supported Minecraft versions by PurpurMC.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["1.20.2", "1.20.1", "1.20"]
 *       500:
 *         description: Server error retrieving PurpurMC versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch PurpurMC versions.
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
        console.error(`Error fetching PurpurMC versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch PurpurMC versions' })
    }
})

/**
 * @swagger
 * /softwares/purpurmc/versions/{minecraftVersion}:
 *   get:
 *     summary: Retrieve a list of all PurpurMC build numbers for a specific Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: true
 *         description: The specific version of Minecraft for which to retrieve PurpurMC builds.
 *         schema:
 *           type: string
 *           example: "1.20.2"
 *     responses:
 *       200:
 *         description: A list of PurpurMC build numbers for the specified Minecraft version.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 *               example: ["2087", "2086", "2084"]
 *       500:
 *         description: Server error retrieving PurpurMC build numbers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch PurpurMC versions for Minecraft {minecraftVersion}.
 */
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

/**
 * @swagger
 * /softwares/purpurmc/download/{minecraftVersion}/{purpurmcVersion}:
 *   get:
 *     summary: Redirect to the download URL for a specific PurpurMC build of a specified Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: false
 *         description: The specific version of Minecraft. Defaults to the latest version supported by PurpurMC if not specified.
 *         schema:
 *           type: string
 *           example: "1.20.2"
 *       - in: path
 *         name: purpurmcVersion
 *         required: false
 *         description: The specific build number of PurpurMC. Defaults to the latest build for the specified Minecraft version if not specified.
 *         schema:
 *           type: string
 *           example: "263"
 *     responses:
 *       302:
 *         description: Redirects to the download URL for the specified PurpurMC build and Minecraft version.
 *       500:
 *         description: Server error during redirect to PurpurMC download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to redirect to PurpurMC download.
 */
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