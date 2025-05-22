import { faker } from '@faker-js/faker'
import Session from '../../../models/session.js'
import Services from '../../../models/services.js'

export async function seedSessions(count = 100) {
  const sessions = []

  const services = await Services.find({}, '_id')
  if (!services.length) {
    console.warn('⚠️ No services found. Please seed services first.')
    return
  }

  for (let i = 0; i < count; i++) {
    const randomService = faker.helpers.arrayElement(services)

    sessions.push({
      name: faker.company.name(),
      country: faker.location.country(),
      isActive: true,
      isDeleted: false,
      isArchive: false,
      file: faker.system.filePath(),
      description: faker.lorem.sentence(),
      benificiary: faker.person.fullName(),
      campaigns: faker.company.catchPhrase(),
      engagement: faker.word.words(2),
      eventAttanded: faker.company.buzzPhrase(),
      fundingInterest: faker.finance.accountName(),
      fundraisingActivities: faker.word.words(3),
      time: faker.date
        .anytime()
        .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      date: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }),
      serviceId: randomService._id,
    })
  }

  await Session.insertMany(sessions)
  console.log(`✅ Inserted ${count} session documents.`)
}
