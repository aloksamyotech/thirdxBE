import { faker } from '@faker-js/faker'
import configuration from '../../../models/configuration.js'

export async function seedConfigurations(count = 1000) {
  const configurations = []

  const configTypes = [
    'Contact Type',
    'Referral Type',
    'Support Type',
    'Notification Type',
  ]

  for (let i = 0; i < count; i++) {
    configurations.push({
      name: faker.company.name() + ' ' + faker.word.noun(),
      isActive: faker.datatype.boolean(),
      isDeleted: false,
      isArchive: false,
      configurationType: faker.helpers.arrayElement(configTypes),
    })
  }

  await configuration.insertMany(configurations)
  console.log(
    `✅ Inserted ${count} configuration documents with realistic data.`
  )
}
