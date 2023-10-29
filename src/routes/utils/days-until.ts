import express from 'express'
import { DateTime } from 'luxon'

const router = express.Router()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const targetDate: string = String(request.body.targetDate).trim()
        if (targetDate.includes('..')) return response.status(400).json({ error: 'Invalid input' })
        if (!targetDate) return response.status(400).json({ error: 'Target date is required' })
        const currentDate = DateTime.now()
        const targetDateTime = DateTime.fromISO(targetDate)
        if (!targetDateTime.isValid) return response.status(400).json({ error: `Invalid target date: ${targetDateTime.invalidReason}` })
        const daysUntil = Math.ceil(targetDateTime.diff(currentDate, 'days').days)
        if (daysUntil < 0) return response.status(400).json({ error: 'Target date is in the past' })
        response.json({ currentDate: currentDate.toString(), targetDate: targetDate, daysUntil })
    } catch (error: any) {
        console.error(`Error calculating days until (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to calculate days until' })
    }
})

export default router