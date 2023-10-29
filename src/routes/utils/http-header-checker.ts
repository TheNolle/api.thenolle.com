import express from 'express'
import axios from 'axios'

const router = express.Router()

router.post('/', async (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'Missing request body' })
        const targetUrl: string = String(request.body.targetUrl || '').trim()
        if (targetUrl.includes('..') || !targetUrl.startsWith('http')) return response.status(400).json({ error: 'Invalid URL input' })
        if (!targetUrl) return response.status(400).json({ error: 'Target URL is required' })
        const headersResponse = await axios.head(targetUrl, { validateStatus: (status) => status < 500 })
        response.json(headersResponse.headers)
    } catch (error: any) {
        console.error(`Error fetching HTTP headers (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch HTTP headers' })
    }
})

export default router