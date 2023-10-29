import express from 'express'
import { marked } from 'marked'
import turndown from 'turndown'

const router = express.Router()

const turndownService = new turndown()
turndownService.addRule('heading', {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: (content, node) => {
        let level = Number(node.nodeName.charAt(1))
        let hashes = '#'.repeat(level)
        return `${hashes} ${content}\n\n`
    }
})

router.post('/to-html', async (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        if (!request.body.markdown) return response.status(400).json({ error: 'Markdown content is required.' })
        const html = marked(request.body.markdown)
        return response.json({ html })
    } catch (error: any) {
        console.error(`Error converting Markdown to HTML (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to convert Markdown to HTML.' })
    }
})

router.post('/to-markdown', async (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        if (!request.body.html) return response.status(400).json({ error: 'HTML content is required.' })
        const markdown = turndownService.turndown(request.body.html)
        return response.json({ markdown })
    } catch (error: any) {
        console.error(`Error converting HTML to Markdown (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to convert HTML to Markdown.' })
    }
})

export default router