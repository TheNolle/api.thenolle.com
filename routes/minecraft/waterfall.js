import { Router } from 'express'
import { PaperMC } from '../../functions/minecraft.utils.js'

const router = Router()

router.get('/', async (request, response) => {
    return response.redirect('/minecraft/waterfall/latest')
})

router.get('/latest', async (request, response) => {
    const waterfall = new PaperMC('waterfall')
    const version = await waterfall.getLatestVersion()
    const buildNumber = await waterfall.getLatestBuildNumber(version)
    const url = await waterfall.finalURL(version, buildNumber)
    response.redirect(url)
})

router.get('/:version', async (request, response) => {
    return response.redirect(`/minecraft/waterfall/${request.params.version}/latest`)
})

router.get('/:version/latest', async (request, response) => {
    const waterfall = new PaperMC('waterfall')
    const versions = await waterfall.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return waterfall.notFound(response, 'Version not found')
    const buildNumber = await waterfall.getLatestBuildNumber(version)
    const url = await waterfall.finalURL(version, buildNumber)
    return response.redirect(url)
})

router.get('/:version/:buildNumber', async (request, response) => {
    const waterfall = new PaperMC('waterfall')
    const versions = await waterfall.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return waterfall.notFound(response, 'Version not found')
    const buildNumbers = await waterfall.getBuildNumbers(version)
    const buildNumber = buildNumbers.includes(parseInt(request.params.buildNumber)) ? parseInt(request.params.buildNumber) : null
    if (!buildNumber) return waterfall.notFound(response, 'Build number not found')
    const url = await waterfall.finalURL(version, buildNumber)
    return response.redirect(url)
})

export default router
