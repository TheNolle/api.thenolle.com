import express from 'express'
import axios from 'axios'
import xml2js from 'xml2js'

const router = express.Router()
const baseUrl = 'https://ci.md-5.net/job/BungeeCord'

/**
 * @swagger
 * /softwares/bungeecord/versions/game:
 *   get:
 *     summary: Returns a list of available game versions for BungeeCord.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: An array of BungeeCord build versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: A BungeeCord build version.
 *                 example: "#1765"
 *       500:
 *         description: Error fetching BungeeCord versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to fetch BungeeCord versions
 */
router.get('/versions/game', async (request: express.Request, response: express.Response) => {
    try {
        const res = await axios.get(`${baseUrl}/rssAll`)
        const parsed = await xml2js.parseStringPromise(res.data)
        const allBuilds = parsed.feed.entry.map((entry: any) => entry.title[0].split(' ')[1])
        response.json(allBuilds)
    } catch (error: any) {
        console.error(`Error fetching BungeeCord versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch BungeeCord versions' })
    }
})

/**
 * @swagger
 * /softwares/bungeecord/download/{bungeeVersion}:
 *   get:
 *     summary: Redirects to the download link for a specific BungeeCord version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: bungeeVersion
 *         schema:
 *           type: string
 *         required: false
 *         description: The specific version of BungeeCord to download. If not specified, the latest version is used.
 *         example: "#1765"
 *     responses:
 *       200:
 *         description: Redirect to the BungeeCord.jar download link for the specified version.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: uri
 *               description: The download link for the BungeeCord.jar file.
 *               example: https://ci.md-5.net/job/BungeeCord/1765/artifact/bootstrap/target/BungeeCord.jar
 *       500:
 *         description: Error redirecting to BungeeCord download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to redirect to BungeeCord download
 */
router.get('/download/:bungeeVersion?', async (request: express.Request, response: express.Response) => {
    try {
        let bungeeVersion: string = String(request.params.bungeeVersion || '').trim()
        if (!bungeeVersion) {
            const res = await axios.get(`http://localhost:25000/softwares/bungeecord/versions/game`)
            bungeeVersion = res.data[0]
        }
        const downloadUrl = `${baseUrl}/${bungeeVersion.replace('#', '')}/artifact/bootstrap/target/BungeeCord.jar`
        response.redirect(downloadUrl)
    } catch (error: any) {
        console.error(`Error redirecting to BungeeCord download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to BungeeCord download' })
    }
})

export default router