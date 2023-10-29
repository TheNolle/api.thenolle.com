import express from 'express'
import { DateTime } from 'luxon'
import { getTimeZones, TimeZone } from '@vvo/tzdb'

const router = express.Router()

router.post('/', (request: express.Request, response: express.Response) => {
    try {
        if (!request.body) return response.status(400).json({ error: 'No body supplied' })
        const fromTimezone: string = String(request.body.fromTimezone).trim()
        const toTimezone: string = String(request.body.toTimezone).trim()
        const datetime: string = String(request.body.datetime).trim()
        if (fromTimezone.includes('..') || toTimezone.includes('..') || datetime.includes('..')) return response.status(400).json({ error: 'Invalid input' })
        if (!fromTimezone || !toTimezone || !datetime) return response.status(400).json({ error: 'Missing parameters' })
        const sourceTime = DateTime.fromISO(datetime, { zone: fromTimezone })
        if (!sourceTime.isValid) return response.status(400).json({ error: `Invalid datetime or source timezone: ${sourceTime.invalidReason}` })
        const targetTime = sourceTime.setZone(toTimezone)
        if (!targetTime.isValid) return response.status(400).json({ error: `Invalid target timezone: ${targetTime.invalidReason}` })
        response.json({ originalDatetime: datetime, originalTimezone: fromTimezone, convertedDatetime: targetTime.toString(), targetTimezone: toTimezone })
    } catch (error: any) {
        console.error(`Error converting timezone (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to convert timezone' })
    }
})

router.get('/timezones', (_request: express.Request, response: express.Response) => {
    try {
        const timezones: TimeZone[] = getTimeZones()
        response.json({ timezones })
    } catch (error: any) {
        console.error(`Error getting timezones (http://api.thenolle.com${_request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to get timezones' })
    }
})

export default router