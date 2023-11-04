import express from 'express'
import axios from 'axios'
import xml2js from 'xml2js'

const router = express.Router()
const baseUrl = 'https://files.minecraftforge.net/maven/net/minecraftforge/forge'

/**
 * @swagger
 * /softwares/forge/versions/game:
 *   get:
 *     summary: Retrieve a list of Minecraft versions supported by Forge.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: A list of supported Minecraft versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["1.20.2", "1.20.1", "1.20"]
 *       500:
 *         description: Server error retrieving Minecraft versions.
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
router.get('/versions/game', async (request: express.Request, response: express.Response) => {
    try {
        const res = await axios.get(`${baseUrl}/maven-metadata.xml`)
        const parsed = await xml2js.parseStringPromise(res.data)
        const allVersions = parsed.metadata.versioning[0].versions[0].version
        const mcVersions = Array.from(new Set(allVersions.map((v: string) => v.split('-')[0])))
        const sortedVersions = mcVersions.sort((a: any, b: any) => {
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
        console.error(`Error fetching Minecraft versions supported by Forge (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch supported Minecraft versions' })
    }
})

/**
 * @swagger
 * /softwares/forge/versions/{minecraftVersion}:
 *   get:
 *     summary: Retrieve a list of Forge versions for a specific Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         required: true
 *         schema:
 *           type: string
 *         description: The Minecraft version to retrieve Forge versions for.
 *     responses:
 *       200:
 *         description: A list of Forge versions for the specified Minecraft version.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["48.0.34", "48.0.33", "48.0.32"]
 *       400:
 *         description: Bad request when Minecraft version is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Missing Minecraft version.
 *       500:
 *         description: Server error retrieving Forge versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch Forge versions.
 */
router.get('/versions/:minecraftVersion', async (request, response) => {
    const minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
    try {
        if (!minecraftVersion) return response.status(400).json({ error: 'Missing Minecraft version' })
        const res = await axios.get(`${baseUrl}/maven-metadata.xml`)
        const parsed = await xml2js.parseStringPromise(res.data)
        const allVersions = parsed.metadata.versioning[0].versions[0].version
        const forgeVersions = allVersions.filter((v: string) => v.startsWith(minecraftVersion)).map((v: string) => v.split('-').slice(-1)[0])
        response.json(forgeVersions)
    } catch (error: any) {
        console.error(`Error fetching Forge versions for Minecraft ${minecraftVersion} (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Forge versions' })
    }
})

/**
 * @swagger
 * /softwares/forge/download/{minecraftVersion}/{forgeVersion}:
 *   get:
 *     summary: Redirects to the download URL for the specified Minecraft version and Forge version of the Forge installer.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         schema:
 *           type: string
 *         required: false
 *         description: The Minecraft version. Defaults to the latest version if not specified.
 *         example: "1.20.2"
 *       - in: path
 *         name: forgeVersion
 *         schema:
 *           type: string
 *         required: false
 *         description: The Forge version. Defaults to the latest version for the specified Minecraft version if not specified.
 *         example: "48.0.34"
 *     responses:
 *       200:
 *         description: Redirect to the Forge installer download.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: uri
 *               description: The download URL for the Forge installer.
 *               example: https://files.minecraftforge.net/maven/net/minecraftforge/forge/1.20.2-48.0.34/forge-1.20.2-48.0.34-installer.jar
 *       500:
 *         description: Failed to redirect to download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to redirect to Forge download.
 */
router.get('/download/:minecraftVersion?/:forgeVersion?', async (request, response) => {
    try {
        let minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
        let forgeVersion: string = String(request.params.forgeVersion || '').trim()
        if (!minecraftVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/forge/versions/game`)
            minecraftVersion = res.data[0]
        }
        if (!forgeVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/forge/versions/${minecraftVersion}`)
            forgeVersion = res.data[0]
        }
        const downloadUrl = `${baseUrl}/${minecraftVersion}-${forgeVersion}/forge-${minecraftVersion}-${forgeVersion}-installer.jar`
        response.redirect(downloadUrl)
    } catch (error: any) {
        console.error(`Error redirecting to Forge download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to Forge download' })
    }
})

export default router