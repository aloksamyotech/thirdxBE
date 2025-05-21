import configuration from '../../../models/configuration.js'

export async function seedConfigurations(count = 5000) {
  const configurations = []

  for (let i = 0; i < count; i++) {
    configurations.push({
      name: `Config ${i + 1}`,
      isActive: true,
      isDeleted: false,
      isArchive: false,
      configurationType: ['Contact Type', 'Referral Type', 'Contact Type'][
        i % 3
      ],
    })
  }

  await configuration.insertMany(configurations)
  console.log(`Inserted ${count} configuration documents.`)
}
