import express from 'express'
import axios from 'axios'

const router = express.Router()

/**
 * @swagger
 * /random/number:
 *   get:
 *     summary: Generates a random number in the specified range.
 *     tags: [Random]
 *     parameters:
 *       - in: query
 *         name: from
 *         description: Minimum value (inclusive).
 *         schema:
 *           type: integer
 *           default: 1
 *           example: 1
 *           required: false
 *       - in: query
 *         name: to
 *         description: Maximum value (inclusive).
 *         schema:
 *           type: integer
 *           default: 100
 *           example: 100
 *           required: false
 *       - in: query
 *         name: realRandom
 *         description: If true, it will be generated using the Random.org API.
 *         schema:
 *           type: boolean
 *           default: false
 *           example: false
 *           required: false
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 number:
 *                   type: integer
 *                   description: The generated number.
 *                   example: 42
 *                 from:
 *                   type: integer
 *                   description: The minimum value.
 *                   example: 1
 *                 to:
 *                   type: integer
 *                   description: The maximum value.
 *                   example: 100
 *                 realRandom:
 *                   type: boolean
 *                   description: If true, it was generated using the Random.org API.
 *                   example: false
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: Error getting a real random
 */
router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const from: number = Number(request.query.from || 1)
        const to: number = Number(request.query.to || 100)
        const realRandom: boolean = Boolean(request.query.realRandom || false)
        let result: number = 0
        switch (realRandom) {
            case true:
                const randomOrgResponse = await axios.get('https://www.random.org/integers/', { params: { num: 1, min: from, max: to, col: 1, base: 10, format: 'plain', rnd: 'new' } })
                result = Number(randomOrgResponse.data)
                break
            case false:
                result = Math.floor(Math.random() * (to - from + 1)) + from
                break
        }
        response.json({ number: result, from, to, realRandom })
    } catch (error: any) {
        console.error(`Error getting a real random (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ message: 'Error getting a real random' })
    }
})

export default router