import { Router } from 'express'
import { PaperMC } from '../../functions/minecraft.utils.js'

const router = Router()

router.get('/', async (request, response) => {
    return response.redirect('/minecraft/paper/latest')
})

router.get('/latest', async (request, response) => {
    const paper = new PaperMC('paper')
    const version = await paper.getLatestVersion()
    const buildNumber = await paper.getLatestBuildNumber(version)
    const url = await paper.finalURL(version, buildNumber)
    response.redirect(url)
})

router.get('/:version', async (request, response) => {
    return response.redirect(`/minecraft/paper/${request.params.version}/latest`)
})

router.get('/:version/latest', async (request, response) => {
    const paper = new PaperMC('paper')
    const versions = await paper.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return paper.notFound(response, 'Version not found')
    const buildNumber = await paper.getLatestBuildNumber(version)
    const url = await paper.finalURL(version, buildNumber)
    return response.redirect(url)
})

router.get('/:version/:buildNumber', async (request, response) => {
    const paper = new PaperMC('paper')
    const versions = await paper.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return paper.notFound(response, 'Version not found')
    const buildNumbers = await paper.getBuildNumbers(version)
    const buildNumber = buildNumbers.includes(parseInt(request.params.buildNumber)) ? parseInt(request.params.buildNumber) : null
    if (!buildNumber) return paper.notFound(response, 'Build number not found')
    const url = await paper.finalURL(version, buildNumber)
    return response.redirect(url)
})

export default router
