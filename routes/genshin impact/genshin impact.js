import { Router } from 'express'
import fs from 'fs'

const router = Router()

fs.readdirSync(process.cwd() + '/routes/genshin impact').forEach(async (file) => {
    if (file === 'index.js') return
    const route = file.replace('.js', '')
    const routeFile = await import(`./${route}.js`)
    router.use(`/${route}`, routeFile.default)
})

export default router
