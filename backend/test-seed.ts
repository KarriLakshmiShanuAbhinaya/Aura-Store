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

async function main() {
  console.log('Starting clear and seed...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });

  const office = await prisma.category.create({
    data: { name: 'Office Space', slug: 'office-space' },
  });

  console.log('Categories created:', [electronics.name, office.name]);

  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Acoustic Noise-Cancelling Headphones',
        slug: 'acoustic-noise-cancelling-headphones',
        description: 'Immersive sound with incredible noise cancellation. Matte black finish for a premium look and feel.',
        price: 299.99,
        images: ['/products/headphones.png'],
        categoryId: electronics.id,
        inStock: true,
        stockCount: 45,
      },
      {
        name: 'Aero Smartwatch Pro',
        slug: 'aero-smartwatch-pro',
        description: 'Track your health and stay connected with the Aero Smartwatch. Features a stunning OLED display and metal band.',
        price: 399.00,
        images: ['/products/smartwatch.png'],
        categoryId: electronics.id,
        inStock: true,
        stockCount: 120,
      },
      {
        name: 'Nexus Mechanical Keyboard V2',
        slug: 'nexus-mechanical-keyboard',
        description: 'Take your productivity to the next level with this 65% custom mechanical keyboard. Crisp tactile feedback and elegant design.',
        price: 159.50,
        images: ['/products/keyboard.png'],
        categoryId: office.id,
        inStock: true,
        stockCount: 20,
      },
      {
        name: 'ErgoMax Pro Office Chair',
        slug: 'ergomax-pro-office-chair',
        description: 'Designed for extreme comfort during long working sessions. Features adjustable lumbar support and breathable mesh.',
        price: 549.99,
        images: ['/products/chair.png'],
        categoryId: office.id,
        inStock: true,
        stockCount: 15,
      },
    ],
  });

  console.log('Products created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
