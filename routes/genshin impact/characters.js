import { Router } from 'express'
import GenshinImpact from '../../models/genshin.impact.js'

const router = Router()

router.post('/', async (request, response) => {
    try {
        const { age, birthday_date, body_type, hair_style, hair_color, height, name, possible_mbti } = request.body

        const query = await GenshinImpact.find({}).lean()

        const characters = query[0].characters.filter((character) => {
            if (age) if (character.age !== age.toString()) return false
            if (birthday_date) if (character.birthday_date !== birthday_date) return false
            if (body_type) if (character.body_type.toLowerCase() !== body_type.toLowerCase()) return false
            if (hair_style) if (character.hair.style.toLowerCase() !== hair_style.toLowerCase()) return false
            if (hair_color) if (character.hair.color.toLowerCase() !== hair_color.toLowerCase()) return false
            if (height) if (character.height !== height) return false
            if (name) if (character.name.toLowerCase() !== name.toLowerCase()) return false
            if (possible_mbti) if (character.possible_mbti.toLowerCase() !== possible_mbti.toLowerCase()) return false
            return true
        }).map(({ _id, ...data }) => data)

        if (!characters.length) return response.json({ message: 'No characters found' })
        response.json({
            code: 200,
            count: characters.length,
            last_update: query[0].last_update,
            message: `Found ${characters.length} characters corresponding to the criterias provided.`,
            characters: characters,
        })
    } catch (e) {
        response.json({ message: `Error: ${e.message}` })
    }
})

export default router
