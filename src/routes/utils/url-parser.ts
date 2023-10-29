import express from 'express'
import url from 'url'

const router = express.Router()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const targetUrl: string = String(request.body.targetUrl || '').trim()
        if (targetUrl.includes('..')) return response.status(400).json({ error: 'Invalid input' })
        if (!targetUrl) return response.status(400).json({ error: 'Target URL is required' })
        const parsedUrl = url.parse(targetUrl, true)
        response.json({ protocol: parsedUrl.protocol, hostname: parsedUrl.hostname, port: parsedUrl.port, pathname: parsedUrl.pathname, query: parsedUrl.query, hash: parsedUrl.hash })
    } catch (error: any) {
        console.error(`Error parsing URL (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to parse URL' })
    }
})

export default router