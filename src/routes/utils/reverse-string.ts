import express from 'express'

const router = express.Router()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const text: string = String(request.body.text).trim()
        if (!text) return response.status(400).json({ error: 'Text is required' })
        const reversedText = text.split('').reverse().join('')
        response.json({ original: text, reversed: reversedText })
    } catch (error: any) {
        console.error(`Error reversing string (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to reverse string' })
    }
})

export default router