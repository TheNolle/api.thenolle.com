import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseUrl = 'https://meta.fabricmc.net/v2/'

/**
 * @swagger
 * /softwares/fabricmc/versions/game:
 *   get:
 *     summary: Returns a list of available Minecraft game versions for FabricMC.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: An array of Minecraft game versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                     description: The Minecraft game version.
 *                     example: "23w44a"
 *                   stable:
 *                     type: boolean
 *                     description: Indicates if the version is stable.
 *                     example: false
 *       500:
 *         description: Failed to fetch Minecraft versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to fetch Minecraft versions
 */
router.get('/versions/game', async (_request, response) => {
    try {
        const res = await axios.get(`${baseUrl}/versions/game`)
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching Minecraft versions (http://api.thenolle.com${_request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Minecraft versions' })
    }
})

/**
 * @swagger
 * /softwares/fabricmc/versions/installer:
 *   get:
 *     summary: Returns a list of available installer versions for FabricMC.
 *     tags: [Softwares]
 *     responses:
 *       200:
 *         description: An array of FabricMC installer versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   version:
 *                     type: string
 *                     description: The Minecraft game version.
 *                     example: "0.11.2"
 *                   stable:
 *                     type: boolean
 *                     description: Indicates if the version is stable.
 *                     example: true
 *                   maven:
 *                     type: string
 *                     description: The Maven version.
 *                     example: "net.fabricmc:fabric-installer:0.11.2"
 *                   url:
 *                     type: string
 *                     description: The URL to download the installer.
 *                     example: "https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.2/fabric-installer-0.11.2.jar"
 *       500:
 *         description: Failed to fetch Installer versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to fetch Installer versions
 */
router.get('/versions/installer', async (request, response) => {
    try {
        const res = await axios.get(`${baseUrl}/versions/installer`)
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching Installer versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Installer versions' })
    }
})

/**
 * @swagger
 * /softwares/fabricmc/versions/installer/{installerVersion}:
 *   get:
 *     summary: Returns information for a specific installer version of FabricMC.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: installerVersion
 *         schema:
 *           type: string
 *         required: true
 *         description: The specific installer version of FabricMC.
 *         example: "0.11.2"
 *     responses:
 *       200:
 *         description: Details of the specified FabricMC installer version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 version:
 *                   type: string
 *                   description: The Minecraft game version.
 *                   example: "0.11.2"
 *                 stable:
 *                   type: boolean
 *                   description: Indicates if the version is stable.
 *                   example: true
 *                 maven:
 *                   type: string
 *                   description: The Maven version.
 *                   example: "net.fabricmc:fabric-installer:0.11.2"
 *                 url:
 *                   type: string
 *                   description: The URL to download the installer.
 *                   example: "https://maven.fabricmc.net/net/fabricmc/fabric-installer/0.11.2/fabric-installer-0.11.2.jar"
 *       404:
 *         description: Installer version not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Installer version not found
 *       500:
 *         description: Failed to fetch Installer versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to fetch Installer versions
 */
router.get('/versions/installer/:installerVersion', async (request, response) => {
    try {
        const installerVersion: string = String(request.params.installerVersion || '').trim()
        if (!installerVersion) return response.status(400).json({ error: 'Installer version is required' })
        const res = await axios.get(`${baseUrl}/versions/installer`)
        const data = res.data
        const result = data.filter((item: any) => item.version === installerVersion)
        if (!result.length) return response.status(404).json({ error: 'Installer version not found' })
        response.json(result[0])
    } catch (error: any) {
        console.error(`Error fetching Installer versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Installer versions' })
    }
})

/**
 * @swagger
 * /softwares/fabricmc/versions/{minecraftVersion}:
 *   get:
 *     summary: Returns FabricMC version details for the specified Minecraft version.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         schema:
 *           type: string
 *         required: true
 *         description: The Minecraft version for which to fetch FabricMC details.
 *         example: "23w44a"
 *     responses:
 *       200:
 *         description: A detailed object of FabricMC version information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   loader:
 *                     type: object
 *                     properties:
 *                       separator:
 *                         type: string
 *                         description: Separator used in versioning.
 *                         example: "."
 *                       build:
 *                         type: number
 *                         description: Build number of the loader.
 *                         example: 24
 *                       maven:
 *                         type: string
 *                         description: Maven path for the loader.
 *                         example: "net.fabricmc:fabric-loader:0.14.24"
 *                       version:
 *                         type: string
 *                         description: Version number of the loader.
 *                         example: "0.14.24"
 *                       stable:
 *                         type: boolean
 *                         description: Stability status of the loader version.
 *                         example: true
 *                   intermediary:
 *                     type: object
 *                     properties:
 *                       maven:
 *                         type: string
 *                         description: Maven path for the intermediary.
 *                         example: "net.fabricmc:intermediary:23w44a"
 *                       version:
 *                         type: string
 *                         description: Version of the intermediary.
 *                         example: "23w44a"
 *                       stable:
 *                         type: boolean
 *                         description: Stability status of the intermediary version.
 *                         example: true
 *                   launcherMeta:
 *                     type: object
 *                     properties:
 *                       version:
 *                         type: number
 *                         description: Version of the launcher meta.
 *                         example: 1
 *                       libraries:
 *                         type: object
 *                         properties:
 *                           client:
 *                             type: array
 *                             items: {}
 *                             description: Client libraries required for the version.
 *                           common:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                   description: Name of the common library.
 *                                   example: "net.fabricmc:tiny-mappings-parser:0.3.0+build.17"
 *                                 url:
 *                                   type: string
 *                                   format: uri
 *                                   description: URL of the Maven repository for the library.
 *                                   example: "https://maven.fabricmc.net/"
 *                           server:
 *                             type: array
 *                             items: {}
 *                             description: Server libraries required for the version.
 *                       mainClass:
 *                         type: object
 *                         properties:
 *                           client:
 *                             type: string
 *                             description: Main class for the client.
 *                             example: "net.fabricmc.loader.impl.launch.knot.KnotClient"
 *                           server:
 *                             type: string
 *                             description: Main class for the server.
 *                             example: "net.fabricmc.loader.impl.launch.knot.KnotServer"
 *       400:
 *         description: Minecraft version is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Minecraft version is required"
 *       500:
 *         description: Failed to fetch Fabric Loader versions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: "Failed to fetch Fabric Loader versions"
 */
router.get('/versions/:minecraftVersion', async (request, response) => {
    try {
        const minecraftVersion: string = String(request.params.minecraftVersion || '').trim()
        if (!minecraftVersion) return response.status(400).json({ error: 'Minecraft version is required' })
        const res = await axios.get(`${baseUrl}/versions/loader/${minecraftVersion}`)
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching Fabric Loader versions (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(500).json({ error: 'Failed to fetch Fabric Loader versions' })
    }
})

/**
 * @swagger
 * /softwares/fabricmc/download/{minecraftVersion}/{fabricLoader}/{installerVersion}:
 *   get:
 *     summary: Redirects to the download URL for the specified Minecraft version, Fabric Loader, and installer version of FabricMC.
 *     tags: [Softwares]
 *     parameters:
 *       - in: path
 *         name: minecraftVersion
 *         schema:
 *           type: string
 *         required: false
 *         description: The Minecraft version. Defaults to the latest version if not specified.
 *         example: "23w44a"
 *       - in: path
 *         name: fabricLoader
 *         schema:
 *           type: string
 *         required: false
 *         description: The Fabric Loader version. Defaults to the latest version if not specified.
 *         example: "0.14.24"
 *       - in: path
 *         name: installerVersion
 *         schema:
 *           type: string
 *         required: false
 *         description: The FabricMC installer version. Defaults to the latest version if not specified.
 *         example: "0.11.2"
 *     responses:
 *       200:
 *         description: Redirect to the FabricMC server jar download URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               format: uri
 *               description: The download URL for the FabricMC server jar.
 *               example: https://meta.fabricmc.net/v2/versions/loader/23w44a/0.14.24/0.11.2/server/jar
 *       500:
 *         description: Failed to redirect to download.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message.
 *                   example: Failed to redirect to download
 */
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