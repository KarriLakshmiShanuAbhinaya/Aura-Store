import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

prisma.product.findMany({ include: { category: true } })
  .then(p => { console.log('Success:', p); })
  .catch(e => { console.error('Error:', e); })
  .finally(() => prisma.$disconnect());
