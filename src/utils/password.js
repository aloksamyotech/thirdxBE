import bcrypt from 'bcrypt'
const saltRounds = 10

export const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, saltRounds)
}

export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}
