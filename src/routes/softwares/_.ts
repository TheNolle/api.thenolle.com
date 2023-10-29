import express from 'express'

import Route1 from './fabricmc'
import Route2 from './forge'
import Route3 from './rift'
import Route4 from './papermc'
import Route5 from './velocity'
import Route6 from './waterfall'
import Route7 from './bungeecord'
import Route8 from './travertine'
import Route10 from './spigotmc'
import Route11 from './craftbukkit'
import Route12 from './minecraft-server'
import Route13 from './purpurmc'
import Route14 from './bedrock-server'
import Route15 from './leavesmc'
import Route16 from './galemc'

const router = express.Router()

router.use('/fabricmc', Route1)
router.use('/forge', Route2)
router.use('/rift', Route3)
router.use('/papermc', Route4)
router.use('/velocity', Route5)
router.use('/waterfall', Route6)
router.use('/bungeecord', Route7)
router.use('/travertine', Route8)
router.use('/spigotmc', Route10)
router.use('/craftbukkit', Route11)
router.use('/minecraft-server', Route12)
router.use('/purpurmc', Route13)
router.use('/bedrock-server', Route14)
router.use('/leavesmc', Route15)
router.use('/galemc', Route16)

export default router