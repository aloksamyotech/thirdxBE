import { faker } from '@faker-js/faker'
import mongoose from 'mongoose'

import Services from '../../../models/services.js'
import configuration from '../../../models/configuration.js'

// If you have a tag model, uncomment this line and fetch tag IDs below
// import Tag from '../../../models/tag.js'

export async function seedServices(count = 100) {
  // Fetch available service types from configuration
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

  // Optional: Fetch tag IDs if you have any in the DB
  // const tagIds = (await Tag.find({}, '_id')).map(tag => tag._id)

  const services = []

  for (let i = 0; i < count; i++) {
    const serviceType = faker.helpers.arrayElement(serviceTypeConfigs)

    services.push({
      name: faker.company.name(),
      code: `SRV-${faker.string.alphanumeric({ length: 6, casing: 'upper' })}`,
      isActive: true,
      isDeleted: false,
      isArchive: false,
      serviceType: serviceType._id,
      file: "https://dev.thirdex.application-dev.site/static/media/UserProfile.d74dc426a664c501269f.png",
      description: faker.lorem.sentence(),

      // Assign empty arrays; or use tagIds if you want to populate them
      benificiary: [],
      campaigns: [],
      engagement: [],
      eventAttanded: [],
      fundingInterest: [],
      fundraisingActivities: [],
    })
  }

  await Services.insertMany(services)
  console.log(`✅ Inserted ${count} service documents with realistic data.`)
}
