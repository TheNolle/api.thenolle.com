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