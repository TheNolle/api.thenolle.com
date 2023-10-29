import express from 'express'
import Sentiment from 'sentiment'

const router = express.Router()
const sentiment = new Sentiment()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const text: string = String(request.body.text)
        if (!text) return response.status(400).json({ error: 'Text is required' })
        const result = sentiment.analyze(text)
        let sentimentResult: string
        if (result.score > 0) sentimentResult = 'positive'
        else if (result.score < 0) sentimentResult = 'negative'
        else sentimentResult = 'neutral'
        response.json({ text: text, score: result.score, comparative: result.comparative, sentiment: sentimentResult })
    } catch (error: any) {
        console.error(`Error analyzing sentiment (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to analyze sentiment' })
    }
})

router.post('/detailed', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const text: string = String(request.body.text)
        if (!text) return response.status(400).json({ error: 'Text is required' })
        const result = sentiment.analyze(text)
        let sentimentResult: string
        if (result.score > 0) sentimentResult = 'positive'
        else if (result.score < 0) sentimentResult = 'negative'
        else sentimentResult = 'neutral'
        response.json({ text: text, sentiment: sentimentResult, ...result })
    } catch (error: any) {
        console.error(`Error analyzing sentiment (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to analyze sentiment' })
    }
})

export default router