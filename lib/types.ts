// lib/types.ts

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5 stars
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  categorySlug: string; // references Category.slug
  description: string;
  ingredients: string[];
  images: string[]; // relative paths or cloud URLs
  reviews: Review[];
  stock: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Offer {
  id: string;
  code: string; // e.g., "SUMMER10"
  discountType: 'percentage' | 'fixed';
  value: number; // e.g., 10 for 10% or $10
  isActive: boolean;
  expiresAt?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string; // e.g., "/products/hydrating-hyaluronic-serum"
  order: number;
  isActive: boolean;
}

// Master schema for the JSON-file database
export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  offers: Offer[];
  heroSlides: HeroSlide[];
}