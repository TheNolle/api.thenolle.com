import express from 'express'
import mongoose from '../../mongoose'

const FactSchema = new mongoose.Schema({ fact: { type: String, required: true, unique: true } })
const FactModel = mongoose.model('Fact', FactSchema)

const router = express.Router()

/**
 * @swagger
 * /random/fact:
 *   get:
 *     summary: Returns a random fact.
 *     tags: [Random]
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fact:
 *                   type: string
 *                   description: The generated fact.
 *                   example: "The first oranges weren't orange."
 *       404:
 *         description: No facts available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: No facts available
 *       500:
 *         description: Error getting a random fact.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: Error getting a random fact
 *     examples:
 *       /random/fact:
 *         summary: Returns a random fact.
 *         description: Returns a random fact.
 *         responses:
 *           200:
 *             description: OK.
 *             content:
 *               application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     fact:
 *                       type: string
 *                       description: The generated fact.
 *                       example: "The first oranges weren't orange."
 */
router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const count: number = await FactModel.countDocuments()
        const random: number = Math.floor(Math.random() * count)
        const fact = await FactModel.findOne().skip(random)
        if (!fact) return response.status(404).json({ message: 'No facts available' })
        return response.status(200).json({ fact: fact.fact })
    } catch (error: any) {
        console.error(`Error getting a random fact (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ message: 'Error getting a random fact' })
    }
})

router.post('/', async (request: express.Request, response: express.Response) => {
    try {
        const { password, facts } = request.body
        if (!password) return response.status(400).json({ message: 'No password provided' })
        if (password.toString() !== process.env.DATA_EDITING_PASSWORD?.toString()) return response.status(401).json({ message: 'Unauthorized' })
        let addedFacts = []
        for (let fact of facts) {
            const existingFact = await FactModel.findOne({ fact: fact })
            if (!existingFact) {
                const newFact = new FactModel({ fact })
                await newFact.save()
                addedFacts.push(newFact)
            }
        }
        response.json({ provided: facts.length, added: addedFacts.length, addedFacts })
    } catch (error: any) {
        console.error(`Error posting a new fact (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ message: 'Error posting a new fact' })
    }
})

export default router