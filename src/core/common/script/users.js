import { faker } from '@faker-js/faker'
import user from '../../../models/user.js'
function generateIndianPhoneNumber() {
  const start = faker.helpers.arrayElement(['6', '7', '8', '9'])
  const number = faker.string.numeric(9)
  return `+91${start}${number}`
}
export async function seedUsers(count = 100) {
  const roles = ['service_user', 'volunteer', 'donor', 'user']
  const subRoles = ['donar_individual', 'donar_company', 'donar_group']

  const users = []

  for (let i = 0; i < count; i++) {
    const role = faker.helpers.arrayElement(roles)
    const subRole =
      role === 'donor' ? faker.helpers.arrayElement(subRoles) : undefined

    users.push({
      personalInfo: {
        title: faker.person.prefix(),
        firstName: faker.person.firstName(),
        middleName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        nickName: faker.person.firstName(),
        gender: faker.person.sex(),
        ethnicity: faker.helpers.arrayElement([
          'Asian',
          'Black',
          'White',
          'Mixed',
          'Other',
        ]),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 70, mode: 'age' }),
      },
      contactInfo: {
        homePhone: generateIndianPhoneNumber(),
        phone: generateIndianPhoneNumber(),
        email: faker.internet.email(),
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        town: faker.location.city(),
        district: faker.location.state(),
        postcode: faker.location.zipCode(),
        country: faker.location.country(),
        firstLanguage: faker.helpers.arrayElement([
          'English',
          'Spanish',
          'Hindi',
          'Mandarin',
        ]),
        otherId: faker.string.alphanumeric(10),
      },
      otherInfo: {
        file: faker.system.filePath(),
        description: faker.lorem.sentence(),
        benificiary: faker.person.fullName(),
        campaigns: faker.company.catchPhrase(),
        engagement: faker.word.verb(),
        eventAttanded: faker.word.words({ min: 2, max: 4 }),
        fundingInterest: faker.company.buzzPhrase(),
        fundraisingActivities: faker.word.words(3),
        restrictAccess: faker.datatype.boolean(),
      },
      emergencyContact: {
        title: faker.person.prefix(),
        gender: faker.person.sex(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        relationshipToUser: faker.helpers.arrayElement([
          'Parent',
          'Sibling',
          'Friend',
          'Spouse',
        ]),
        homePhone: generateIndianPhoneNumber(),
        phone: generateIndianPhoneNumber(),
        email: faker.internet.email(),
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.location.secondaryAddress(),
        country: faker.location.country(),
        town: faker.location.city(),
        postcode: faker.location.zipCode(),
      },
      contactPreferences: {
        preferredMethod: faker.helpers.arrayElement([
          'email',
          'phone',
          'sms',
          'whatsapp',
        ]),
        contactPurposes: faker.lorem.words(3),
        dateOfConfirmation: faker.date.recent(),
        reason: faker.lorem.sentence(),
        email: faker.internet.email(),
        phone: generateIndianPhoneNumber(),
        contactMethods: {
          telephone: generateIndianPhoneNumber(),
          email: faker.datatype.boolean(),
          sms: faker.datatype.boolean(),
          whatsapp: faker.datatype.boolean(),
          donor: faker.datatype.boolean(),
        },
      },
      companyInformation: {
        companyName: faker.company.name(),
        mainContactName: faker.person.fullName(),
        socialMediaLinks: faker.internet.url(),
        otherId: faker.string.uuid(),
        recruitmentCampaign: faker.company.catchPhrase(),
      },
      role,
      subRole,
      isActive: true,
      isDeleted: false,
      archive: false,
    })
  }

  await user.insertMany(users)
  console.log(`✅ Inserted ${count} user documents with realistic data.`)
}
