import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://meta.fabricmc.net/v2'

router.get('/versions/game', async (_request, response) => {
    try {
        const res = await axios.get(`${baseUrl}/versions/game`)
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching Minecraft versions (http://api.thenolle.com${_request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Minecraft versions' })
    }
})

router.get('/versions/:minecraftVersion', async (request, response) => {
    try {
        const minecraftVersion:string = String(request.params.minecraftVersion || '').trim()
        if (!minecraftVersion) return response.status(400).json({ error: 'Minecraft version is required' })
        const res = await axios.get(`${baseUrl}/versions/loader/${minecraftVersion}`)
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching Fabric Loader versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Fabric Loader versions' })
    }
})

router.get('/versions/:minecraftVersion/:fabricLoader', async (request, response) => {
    try {
        const minecraftVersion:string = String(request.params.minecraftVersion || '').trim()
        const fabricLoader:string = String(request.params.fabricLoader || '').trim()
        if (!minecraftVersion) return response.status(400).json({ error: 'Minecraft version is required' })
        if (!fabricLoader) return response.status(400).json({ error: 'Fabric Loader version is required' })
        const res = await axios.get(`${baseUrl}/versions/loader/${minecraftVersion}/${fabricLoader}`)
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching Installer versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Installer versions' })
    }
})

router.get('/download/:minecraftVersion?/:fabricLoader?/:installerVersion?', async (request, response) => {
    try {
        let minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
        let fabricLoader: string = String(request.params.fabricLoader || '').trim()
        let installerVersion: string = String(request.params.installerVersion || '').trim()
        if (!minecraftVersion) {
            const mcVersionsRes = await axios.get(`${baseUrl}/versions/game`)
            minecraftVersion = mcVersionsRes.data[0].version
        }
        if (!fabricLoader) {
            const loaderVersionsRes = await axios.get(`${baseUrl}/versions/loader/${minecraftVersion}`)
            fabricLoader = loaderVersionsRes.data[0].loader.version
        }
        if (!installerVersion) {
            const installerVersionsRes = await axios.get(`${baseUrl}/versions/installer`)
            installerVersion = installerVersionsRes.data[0].version
        }
        const downloadUrl = `${baseUrl}/versions/loader/${minecraftVersion}/${fabricLoader}/${installerVersion}/server/jar`
        response.redirect(downloadUrl)
    } catch (error: any) {
        console.error(`Error redirecting to download (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to redirect to download' })
    }
})

export default router