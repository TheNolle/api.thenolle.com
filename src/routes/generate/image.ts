import express from 'express'
import Canvas from 'canvas'

const router = express.Router()

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