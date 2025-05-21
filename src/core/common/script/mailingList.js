import { faker } from '@faker-js/faker';
import mail from '../../../models/mail';


const comparisonOperators = [
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
];

const logicOperators = ['AND', 'OR'];

const fieldsPool = ['name', 'status', 'type', 'dateCreated', 'category']; 

function generateRandomFilter() {
  return {
    logic: faker.helpers.arrayElement(logicOperators),
    field: faker.helpers.arrayElement(fieldsPool),
    comparison: faker.helpers.arrayElement(comparisonOperators),
    value: faker.helpers.arrayElement([
      faker.word.adjective(),
      faker.word.noun(),
      faker.number.int({ min: 1, max: 100 }),
      faker.date.recent().toISOString(),
      faker.helpers.arrayElement([true, false]),
    ]),
  };
}

export async function seedMailingLists(count = 5000) {
  const mailingLists = [];

  for (let i = 0; i < count; i++) {
    mailingLists.push({
      name: faker.company.name(),
      tags: faker.helpers.arrayElements(
        ['urgent', 'internal', 'marketing', 'external', 'news', 'support'],
        faker.number.int({ min: 1, max: 3 })
      ),
      channelSettings: faker.helpers.arrayElements(
        ['email', 'sms', 'push', 'webhook'],
        faker.number.int({ min: 1, max: 2 })
      ),
      purposeSettings: faker.helpers.arrayElements(
        ['notifications', 'marketing', 'alerts'],
        faker.number.int({ min: 1, max: 2 })
      ),
      includeArchived: faker.datatype.boolean(),
      isDeleted: false,
      isArchive: false,
      filters: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => generateRandomFilter()),
    });
  }

  await mail.insertMany(mailingLists);
  console.log(`✅ Inserted ${count} realistic mailing list documents.`);
}
