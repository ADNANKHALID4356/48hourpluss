// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Standalone script uses the unpooled connection URL for execution safety
const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database records...');
  await prisma.review.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.heroSlide.deleteMany();

  console.log('Seeding categories...');
  const skincare = await prisma.category.create({
    data: {
      name: 'Skincare',
      slug: 'skincare',
      description: 'Premium dermal hydrators.',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=80',
    },
  });

  const wellness = await prisma.category.create({
    data: {
      name: 'Wellness',
      slug: 'wellness',
      description: 'Organic dietary botanicals.',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=100&auto=format&fit=crop&q=80',
    },
  });

  console.log('Seeding products...');
  await prisma.product.create({
    data: {
      name: 'Hydrating Hyaluronic Serum',
      slug: 'hydrating-hyaluronic-serum',
      price: '$24.99',
      description: 'A lightweight serum designed to deeply hydrate and plump skin layers.',
      categorySlug: skincare.slug,
      stock: 50,
      isActive: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80' },
        ],
      },
      ingredients: {
        create: [
          { name: 'Hyaluronic Acid' },
          { name: 'Provitamin B5' },
          { name: 'Glycerin' },
        ],
      },
      reviews: {
        create: [
          { author: 'Sarah M.', rating: 5, comment: 'Plumped up my skin beautifully!', date: '2026-05-12' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Organic Matcha Powder',
      slug: 'organic-matcha-powder',
      price: '$19.99',
      description: 'Ceremonial grade organic green tea powder sourced directly from Uji, Japan.',
      categorySlug: wellness.slug,
      stock: 25,
      isActive: true,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80' },
        ],
      },
      ingredients: {
        create: [
          { name: '100% Ceremonial Matcha Green Tea' },
        ],
      },
    },
  });

  console.log('Seeding discount offers...');
  await prisma.offer.create({
    data: {
      code: 'HEALTH10',
      discountType: 'percentage',
      value: 10.0,
      isActive: true,
      expiresAt: '2026-12-31',
    },
  });

  console.log('Seeding hero slides...');
  await prisma.heroSlide.create({
    data: {
      title: 'Premium Clinical Formulations',
      subtitle: 'Discover organic Matcha and medical-grade Hyaluronic serums designed for targeted care.',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80',
      linkUrl: '/products/hydrating-hyaluronic-serum',
      order: 1,
      isActive: true,
    },
  });

  console.log('Database seeding successfully finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });