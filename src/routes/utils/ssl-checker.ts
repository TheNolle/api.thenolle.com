import express from 'express'
import https from 'https'

const router = express.Router()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'Missing request body' })
        const domain: string = String(request.body.domain || '').trim()
        if (!domain || domain.includes('..')) return response.status(400).json({ error: 'Invalid domain input' })
        const options = { host: domain, port: 443, method: 'GET', rejectUnauthorized: false, agent: false }
        const req = https.request(options, res => {
            const certificate = (res.socket as any).getPeerCertificate()
            if (!certificate || Object.keys(certificate).length === 0) return response.status(400).json({ error: 'No SSL certificate found' })
            response.json({ issuer: certificate.issuer, valid_from: certificate.valid_from, valid_to: certificate.valid_to, subject: certificate.subject })
        })
        req.on('error', error => {
            console.error(`Error fetching SSL details (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
            response.status(500).json({ error: 'Failed to fetch SSL details' })
        })
        req.end()
    } catch (error: any) {
        console.error(`Error checking SSL (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to check SSL' })
    }
})

export default router