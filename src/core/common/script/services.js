import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'

import Services from '../../../models/services.js'
import configuration from '../../../models/configuration.js'

export async function seedServices(count = 100) {
  const serviceTypeConfigs = await configuration.find(
    { configurationType: 'Campaign' },
    '_id'
  )

  if (serviceTypeConfigs.length === 0) {
    console.log(
      '❌ No Service Type configurations found. Please seed them first.'
    )
    return
  }

  const services = []

  for (let i = 0; i < count; i++) {
    const serviceType = faker.helpers.arrayElement(serviceTypeConfigs)

    services.push({
      name: faker.company.name(),
      code: `SRV-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
      isActive: faker.datatype.boolean(),
      isDeleted: false,
      isArchive: false,
      serviceType: serviceType._id,
      file: faker.datatype.boolean() ? faker.system.filePath() : undefined,
      description: faker.lorem.sentence(),
      benificiary: faker.person.fullName(),
      campaigns: faker.company.catchPhrase(),
      engagement: faker.word.verb(),
      eventAttanded: faker.word.words({ min: 2, max: 4 }),
      fundingInterest: faker.company.buzzPhrase(),
      fundraisingActivities: faker.word.words(3),
    })
  }

  await Services.insertMany(services)
  console.log(`✅ Inserted ${count} service documents with realistic data.`)
}
