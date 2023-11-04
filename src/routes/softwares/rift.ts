import express from 'express'

const router = express.Router()
const baseUrl = 'https://mediafilez.forgecdn.net/files'

/**
 * @swagger
 * /softwares/rift/versions:
 *   get:
 *     summary: Retrieve a list of all Rift mod loader versions available for download.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: A list of Rift mod loader versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["1.0.4-66", "1.0.3-45", "1.0.3-44", "1.0.2-33", "1.0.1", "1.0.0-SNAPSHOT"]
 *       500:
 *         description: Server error retrieving Rift versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch supported Minecraft versions.
 */
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
        response.status(500).json({ error: 'Failed to fetch Rift versions' })
    }
})

/**
 * @swagger
 * /softwares/rift/download/{riftVersion}:
 *   get:
 *     summary: Redirect to the download URL for the specified Rift mod loader version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: riftVersion
 *         description: The version of Rift to download. Defaults to the latest version if not specified.
 *         required: false
 *         schema:
 *           type: string
 *           example: "1.0.4-66"
 *     responses:
 *       302:
 *         description: Redirects to the download URL for the specified Rift mod loader version.
 *       400:
 *         description: Bad request due to missing or invalid Rift version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Missing Rift version
 *       500:
 *         description: Server error during redirect to Rift download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to redirect to Rift download.
 */
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
        console.error(`Error redirecting to Rift download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to Rift download' })
    }
})

export default router