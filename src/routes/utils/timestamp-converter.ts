import express from 'express'

const router = express.Router()

router.get('/', (request: express.Request, response: express.Response) => {
    try {
        response.json([
            {
                name: 'toTimestamp',
                description: 'Converts a human-readable date-time to UNIX timestamp',
                example: {
                    from: '2023-10-27 12:00:00',
                    to: '1685270400'
                }
            },
            {
                name: 'fromTimestamp',
                description: 'Converts a UNIX timestamp to human-readable date-time',
                example: {
                    from: '1685270400',
                    to: '2023-10-27 12:00:00'
                }
            }
        ])
    } catch (error: any) {
        console.error(`Error getting timestamp converter types (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to get timestamp converter types' })
    }
})

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const conversionType: string = String(request.body.type).trim()
        const inputValue: string = String(request.body.value).trim()

        if (!conversionType || !inputValue) {
            return response.status(400).json({ error: 'Both type and value are required' })
        }

        let convertedValue = ''

        switch (conversionType) {
            case 'toTimestamp':
                const dateObj = new Date(inputValue)
                convertedValue = String(Math.floor(dateObj.getTime() / 1000))
                break
            case 'fromTimestamp':
                const timestamp = parseInt(inputValue, 10)
                convertedValue = new Date(timestamp * 1000).toISOString()
                break
            default:
                return response.status(400).json({ error: 'Invalid conversion type' })
        }

        response.json({ original: inputValue, converted: convertedValue })
    } catch (error: any) {
        console.error(`Error converting timestamp (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to convert timestamp' })
    }
})

export default router