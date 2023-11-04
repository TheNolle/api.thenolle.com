import express from 'express'
import path from 'path'
import fs from 'fs'

const router = express.Router()

/**
 * @swagger
 * /my-data/mycurrentproject:
 *   get:
 *     summary: Fetch my current project.
 *     tags: [My Data]
 *     responses:
 *       200:
 *         description: My current project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   type: string
 *                   description: My current project.
 *                   example: api.thenolle.com
 *       500:
 *         description: Server error retrieving my current project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to fetch my current project.
 */
router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        response.send({ project: process.env.CURRENT_PROJECT?.toString() })
    } catch (error: any) {
        console.error(`Error fetching my current project (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch my current project' })
    }
})

router.post('/', async (request: express.Request, response: express.Response) => {
    try {
        const password: string = request.body.password
        if (!password) return response.status(400).send({ error: 'Missing password' })
        if (password.toString() !== process.env.MY_PASSWORD?.toString()) return response.status(400).send({ error: 'Invalid password' })
        const currentproject: string = request.body.currentproject
        if (!currentproject) return response.status(400).send({ error: 'Missing current project' })
        if (currentproject.toString() === process.env.CURRENT_PROJECT?.toString()) return response.status(400).send({ error: 'Current project is already set to this value' })
        process.env.CURRENT_PROJECT = currentproject.toString()
        const envFilePath: string = path.resolve(__dirname, '../../.env')
        const envFileData: string = fs.readFileSync(envFilePath).toString()
        const envFileDataLines: string[] = envFileData.split('\n')
        const envFileDataLinesModified: string[] = envFileDataLines.map((line: string) => {
            if (line.startsWith('CURRENT_PROJECT=')) return `CURRENT_PROJECT=${currentproject.toString()}`
            return line
        })
        fs.writeFileSync(envFilePath, envFileDataLinesModified.join('\n'))
        response.send({ message: `Current project set to ${currentproject.toString()}` })
    } catch (error: any) {
        console.error(`Error setting my current project (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to set my current project' })
    }
})

export default router