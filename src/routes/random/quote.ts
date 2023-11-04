import express from 'express'
import mongoose from '../../mongoose'

const QuoteSchema = new mongoose.Schema({
    quote: { type: String, required: true, unique: true },
    author: { type: String, required: true }
})
const QuoteModel = mongoose.model('Quote', QuoteSchema)

const router = express.Router()

/**
 * @swagger
 * /random/quote:
 *   get:
 *     summary: Returns a random quote.
 *     tags: [Random]
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 quote:
 *                   type: string
 *                   description: The generated quote.
 *                   example: "The greatest glory in living lies not in never falling, but in rising every time we fall."
 *                 author:
 *                   type: string
 *                   description: The author of the quote.
 *                   example: "Nelson Mandela"
 *       404:
 *         description: No quotes available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: No quotes available
 *       500:
 *         description: Error getting a random quote.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: Error getting a random quote
 */
router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const count: number = await QuoteModel.countDocuments()
        const random: number = Math.floor(Math.random() * count)
        const quote = await QuoteModel.findOne().skip(random)
        if (!quote) return response.status(404).json({ message: 'No quotes available' })
        return response.status(200).json({ quote: quote.quote, author: quote.author })
    } catch (error: any) {
        console.error(`Error getting a random quote (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ message: 'Error getting a random quote' })
    }
})

router.post('/', async (request: express.Request, response: express.Response) => {
    try {
        const { password, quotes } = request.body
        if (!password) return response.status(400).json({ message: 'No password provided' })
        if (password.toString() !== process.env.DATA_EDITING_PASSWORD?.toString()) return response.status(401).json({ message: 'Unauthorized' })
        let addedQuotes = []
        for (let q of quotes) {
            if (!q.quote || !q.author) return response.status(400).json({ message: 'No quote or author provided' })
            const existingQuote = await QuoteModel.findOne({ quote: q.quote })
            if (!existingQuote) {
                const newQuote = new QuoteModel({ quote: q.quote, author: q.author })
                await newQuote.save()
                addedQuotes.push(newQuote)
            }
        }
        response.json({ provided: quotes.length, added: addedQuotes.length, addedQuotes })
    } catch (error: any) {
        console.error(`Error posting a new quote (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ message: 'Error posting a new quote' })
    }
})

export default router