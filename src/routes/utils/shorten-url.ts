import express from 'express'
import mongoose from '../../mongoose'
import crypto from 'crypto'
import { URL } from 'url'

const router = express.Router()
const UrlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortId: { type: String, required: true },
    lastVisited: { type: Date, required: true, default: Date.now },
    createdAt: { type: Date, required: true, default: Date.now }
})
UrlSchema.index({ 'lastVisited': 1 }, { expireAfterSeconds: 15552000 /* 6 months */, unique: true })
const UrlModel = mongoose.model('Url', UrlSchema)

router.post('/', async (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const { url } = request.body
        if (!url) return response.status(400).json({ error: 'URL is required.' })
        try {
            new URL(url)
        } catch (err) {
            return response.status(400).json({ error: 'Invalid URL format.' })
        }
        let urlData = await UrlModel.findOne({ originalUrl: url })
        if (!urlData) {
            const shortId = crypto.randomBytes(7).toString('hex').slice(0, 7)
            urlData = new UrlModel({ originalUrl: url, shortId: shortId })
            await urlData.save()
        }
        response.json({ originalUrl: url, shortenedUrl: `http://api.thenolle.com/utils/shorten-url/${urlData.shortId}` })
    } catch (error: any) {
        console.error(`Error creating short URL (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        if (error.name === 'MongoError') response.status(500).json({ error: 'Database error.' })
        else response.status(500).json({ error: 'Internal server error.' })
    }
})

router.get('/:shortId', async (request: express.Request, response: express.Response) => {
    try {
        const { shortId } = request.params
        const urlData = await UrlModel.findOne({ shortId })
        if (!urlData) return response.status(404).json({ error: 'Shortened URL not found.' })
        urlData.lastVisited = new Date()
        await urlData.save()
        response.redirect(urlData.originalUrl as string)
    } catch (error: any) {
        console.error(`Error redirecting to original URL (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        if (error.name === 'MongoError') response.status(500).json({ error: 'Database error.' })
        else response.status(500).json({ error: 'Internal server error.' })
    }
})

export default router