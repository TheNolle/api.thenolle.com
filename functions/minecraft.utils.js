import axios from 'axios'
import puppeteer from 'puppeteer'

async function getMinecraftData(url) {
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        throw new Error(error.response.data.errorMessage)
    }
}

export async function getUUID(username) {
    return await getMinecraftData(`https://api.mojang.com/users/profiles/minecraft/${username}`)
}

export async function getUsername(uuid) {
    return await getMinecraftData(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
}

export function getUuidOrUsername(value) {
    let string = value.replace(/-/g, '')
    let uuid = string.length === 32 && /^[0-9a-fA-F]+$/.test(string) ? string.toLowerCase() : null
    let username = !uuid ? value : null
    return { uuid, username }
}

export async function fetchProfileAndTexture(uuid, username, textureType = 'SKIN') {
    if (username) {
        let data = await axios.get(`https://api.thenolle.com/minecraft/user/uuid/${username}`)
        uuid = data.data
    }

    let data = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)
    const textureUrl = JSON.parse(Buffer.from(data.data.properties[0].value, 'base64').toString('ascii')).textures[textureType].url
    const imageResponse = await axios.get(textureUrl, { responseType: 'arraybuffer' })
    return imageResponse
}

export class PaperMC {
    constructor(software) {
        this.software = software
        this.version
        this.buildNumber
    }
    setVersion(version) {
        this.version = version
    }
    setBuildNumber(buildNumber) {
        this.buildNumber = buildNumber
    }
    async finalURL(version, buildNumber) {
        return `https://api.papermc.io/v2/projects/${this.software}/versions/${version}/builds/${buildNumber}/downloads/${this.software}-${version}-${buildNumber}.jar`
    }
    getVersions() {
        const url = `https://api.papermc.io/v2/projects/${this.software}`
        async function request() {
            const response = await axios.get(url)
            const versions = response.data.versions
            return await versions
        }
        const versions = request()
        return versions
    }
    async getLatestVersion() {
        const versions = await this.getVersions()
        this.setVersion(versions[versions.length - 1])
        return versions[versions.length - 1]
    }
    getBuildNumbers(version = this.version) {
        const url = `https://api.papermc.io/v2/projects/${this.software}/versions/${version}`
        async function request() {
            const response = await axios.get(url)
            const builds = response.data.builds
            return await builds
        }
        const builds = request()
        return builds
    }
    async getLatestBuildNumber(version = this.version) {
        const buildNumbers = await this.getBuildNumbers(version)
        this.setBuildNumber(buildNumbers[buildNumbers.length - 1])
        return buildNumbers[buildNumbers.length - 1]
    }
    notFound(response, message) {
        return response.status(404).send(message)
    }
}


export class Forge {
    constructor() {
        this.version
        this.buildNumber
        this.url
        this.puppeteerOptions = { headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-software-rasterizer'], defaultViewport: null }
    }
    setVersion(version) {
        this.version = version
    }
    setBuildNumber(buildNumber) {
        this.buildNumber = buildNumber
    }
    setURL(url) {
        this.url = url
    }
    async finalURL(version, buildNumber) {
        const maven = `https://maven.minecraftforge.net/net/minecraftforge/forge/${version}-${buildNumber}/forge-${version}-${buildNumber}`
        const cdn = `https://files.minecraftforge.net/maven/net/minecraftforge/forge/${version}-${buildNumber}/forge-${version}-${buildNumber}`
        await axios.get(maven + '-installer.jar').then(() => this.setURL(`${maven}-installer.jar`)).catch(async () => {
            await axios.get(maven + '-server.jar').then(() => this.setURL(`${maven}-server.jar`)).catch(async () => {
                await axios.get(maven + '-installer.zip').then(() => this.setURL(`${maven}-installer.zip`)).catch(async () => {
                    await axios.get(maven + '-server.zip').then(() => this.setURL(`${maven}-server.zip`)).catch(async () => {
                        await axios.get(cdn + '-installer.jar').then(() => this.setURL(`${cdn}-installer.jar`)).catch(async () => {
                            await axios.get(cdn + '-installer.zip').then(() => this.setURL(`${cdn}-installer.zip`)).catch(async () => {
                                await axios.get(cdn + '-server.jar').then(() => this.setURL(`${cdn}-server.jar`)).catch(async () => {
                                    await axios.get(cdn + '-server.zip').then(() => this.setURL(`${cdn}-server.zip`)).catch(async () => {
                                        this.setURL(null)
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
        return this.url
    }
    async getLatestVersion() {
        try {
            const browser = await puppeteer.launch(this.puppeteerOptions)
            const page = await browser.newPage()
            await page.goto('https://files.minecraftforge.net/net/minecraftforge/forge/')
            this.setVersion(await page.evaluate(() => {
                const element = document.querySelector('div.sidebar-left > aside > section > ul > div > div > li:nth-child(1) > ul > li:nth-child(1) > a')
                return element ? element.innerText : null
            }))
            await browser.close()
        } catch (error) {
            return null
        }
        return this.version
    }
    async getLatestBuildNumber(version = this.version) {
        try {
            const browser = await puppeteer.launch(this.puppeteerOptions)
            const page = await browser.newPage()
            await page.goto(`https://files.minecraftforge.net/net/minecraftforge/forge/index_${version}.html`)
            this.setBuildNumber(await page.evaluate(() => {
                const element = document.querySelector('div.sidebar-sticky-wrapper-content > div.promos-wrapper > div.promos-content > div.downloads > div.download > div.title > small')
                return element ? element.innerText.split(' - ')[1] : null
            }))
            await browser.close()
        } catch (error) {
            return null
        }
        return this.buildNumber
    }
}