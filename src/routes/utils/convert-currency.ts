import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://open.er-api.com/v6/latest'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const baseCurrency: string = String(request.query.from)?.toUpperCase()
        const targetCurrency: string = String(request.query.to)?.toUpperCase()
        const amount: number = parseFloat(String(request.query.amount))
        if (!baseCurrency || !targetCurrency || !amount) return response.status(400).json({ error: 'Missing parameters' })
        const apiResponse = await axios.get(`${baseURL}/${baseCurrency}`)
        const rate = apiResponse.data.rates[targetCurrency]
        if (!rate) return response.status(400).json({ error: 'Target currency not supported' })
        const convertedAmount = amount * rate
        response.json({ base: baseCurrency, target: targetCurrency, amount, convertedAmount, conversionRate: rate })
    } catch (error: any) {
        console.error(`Error fetching exchange rates (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch exchange rates' })
    }
})

export default router