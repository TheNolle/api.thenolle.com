import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/weapons'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const weaponsResponse = await axios.get(`${baseURL}`)
        const weapons = weaponsResponse.data
        response.status(200).json(weapons)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact weapons (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch weapons' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const weaponsResponse = await axios.get(`${baseURL}/all`)
        const weapons = weaponsResponse.data
        response.status(200).json(weapons)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact weapons (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch weapons' })
    }
})

router.get('/:weaponName', async (request: express.Request, response: express.Response) => {
    const weaponName = request.params.weaponName
    try {
        const weaponResponse = await axios.get(`${baseURL}/${weaponName}`)
        const weapon = weaponResponse.data
        response.status(200).json(weapon)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact weapon (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch weapon' })
    }
})

export default router