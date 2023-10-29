import express from 'express'
import { faker } from '@faker-js/faker'

const router = express.Router()

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        response.json({
            profileColor: faker.internet.color(),
            sex: faker.person.sex(),
            gender: faker.person.gender(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            birthdate: faker.date.recent({ days: 365 * 20, refDate: new Date() }),
            nationalId: faker.finance.creditCardNumber(),
            membership: ['Basic', 'Premium', 'Gold'][Math.floor(Math.random() * 3)],
            username: faker.internet.userName(),
            email: faker.internet.email(),
            avatar: faker.image.avatar(),
            bio: faker.lorem.sentences(2),
            address: {
                street: faker.location.street(),
                city: faker.location.city(),
                country: faker.location.country(),
                zipcode: faker.location.zipCode()
            },
            phone: faker.phone.number(),
            website: faker.internet.url(),
            company: {
                name: faker.company.name(),
                catchPhrase: faker.company.catchPhrase(),
                jobTitle: faker.person.jobTitle(),
            },
            social: {
                x: `@${faker.internet.userName()}`,
                instagram: `@${faker.internet.userName()}`,
                linkedin: `${faker.internet.userName()}`
            },
        })
    } catch (error: any) {
        console.error(`Error generating user data (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ message: 'Error generating user data' })
    }
})

export default router