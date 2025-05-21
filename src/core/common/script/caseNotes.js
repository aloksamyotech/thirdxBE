import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import configuration from '../../../models/configuration.js'
import CaseNote from '../../../models/caseNote.js'

export async function seedCaseNotes(count = 1000) {
  const configurations = await configuration.find({}, '_id')
  const configurationIds = configurations.map((conf) => conf._id)

  if (configurationIds.length === 0) {
    console.log('❌ No configurations found. Please seed them first.')
    return
  }

  const dummyCaseId = new mongoose.Types.ObjectId()
  const caseNotes = []

  for (let i = 0; i < count; i++) {
    const configId = faker.helpers.arrayElement(configurationIds)

    caseNotes.push({
      caseId: dummyCaseId,
      date: faker.date.recent({ days: 30 }),
      configurationId: configId,
      subject: faker.lorem.words({ min: 2, max: 6 }),
      time: faker.date.recent().toTimeString().split(' ')[0].slice(0, 5),
      note: faker.lorem.paragraph(),
      access: faker.datatype.boolean(),
      file: faker.datatype.boolean() ? faker.system.filePath() : null,
      isActive: true,
      isDeleted: false,
      isArchive: false,
    })
  }

  await CaseNote.insertMany(caseNotes)
  console.log(
    `✅ Successfully inserted ${count} case notes with realistic data.`
  )
}
