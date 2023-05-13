import { Router } from 'express'
import MinecraftServerUtil from 'minecraft-server-util'

const router = Router()

router.get('/blockedlist', async (request, response) => {
    await axios.get('https://sessionserver.mojang.com/blockedservers')
        .then(data => { return response.json(data.data.split('\n')) })
        .catch(error => { return response.status(500).json({ errorMessage: error.message }) })
})

router.get('/blockedlist/:position', async (request, response) => {
    const position = request.params.position
    if (!position) return response.status(400).json({ errorMessage: 'Missing position parameter' })
    if (isNaN(position)) return response.status(400).json({ errorMessage: 'Position parameter must be a number' })
    if (position < 1) return response.status(400).json({ errorMessage: 'Position parameter must be greater than 0' })
    await axios.get('https://sessionserver.mojang.com/blockedservers')
        .then(data => {
            data = data.data.split('\n')
            return response.send(data[position - 1])
        })
        .catch(error => { return response.status(500).json({ errorMessage: error.message }) })
})

router.get('/motd/:ip', async (request, response) => {
    const { ip } = request.params
    MinecraftServerUtil.status(ip)
        .then((res) => response.json(res.motd))
        .catch((error) => response.status(500).json({ errorMessage: error.message }))
})

router.get('/favicon/:ip', async (request, response) => {
    const { ip } = request.params
    MinecraftServerUtil.status(ip)
        .then((res) => {
            if (res.favicon) response.send(res.favicon)
            else response.status(404).json({ errorMessage: 'Favicon not found' })
        })
        .catch((error) => {
            response.status(500).json({ errorMessage: error.message })
        })
})

router.get('/online/:ip', async (request, response) => {
    const { ip } = request.params
    MinecraftServerUtil.status(ip)
        .then(() => response.json({ online: true }))
        .catch(() => response.json({ online: false }))
})

router.get('/version/:ip', async (request, response) => {
    const { ip } = request.params
    MinecraftServerUtil.status(ip)
        .then((res) => response.json(res.version))
        .catch((error) => response.status(500).json({ errorMessage: error.message }))
})

router.get('/players/:ip', async (request, response) => {
    const { ip } = request.params
    MinecraftServerUtil.status(ip)
        .then((res) => response.json(res.players))
        .catch((error) => response.status(500).json({ errorMessage: error.message }))
})

export default router
