import express from 'express'

const router = express.Router()

router.get('/', (request: express.Request, response: express.Response) => {
    try {
        response.json([
            {
                name: 'toUpperCase',
                description: 'Converts a string to uppercase',
                example: {
                    from: 'hello world',
                    to: 'HELLO WORLD'
                }
            },
            {
                name: 'toLowerCase',
                description: 'Converts a string to lowercase',
                example: {
                    from: 'HELLO WORLD',
                    to: 'hello world'
                }
            },
            {
                name: 'toCamelCase',
                description: 'Converts a string to camelCase',
                example: {
                    from: 'hello_world',
                    to: 'helloWorld'
                }
            },
            {
                name: 'toSnakeCase',
                description: 'Converts a string to snake_case',
                example: {
                    from: 'helloWorld',
                    to: 'hello_world'
                }
            }
        ])
    } catch (error: any) {
        console.error(`Error getting case converters (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to get case converters' })
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
            case 'toUpperCase':
                convertedText = text.toUpperCase()
                break
            case 'toLowerCase':
                convertedText = text.toLowerCase()
                break
            case 'toCamelCase':
                convertedText = text.replace(/([-_]\w)/g, g => g[1].toUpperCase()).replace(/[-_]/g, '').replace(/\s/g, '')
                break
            case 'toSnakeCase':
                convertedText = text.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '').replaceAll(' ', '')
                break
            default:
                return response.status(400).json({ error: 'Invalid conversion type' })
        }
        response.json({ original: text, converted: convertedText })
    } catch (error: any) {
        console.error(`Error converting string case (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to convert string case' })
    }
})

export default router