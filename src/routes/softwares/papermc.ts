import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://api.papermc.io/v2/projects/paper'

/**
 * @swagger
 * /softwares/papermc/versions/game:
 *   get:
 *     summary: Retrieve a list of all Minecraft versions supported by PaperMC.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: A list of supported Minecraft versions by PaperMC.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["1.20.2", "1.20.1", "1.20"]
 *       500:
 *         description: Server error retrieving PaperMC versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch PaperMC versions.
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
        console.error(`Error fetching PaperMC versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch PaperMC versions' })
    }
})

/**
 * @swagger
 * /softwares/papermc/versions/{minecraftVersion}:
 *   get:
 *     summary: Retrieve a list of all PaperMC build numbers for a specific Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: true
 *         description: The specific version of Minecraft for which to retrieve PaperMC builds.
 *         schema:
 *           type: string
 *           example: "1.20.2"
 *     responses:
 *       200:
 *         description: A list of PaperMC build numbers for the specified Minecraft version.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 *               example: [263, 262, 261]
 *       500:
 *         description: Server error retrieving PaperMC build numbers.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch PaperMC versions for Minecraft {minecraftVersion}.
 */
router.get('/versions/:minecraftVersion', async (request: express.Request, response: express.Response) => {
    const minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
    try {
        const res = await axios.get(`${baseUrl}/versions/${minecraftVersion}`)
        const versions = res.data.builds
        const sortedVersions = versions.sort((a: number, b: number) => { return b - a })
        response.json(sortedVersions)
    } catch (error: any) {
        console.error(`Error fetching PaperMC versions for Minecraft ${minecraftVersion} (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch PaperMC versions' })
    }
})

/**
 * @swagger
 * /softwares/papermc/download/{minecraftVersion}/{papermcVersion}:
 *   get:
 *     summary: Redirect to the download URL for a specific PaperMC build of a specified Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: false
 *         description: The specific version of Minecraft. Defaults to the latest version supported by PaperMC if not specified.
 *         schema:
 *           type: string
 *           example: "1.20.2"
 *       - in: path
 *         name: papermcVersion
 *         required: false
 *         description: The specific build number of PaperMC. Defaults to the latest build for the specified Minecraft version if not specified.
 *         schema:
 *           type: string
 *           example: "263"
 *     responses:
 *       302:
 *         description: Redirects to the download URL for the specified PaperMC build and Minecraft version.
 *       500:
 *         description: Server error during redirect to PaperMC download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to redirect to PaperMC download.
 */
router.get('/download/:minecraftVersion?/:papermcVersion?', async (request: express.Request, response: express.Response) => {
    try {
        let minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
        let papermcVersion: string = String(request.params.papermcVersion || '').trim()
        if (!minecraftVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/papermc/versions/game`)
            minecraftVersion = res.data[0]
        }
        if (!papermcVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/papermc/versions/${minecraftVersion}`)
            papermcVersion = res.data[0]
        }
        const downloadUrl = `${baseUrl}/versions/${minecraftVersion}/builds/${papermcVersion}/downloads/paper-${minecraftVersion}-${papermcVersion}.jar`
        response.redirect(downloadUrl)
    } catch (error: any) {
        console.error(`Error redirecting to PaperMC download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to PaperMC download' })
    }
})

export default router