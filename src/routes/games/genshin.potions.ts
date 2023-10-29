import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/consumables/potions'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const potionsResponse = await axios.get(`${baseURL}`)
        const potions = potionsResponse.data
        response.status(200).json(potions)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact potions (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch potions' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const potionsResponse = await axios.get(`${baseURL}/all`)
        const potions = potionsResponse.data
        response.status(200).json(potions)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact potions (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch potions' })
    }
})

router.get('/:potionName', async (request: express.Request, response: express.Response) => {
    const potionName = request.params.potionName
    try {
        const potionResponse = await axios.get(`${baseURL}/${potionName}`, { responseType: 'arraybuffer' })
        response.set('Content-Type', 'image/png')
        response.status(200).send(potionResponse.data)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact potion (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch potion' })
    }
})

export default router