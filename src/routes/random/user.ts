import express from 'express'
import { faker } from '@faker-js/faker'

const router = express.Router()

/**
 * @swagger
 * /random/user:
 *   get:
 *     summary: Returns a randomly generated user profile.
 *     tags: [Random]
 *     responses:
 *       200:
 *         description: OK.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profileColor:
 *                   type: string
 *                   description: The profile color in hexadecimal format.
 *                   example: "#0059ff"
 *                 sex:
 *                   type: string
 *                   description: The sex of the user.
 *                   example: male
 *                 gender:
 *                   type: string
 *                   description: The gender of the user.
 *                   example: Genderfluid
 *                 firstName:
 *                   type: string
 *                   description: The first name of the user.
 *                   example: Sherlock
 *                 lastName:
 *                   type: string
 *                   description: The last name of the user.
 *                   example: Holmes
 *                 birthdate:
 *                   type: string
 *                   format: date
 *                   description: The birthdate of the user.
 *                   example: 2016-04-22
 *                 nationalId:
 *                   type: string
 *                   description: The national ID number of the user.
 *                   example: 6011-1234-5678-9012
 *                 membership:
 *                   type: string
 *                   description: The membership status of the user.
 *                   example: Basic
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                   example: "@sherlock"
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *                   example: sherlock.holmes@fakemail.net
 *                 avatar:
 *                   type: string
 *                   description: The avatar URL of the user.
 *                   example: https://api.thenolle.com/generate/image?width=425&height=75&text=Sherlock%20Holmes
 *                 bio:
 *                   type: string
 *                   description: The biography of the user.
 *                   example: I'm a consulting detective, if you need help, contact me.
 *                 address:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                       description: The street address of the user.
 *                       example: 221B Baker Street
 *                     city:
 *                       type: string
 *                       description: The city of the user.
 *                       example: London
 *                     country:
 *                       type: string
 *                       description: The country of the user.
 *                       example: United Kingdom
 *                     zipcode:
 *                       type: string
 *                       description: The zipcode of the user.
 *                       example: NW1 6XE
 *                 phone:
 *                   type: string
 *                   description: The phone number of the user.
 *                   example: +44 20 7946 0018
 *                 website:
 *                   type: string
 *                   description: The personal website URL of the user.
 *                   example: https://api.thenolle.com
 *                 company:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the user's company.
 *                       example: Nolly's Digital Café ☕
 *                     catchPhrase:
 *                       type: string
 *                       description: The catch phrase of the user's company.
 *                       example: A place to find the best APIs.
 *                     jobTitle:
 *                       type: string
 *                       description: The job title of the user at the company.
 *                       example: Random Employee
 *                 social:
 *                   type: object
 *                   properties:
 *                     x:
 *                       type: string
 *                       description: The social media handle of the user.
 *                       example: "@sherlock"
 *                     instagram:
 *                       type: string
 *                       description: The Instagram handle of the user.
 *                       example: "@sherlock"
 *                     linkedin:
 *                       type: string
 *                       description: The LinkedIn profile name of the user.
 *                       example: sherlock.holmes
 *       500:
 *         description: Error generating user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: Error generating user data
 */
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