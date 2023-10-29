import mongoose from 'mongoose'

export async function connectDB() {
    try {
        const dbUri = process.env.MONGODB_URI
        if (!dbUri) throw new Error('MONGODB_URI is not defined')
        await mongoose.connect(dbUri, { appName: 'api.thenolle.com', authSource: 'api-thenolle-com' })
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Could not connect to MongoDB', error)
    }
}

export default mongoose