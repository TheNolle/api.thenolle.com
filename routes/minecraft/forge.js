import { Router } from 'express'
import { Forge } from '../../functions/minecraft.utils.js'

const router = Router()

router.get('/', async (request, response) => {
    return response.redirect('/minecraft/forge/latest')
})

router.get('/latest', async (request, response) => {
    const forge = new Forge()
    const version = await forge.getLatestVersion()
    if (!version) return response.status(404).send('Not found')
    const buildNumber = await forge.getLatestBuildNumber(version)
    if (!buildNumber) return response.status(404).send('Not found')
    const url = await forge.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    return response.redirect(url)
})

router.get('/:version', async (request, response) => {
    return response.redirect(`/minecraft/forge/${request.params.version}/latest`)
})

router.get('/:version/latest', async (request, response) => {
    const version = request.params.version
    const forge = new Forge()
    const buildNumber = await forge.getLatestBuildNumber(version)
    if (!buildNumber) return response.status(404).send('Not found')
    const url = await forge.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    return response.redirect(url)
})

router.get('/:version/:buildNumber', async (request, response) => {
    const forge = new Forge()
    const url = await forge.finalURL(request.params.version, request.params.buildNumber)
    if (!url) return response.status(404).send('Not found')
    return response.redirect(url)
})

export default router
