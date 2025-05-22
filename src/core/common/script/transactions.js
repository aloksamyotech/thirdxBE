import { faker } from '@faker-js/faker'
import transaction from '../../../models/transaction.js'
import configuration from '../../../models/configuration.js'

export async function seedTransactions(count = 100) {
  const campaigns = await configuration.find({ configurationType: 'Campaign' }).select('_id')
  const paymentMethods = await configuration.find({ configurationType: 'Payment Method' }).select('_id')

  if (!campaigns.length || !paymentMethods.length) {
    console.log('⚠️ Please ensure campaigns and payment methods are seeded in configuration.')
    return
  }

  const transactions = []

  for (let i = 0; i < count; i++) {
    const amountPaid = faker.number.float({ min: 10, max: 500, precision: 0.01 })
    const processingCost = faker.number.float({ min: 0, max: 5, precision: 0.01 })

    transactions.push({
      assignedTo: faker.person.fullName(),
      campaign: faker.helpers.arrayElement(campaigns)._id,
      amountPaid,
      paymentMethod: faker.helpers.arrayElement(paymentMethods)._id,
      processingCost,
      currency: faker.finance.currencyCode(),
      receiptNumber: faker.string.uuid().slice(0, 8).toUpperCase(),
      transactionId: faker.string.uuid(),
      isDeleted: false,
      isArchive: false,
    })
  }

  await transaction.insertMany(transactions)
  console.log(`✅ Inserted ${count} transaction documents.`)
}
