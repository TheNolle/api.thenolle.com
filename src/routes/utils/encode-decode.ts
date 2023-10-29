import express from 'express'

const router = express.Router()

router.get('/', (request: express.Request, response: express.Response) => {
    try {
        response.json([
            {
                name: 'urlEncode',
                description: 'Encodes a string to URL encoding',
                example: {
                    from: 'hello world',
                    to: 'hello%20world'
                }
            },
            {
                name: 'urlDecode',
                description: 'Decodes a URL encoded string',
                example: {
                    from: 'hello%20world',
                    to: 'hello world'
                }
            },
            {
                name: 'base64Encode',
                description: 'Encodes a string to base64',
                example: {
                    from: 'hello world',
                    to: 'aGVsbG8gd29ybGQ='
                }
            },
            {
                name: 'base64Decode',
                description: 'Decodes a base64 encoded string',
                example: {
                    from: 'aGVsbG8gd29ybGQ=',
                    to: 'hello world'
                }
            }
        ])
    } catch (error: any) {
        console.error(`Error getting encoders/decoders (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to get encoders/decoders' })
    }
})

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const text: string = String(request.body.text).trim()
        const conversionType: string = String(request.body.type).trim()
        if (!text || !conversionType) return response.status(400).json({ error: 'Both text and type are required' })
        let convertedText = ''
        switch (conversionType) {
            case 'urlEncode':
                convertedText = encodeURIComponent(text)
                break
            case 'urlDecode':
                convertedText = decodeURIComponent(text)
                break
            case 'base64Encode':
                convertedText = Buffer.from(text).toString('base64')
                break
            case 'base64Decode':
                convertedText = Buffer.from(text, 'base64').toString('utf-8')
                break
            default:
                return response.status(400).json({ error: 'Invalid conversion type' })
        }
        response.json({ original: text, converted: convertedText })
    } catch (error: any) {
        console.error(`Error encoding/decoding string (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to encode/decode string' })
    }
})

export default router