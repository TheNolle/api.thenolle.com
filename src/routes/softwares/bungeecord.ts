import express from 'express'
import axios from 'axios'
import xml2js from 'xml2js'

const router = express.Router()
const baseUrl = 'https://ci.md-5.net/job/BungeeCord'

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