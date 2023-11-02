import express from 'express'
import highlightjs from 'highlight.js'

const router = express.Router()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'Missing request body' })
        const code: string = String(request.body.code || '').trim()
        const language: string = String(request.body.language || '').trim()
        if (!code) return response.status(400).json({ error: 'Code is required' })
        if (!language) return response.status(400).json({ error: 'Language is required' })
        if (language && !highlightjs.getLanguage(language)) return response.status(400).json({ error: 'Invalid or unsupported language' })
        const highlightedCode = language ? highlightjs.highlight(code, { language }).value : highlightjs.highlightAuto(code).value
        response.json({ highlightedCode })
    } catch (error: any) {
        console.error(`Error highlighting syntax (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to highlight syntax' })
    }
})

router.get('/languages', (_request: express.Request, response: express.Response) => {
    try {
        const languages = highlightjs.listLanguages()
        response.json({ languages })
    } catch (error: any) {
        console.error(`Error listing languages (http://api.thenolle.com${_request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to list languages' })
    }
})

export default router