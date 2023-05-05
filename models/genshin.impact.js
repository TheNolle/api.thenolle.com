import { model, Schema } from 'mongoose'

const CharacterSchema = new Schema({
    age: String,
    birthday_date: String,
    body_type: String,
    hair: {
        color: String,
        style: String
    },
    height: String,
    name: String,
    possible_mbti: String
})

const GenshinImpactSchema = new Schema({
    characters: [CharacterSchema],
    last_update: Date,
})

const GenshinImpact = model('GenshinImpact', GenshinImpactSchema, 'genshin_impact')

export default GenshinImpact
