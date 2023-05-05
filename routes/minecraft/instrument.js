import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, instrumentID } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!instrumentID) return response.status(400).json({ error: 'Missing instrumentID' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })
    
    const instrumentData = minecraftData.instruments[instrumentID]
    if (!instrumentData) return response.status(400).json({ error: 'Invalid instrumentID' })

    return response.status(200).json({ ...instrumentData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const instrumentsData = minecraftData.instrumentsArray
    if (!instrumentsData) return response.status(400).json({ error: 'Invalid instruments' })

    return response.status(200).json({ version, count: instrumentsData.length, instruments: instrumentsData })
})

export default router
