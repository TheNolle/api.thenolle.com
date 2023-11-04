import express from 'express'
import Canvas from 'canvas'

const router = express.Router()

/**
 * @swagger
 * /generate/image:
 *   get:
 *     summary: Generate an image.
 *     tags: [Generate]
 *     parameters:
 *       - in: query
 *         name: width
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5000
 *           example: 500
 *           default: 500
 *         description: Width of the image.
 *       - in: query
 *         name: height
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 5000
 *           example: 500
 *           default: 500
 *         description: Height of the image.
 *       - in: query
 *         name: fontSize
 *         required: false
 *         schema:
 *           type: number
 *           minimum: 1
 *           maximum: 256
 *           example: 48
 *           default: 48
 *         description: Font size of the text.
 *       - in: query
 *         name: font
 *         required: false
 *         schema:
 *           type: string
 *           example: sans-serif
 *           default: sans-serif
 *         description: Font of the text.
 *       - in: query
 *         name: backgroundColor
 *         required: false
 *         schema:
 *           type: string
 *           example: 000000
 *           default: 000000
 *         description: Background color of the image.
 *       - in: query
 *         name: textColor
 *         required: false
 *         schema:
 *           type: string
 *           example: ffffff
 *           default: ffffff
 *         description: Text color of the text.
 *       - in: query
 *         name: text
 *         required: false
 *         schema:
 *           type: string
 *           example: Nolly's API
 *           default: Nolly's API
 *         description: Text to display in the image.
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           example: png
 *           default: png
 *         description: Type of the image.
 *         enum: [png, jpg, jpeg, webp, bmp]
 *     responses:
 *       200:
 *         description: The generated image.
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *               example: Buffer
 *               description: The generated image.
 *       500:
 *         description: Server error generating the image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Failed to generate image.
 */
router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const width: number = Number(request.query.width) > 1 ? Number(request.query.width) < 5000 ? Number(request.query.width) : 5000 : 500
        const height: number = Number(request.query.height) > 1 ? Number(request.query.height) < 5000 ? Number(request.query.height) : 5000 : 500
        const fontSize: number = Number(request.query.fontSize) > 1 ? Number(request.query.fontSize) < 256 ? Number(request.query.fontSize) : 256 : 48
        const font: string = String(request.query.font || 'sans-serif')
        const backgroundColor: string = String(request.query.backgroundColor || '000000')
        const textColor: string = String(request.query.textColor || 'ffffff')
        const text: string = String(request.query.text || 'Nolly\'s API')
        const type: string = String(['png', 'jpg', 'jpeg', 'webp', 'bmp'].includes(String(request.query.type)) ? request.query.type : 'png')
        const canvas: Canvas.Canvas = Canvas.createCanvas(width, height)
        const ctx: Canvas.CanvasRenderingContext2D = canvas.getContext('2d')
        ctx.fillStyle = `#${backgroundColor}`
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = `#${textColor}`
        ctx.font = `${fontSize}px ${font}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, width / 2, height / 2)
        const buffer: Buffer = canvas.toBuffer()
        response.set('Content-Type', `image/${type}`)
        response.send(buffer)
    } catch (error: any) {
        console.error(`Error generating image (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to generate image' })
    }
})

export default router