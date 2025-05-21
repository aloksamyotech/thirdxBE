import mongoose from 'mongoose'
import { seedConfigurations } from './configurations.js'

const MONGO_URI =
  'mongodb+srv://amansamyotech:amansamyotech@cluster0.yos7pax.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

export async function runSeed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected.')

    await seedConfigurations()

    await mongoose.disconnect()
    console.log('MongoDB disconnected.')
  } catch (err) {
    console.error('Seeding failed:', err)
    await mongoose.disconnect()
  }
}

runSeed()
