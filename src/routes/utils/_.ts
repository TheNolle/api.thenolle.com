import express from 'express'

import Route1 from './shorten-url'
import Route2 from './markdown-html'
import Route3 from './weather'
import Route4 from './convert-currency'
import Route5 from './convert-unit'
import Route6 from './text-sentiment-analysis'
import Route7 from './reverse-string'
import Route8 from './case-converters'
import Route9 from './encode-decode'
import Route10 from './timestamp-converter'
import Route11 from './timezone-converter'
import Route12 from './days-until'
import Route13 from './url-parser'
import Route14 from './http-header-checker'
import Route15 from './ssl-checker'
import Route16 from './syntax-highlighter'
import Route17 from './json-formatter'
import Route18 from './json-minifier'
import Route19 from './regex-tester'

const router = express.Router()

router.use('/shorten-url', Route1)
router.use('/markdown-html', Route2)
router.use('/weather', Route3)
router.use('/convert-currency', Route4)
router.use('/convert-unit', Route5)
router.use('/text-sentiment-analysis', Route6)
router.use('/reverse-string', Route7)
router.use('/case-converters', Route8)
router.use('/encode-decode', Route9)
router.use('/timestamp-converter', Route10)
router.use('/timezone-converter', Route11)
router.use('/days-until', Route12)
router.use('/url-parser', Route13)
router.use('/http-header-checker', Route14)
router.use('/ssl-checker', Route15)
router.use('/syntax-highlighter', Route16)
router.use('/json-formatter', Route17)
router.use('/json-minifier', Route18)
router.use('/regex-tester', Route19)

export default router