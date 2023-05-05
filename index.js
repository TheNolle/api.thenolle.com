import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import config from './config.json' assert { type: 'json' }

import genshin_impact from './routes/genshin impact/genshin impact.js'
import minecraft from './routes/minecraft/minecraft.js'


const encodedPassword = encodeURIComponent(config.mongodb.password)
const connectionString = `mongodb://${config.mongodb.user}:${encodedPassword}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`


const app = express()
const port = config.port || 3000

app.use(express.json())
app.use(cors())

app.use('/genshin_impact', genshin_impact)
app.use('/minecraft', minecraft)


console.clear()
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connected to database ${config.mongodb.database}`))
    .catch(() => console.log(`Failed to connect to database ${config.mongodb.database}`))
    .finally(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })
    })
