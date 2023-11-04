import express from 'express'

const router = express.Router()

/**
 * @swagger
 * /my-data/socials:
 *   get:
 *     summary: Fetch my socials.
 *     tags: [My Data]
 *     responses:
 *       200:
 *         description: My socials.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Social name.
 *                     example: Discord
 *                   url:
 *                     type: string
 *                     description: Social URL.
 *                     example: https://discord.com/invite/86yVsMVN9z
 *       500:
 *         description: Server error retrieving my socials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch socials.
 */
router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        response.json([
            { name: 'Discord', url: 'https://discord.com/invite/86yVsMVN9z' },
            { name: 'Github', url: 'https://github.com/thenolle' },
            { name: 'Patreon', url: 'https://patreon.com/_nolly' },
            { name: 'Youtube', url: 'https://www.youtube.com/@_nolly_' },
            { name: 'Reddit', url: 'https://reddit.com/user/thenolle' },
            { name: 'Ko-fi', url: 'https://ko-fi.com/nolly__' },
            { name: 'X', url: 'https://x.com/thenolly_' },
            { name: 'Blog', url: 'https://blog.thenolle.com/' },
        ])
    } catch (error: any) {
        console.error(`Error fetching socials (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch socials' })
    }
})

export default router