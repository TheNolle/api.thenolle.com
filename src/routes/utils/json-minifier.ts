import express from 'express'

const router = express.Router()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'Missing request body' })
        const jsonString: string = String(request.body.jsonString || '').trim()
        if (!jsonString) return response.status(400).json({ error: 'JSON string is required' })
        try {
            const minifiedJSON = JSON.stringify(JSON.parse(jsonString))
            response.json({ minifiedJSON })
        } catch (error: any) {
            console.error(`Invalid JSON string (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
            response.status(400).json({ error: 'Invalid JSON string' })
        }
    } catch (error: any) {
        console.error(`Error minifying JSON (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to minify JSON' })
    }
})

export default router