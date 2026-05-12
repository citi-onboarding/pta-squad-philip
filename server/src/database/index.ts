import { PrismaClient } from 'generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

prisma
  .$connect()
  .then(() => {
    console.log("📦 Successfully connected with database")
  })
  .catch((error) => {
    console.log("❌ Error connecting to database", error)
  })

export default prisma