import express from 'express'

import Route1 from './genshin.characters'
import Route2 from './genshin.artifacts'
import Route3 from './genshin.food'
import Route4 from './genshin.potions'
import Route5 from './genshin.domains'
import Route6 from './genshin.elements'
import Route7 from './genshin.enemies'
import Route8 from './genshin.materials'
import Route9 from './genshin.nations'
import Route10 from './genshin.weapons'

const router = express.Router()

//! Genshin Impact
router.use('/genshin/characters', Route1)
router.use('/genshin/artifacts', Route2)
router.use('/genshin/food', Route3)
router.use('/genshin/potions', Route4)
router.use('/genshin/domains', Route5)
router.use('/genshin/elements', Route6)
router.use('/genshin/enemies', Route7)
router.use('/genshin/materials', Route8)
router.use('/genshin/nations', Route9)
router.use('/genshin/weapons', Route10)

export default router