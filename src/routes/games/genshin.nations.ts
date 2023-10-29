import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/nations'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const nationsResponse = await axios.get(`${baseURL}`)
        const nations = nationsResponse.data
        response.status(200).json(nations)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact nations (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch nations' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const nationsResponse = await axios.get(`${baseURL}/all`)
        const nations = nationsResponse.data
        response.status(200).json(nations)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact nations (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch nations' })
    }
})

router.get('/:nationName', async (request: express.Request, response: express.Response) => {
    const nationName = request.params.nationName
    try {
        const nationResponse = await axios.get(`${baseURL}/${nationName}`)
        const nation = nationResponse.data
        response.status(200).json(nation)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact nation (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch nation' })
    }
})

export default router