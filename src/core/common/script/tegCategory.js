import { faker } from '@faker-js/faker'
import tagCategory from '../../../models/tagCategory.js'

export async function seedTagCategories(count = 10) {
  const categories = []

  for (let i = 0; i < count; i++) {
    const categoryName = faker.lorem.word() + ' Category'

    const tags = Array.from({
      length: faker.number.int({ min: 2, max: 5 }),
    }).map(() => ({
      categoryName,
      name: faker.word.adjective() + ' Tag',
      isActive: true,
      startDate: faker.date.past({ years: 1 }),
      endDate: faker.date.future({ years: 1 }),
      isDeleted: false,
      isArchive: false,
      note: faker.lorem.sentence(),
    }))

    categories.push({
      name: categoryName,
      tagsCanBeAppliedTo: faker.helpers.arrayElements([
        'user',
        'case',
        'campaign',
        'event',
      ]),
      isActive: true,
      isDeleted: false,
      isArchive: false,
      tags,
    })
  }

  await tagCategory.insertMany(categories)
  console.log(`✅ Inserted ${count} tag categories with embedded tags.`)
}
