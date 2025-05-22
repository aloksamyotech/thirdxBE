import { faker } from '@faker-js/faker'
import tag from '../../../models/tags.js'


export async function seedTags(count = 100) {
  const tags = []

  for (let i = 0; i < count; i++) {
    const startDate = faker.date.between({ from: '2023-01-01', to: '2025-01-01' })
    const endDate = faker.date.between({ from: startDate, to: '2026-12-31' })

    tags.push({
      categoryName: faker.helpers.arrayElement([
        'Campaign',
        'Program',
        'Event',
        'Interest',
        'Activity',
      ]),
      name: faker.hacker.noun() + '-' + faker.string.alphanumeric(5),
      isActive: faker.datatype.boolean(),
      startDate,
      endDate,
      isDeleted: false,
      isArchive: false,
      note: faker.lorem.sentence(),
    })
  }

  await tag.insertMany(tags)
  console.log(`✅ Inserted ${count} tag documents.`)
}
