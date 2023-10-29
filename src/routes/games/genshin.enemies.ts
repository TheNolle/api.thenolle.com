import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/enemies'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const enemiesResponse = await axios.get(`${baseURL}`)
        const enemies = enemiesResponse.data
        response.status(200).json(enemies)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact enemies (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch enemies' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const enemiesResponse = await axios.get(`${baseURL}/all`)
        const enemies = enemiesResponse.data
        response.status(200).json(enemies)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact enemies (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch enemies' })
    }
})

router.get('/:enemyName', async (request: express.Request, response: express.Response) => {
    const enemyName = request.params.enemyName
    try {
        const enemyResponse = await axios.get(`${baseURL}/${enemyName}`)
        const enemy = enemyResponse.data
        response.status(200).json(enemy)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact enemy (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch enemy' })
    }
})

export default router