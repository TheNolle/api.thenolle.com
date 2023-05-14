import axios from 'axios'

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