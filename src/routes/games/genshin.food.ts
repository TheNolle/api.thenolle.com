import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/consumables/food'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const foodResponse = await axios.get(`${baseURL}`)
        const food = foodResponse.data
        response.status(200).json(food)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact food (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch food' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const foodResponse = await axios.get(`${baseURL}/all`)
        const food = foodResponse.data
        response.status(200).json(food)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact food (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch food' })
    }
})

router.get('/:foodName', async (request: express.Request, response: express.Response) => {
    const foodName = request.params.foodName
    try {
        const foodResponse = await axios.get(`${baseURL}/${foodName}`, { responseType: 'arraybuffer' })
        response.set('Content-Type', 'image/png')
        response.status(200).send(foodResponse.data)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact food (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch food' })
    }
})

export default router