import express from 'express'

const router = express.Router()

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const fromUnit: string = String(request.query.from)?.toLowerCase()
        const toUnit: string = String(request.query.to)?.toLowerCase()
        const value = parseFloat(String(request.query.value))
        if (!fromUnit || !toUnit || !value) return response.status(400).json({ error: 'Missing parameters' })
        let result = null
        switch (fromUnit) {
            case 'km':
                if (toUnit === 'mi') result = value * 0.621371
                break
            case 'mi':
                if (toUnit === 'km') result = value / 0.621371
                break
            case 'kg':
                if (toUnit === 'lb') result = value * 2.20462
                break
            case 'lb':
                if (toUnit === 'kg') result = value / 2.20462
                break
            case 'c':
                if (toUnit === 'f') result = (value * 9/5) + 32
                break
            case 'f':
                if (toUnit === 'c') result = (value - 32) * 5/9
                break
            default:
                return response.status(400).json({ error: 'Unsupported units' })
        }
        if (result === null) return response.status(400).json({ error: 'Invalid conversion pair' })
        response.json({ value: value, from: fromUnit, to: toUnit, result: result })
    } catch (error: any) {
        console.error(`Error converting unit (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to convert unit' })
    }
})

export default router