// lib/db.ts (Initialization block)

import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import { Product, Category, Offer, HeroSlide } from './types';

// Dynamically generate the absolute path to prisma/dev.db
const absoluteDbPath = path.resolve(process.cwd(), 'prisma', 'dev.db');

// Instantiate the Prisma 7 SQLite adapter using the identical absolute path
const adapter = new PrismaBetterSqlite3({ url: absoluteDbPath });

// Initialize PrismaClient with the driver adapter
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/* ==========================================================================
   PRODUCTS CRUD (PRISMA IMPLEMENTATION)
   ========================================================================== */
// ... keep all other functions (getProducts, saveProduct, etc.) exactly the same below

export async function getProducts(options?: { categorySlug?: string; includeInactive?: boolean }): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: {
      isActive: options?.includeInactive ? undefined : true,
      categorySlug: options?.categorySlug || undefined,
    },
    include: {
      images: true,
      ingredients: true,
      reviews: true,
    },
  });

  // Map database relational schemas to application TypeScript Interfaces
  return dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    categorySlug: p.categorySlug,
    description: p.description,
    stock: p.stock,
    isActive: p.isActive,
    images: p.images.map((img) => img.url),
    ingredients: p.ingredients.map((ing) => ing.name),
    reviews: p.reviews.map((rev) => ({
      id: rev.id,
      author: rev.author,
      rating: rev.rating,
      comment: rev.comment,
      date: rev.date,
    })),
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      ingredients: true,
      reviews: true,
    },
  });

  if (!p) return undefined;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    categorySlug: p.categorySlug,
    description: p.description,
    stock: p.stock,
    isActive: p.isActive,
    images: p.images.map((img) => img.url),
    ingredients: p.ingredients.map((ing) => ing.name),
    reviews: p.reviews.map((rev) => ({
      id: rev.id,
      author: rev.author,
      rating: rev.rating,
      comment: rev.comment,
      date: rev.date,
    })),
  };
}

export async function saveProduct(product: Product): Promise<Product> {
  await prisma.product.upsert({
    where: { slug: product.slug },
    update: {
      name: product.name,
      price: product.price,
      categorySlug: product.categorySlug,
      description: product.description,
      stock: product.stock,
      isActive: product.isActive,
      // Clear and re-create relational records for simplicity during update operations
      images: {
        deleteMany: {},
        create: product.images.map((url) => ({ url })),
      },
      ingredients: {
        deleteMany: {},
        create: product.ingredients.map((name) => ({ name })),
      },
    },
    create: {
      name: product.name,
      slug: product.slug,
      price: product.price,
      categorySlug: product.categorySlug,
      description: product.description,
      stock: product.stock,
      isActive: product.isActive,
      images: {
        create: product.images.map((url) => ({ url })),
      },
      ingredients: {
        create: product.ingredients.map((name) => ({ name })),
      },
    },
  });

  return product;
}

/* ==========================================================================
   CATEGORIES CRUD (PRISMA IMPLEMENTATION)
   ========================================================================== */

export async function getCategories(): Promise<Category[]> {
  const dbCategories = await prisma.category.findMany();
  return dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || undefined,
    image: c.image || undefined,
  }));
}

export async function saveCategory(category: Category): Promise<Category> {
  await prisma.category.upsert({
    where: { slug: category.slug },
    update: {
      name: category.name,
      description: category.description || null,
      image: category.image || null,
    },
    create: {
      name: category.name,
      slug: category.slug,
      description: category.description || null,
      image: category.image || null,
    },
  });

  return category;
}

/* ==========================================================================
   OFFERS CRUD (PRISMA IMPLEMENTATION)
   ========================================================================== */

export async function getOffers(): Promise<Offer[]> {
  const dbOffers = await prisma.offer.findMany();
  return dbOffers.map((o) => ({
    id: o.id,
    code: o.code,
    discountType: o.discountType as 'percentage' | 'fixed',
    value: o.value,
    isActive: o.isActive,
    expiresAt: o.expiresAt || undefined,
  }));
}

/* ==========================================================================
   HERO SLIDES CRUD (PRISMA IMPLEMENTATION)
   ========================================================================== */

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const dbSlides = await prisma.heroSlide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return dbSlides.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle || undefined,
    imageUrl: s.imageUrl,
    linkUrl: s.linkUrl || undefined,
    order: s.order,
    isActive: s.isActive,
  }));
}