// // Minimal product data to support routing for now.
// // This will be replaced by the full Product/Category data model
// // (and eventually a database) in a later roadmap step — see ROADMAP.md.

// export interface Product {
//   slug: string
//   name: string
//   tagline: string
//   shortDescription: string
//   heroImage: string
// }

// export const products: Product[] = [
//   {
//     slug: "48-hours-plus-herbal-honey",
//     name: "48 Hours Plus Herbal Honey",
//     tagline: "Natural Male Enhancement Revolution",
//     shortDescription:
//       "Premium Turkish Herbal Formula with 9 Powerful Natural Ingredients. Honey-based delivery system for maximum absorption and 48-hour effectiveness.",
//     heroImage: "/images/product-main.png",
//   },
// ]

// export function getProductBySlug(slug: string): Product | undefined {
//   return products.find((p) => p.slug === slug)
// }

// export function getAllProductSlugs(): string[] {
//   return products.map((p) => p.slug)
// }










// lib/products.ts

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string; // e.g., "$29.99" or "Rs. 2,500"
  category: string;
  description: string;
  ingredients: string[];
  images: string[]; // URLs or paths
  reviews: Review[];
}

export const WHATSAPP_NUMBER = "923001234567"; // Replace with your actual WhatsApp business number (include country code, no + or spaces)

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Hydrating Hyaluronic Serum",
    slug: "hydrating-hyaluronic-serum",
    price: "$24.99",
    category: "Skincare",
    description: "A lightweight, fast-absorbing serum designed to deeply hydrate and plump the skin. Formulated with multi-molecular weight hyaluronic acid to target multiple layers of skin hydration.",
    ingredients: [
      "Hyaluronic Acid (Multi-Molecular)",
      "Provitamin B5 (Panthenol)",
      "Glycerin",
      "Allantoin",
      "Deionized Water"
    ],
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80"
    ],
    reviews: [
      { id: "r1", author: "Sarah M.", rating: 5, comment: "Left my skin incredibly plump and soft. Will buy again!", date: "2026-05-12" },
      { id: "r2", author: "John D.", rating: 4, comment: "Very hydrating, though a bit sticky if you apply too much.", date: "2026-06-01" }
    ]
  },
  {
    id: "2",
    name: "Organic Matcha Powder",
    slug: "organic-matcha-powder",
    price: "19.99",
    category: "Wellness",
    description: "Ceremonial grade organic green tea powder sourced directly from Uji, Japan. Rich in antioxidants and provides a smooth, sustained energy boost without the jitters.",
    ingredients: [
      "100% Organic Stone-Ground Green Tea Leaves (Matcha)"
    ],
    images: [
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=600&auto=format&fit=crop&q=80"
    ],
    reviews: [
      { id: "r3", author: "Emily R.", rating: 5, comment: "The color is vibrant green and the taste is incredibly smooth.", date: "2026-04-20" }
    ]
  },
  {
    id: "3",
    name: "Vitamin C Glow Cream",
    slug: "vitamin-c-glow-cream",
    price: "$28.00",
    category: "Skincare",
    description: "An ultra-brightening daily moisturizer packed with stabilized Vitamin C and Ferulic Acid to combat dullness and protect against environmental stressors.",
    ingredients: [
      "Stabilized Vitamin C (L-Ascorbic Acid)",
      "Ferulic Acid",
      "Vitamin E",
      "Shea Butter",
      "Orange Peel Extract"
    ],
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80"
    ],
    reviews: [
      { id: "r4", author: "Alex K.", rating: 4, comment: "Brightens up my face nicely in the morning.", date: "2026-05-28" }
    ]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(PRODUCTS.map((p) => p.category)));
}