import { PrismaClient } from '@prisma/client';
import { mockLots } from '../src/lib/data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  const count = await prisma.lot.count();
  if (count > 0) {
    console.log(`Already has ${count} lots, skipping seed.`);
    return;
  }
  for (const lot of mockLots) {
    await prisma.lot.create({
      data: {
        id: lot.id,
        title: lot.title,
        description: lot.description,
        price: lot.price,
        currency: lot.currency || 'UZS',
        category: lot.category,
        images: lot.images,
        characteristics: lot.characteristics as any,
        cooperationLink: lot.cooperationLink || '',
        cooperationPrice: lot.cooperationPrice ?? null,
        stock: lot.stock,
        minOrder: lot.minOrder,
        maxOrder: lot.maxOrder,
        isActive: lot.isActive,
      },
    });
  }
  console.log(`Seeded ${mockLots.length} lots.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
