import { faker } from '@faker-js/faker'
import Services from '../../../models/services.js'
import user from '../../../models/user.js'
import Case from '../../../models/cases.js'

export async function seedCases(count = 100) {
  const serviceUsers = await user.find({ role: 'service_user' }).select('_id')
  const services = await Services.find().select('_id serviceType')

  if (!serviceUsers.length || !services.length) {
    console.error('❌ No service users or services found. Seed them first.')
    return
  }

  const cases = []

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(serviceUsers)
    const service = faker.helpers.arrayElement(services)

    const caseOpened = faker.date.past({ years: 2 })
    const caseClosed = faker.datatype.boolean()
      ? faker.date.between({ from: caseOpened, to: new Date() })
      : null

    cases.push({
      serviceUserId: user._id,
      serviceId: service._id,
      serviceType: faker.helpers.arrayElement([
        'Medical',
        'Education',
        'Mental Health',
        'Housing',
      ]),
      serviceStatus: faker.helpers.arrayElement([
        'Active',
        'Completed',
        'Pending',
        'Closed',
      ]),
      caseOpened,
      caseClosed,
      benificiary: faker.person.fullName(),
      campaigns: faker.company.catchPhrase(),
      engagement: faker.word.verb(),
      eventAttanded: faker.lorem.words({ min: 1, max: 3 }),
      fundingInterest: faker.finance.accountName(),
      fundraisingActivities: faker.lorem.words(2),
      file: faker.system.filePath(),
      description: faker.lorem.paragraph(),
      isDeleted: false,
      isArchive: false,
      isActive: true,
    })
  }

  await Case.insertMany(cases)
  console.log(`✅ Inserted ${count} case documents.`)
}
