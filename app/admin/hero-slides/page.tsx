// app/admin/hero-slides/page.tsx

import { prisma } from '@/lib/db';
import SlideManagerClient from '@/components/admin/SlideManagerClient';

export const dynamic = 'force-dynamic';

export default async function AdminHeroSlidesPage() {
  // Query Supabase directly for both active and draft slides
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' },
  });

  // Map database Decimals/Nulls to matching clean TypeScript interfaces
  const formattedSlides = slides.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle || undefined,
    imageUrl: s.imageUrl,
    linkUrl: s.linkUrl || undefined,
    order: s.order,
    isActive: s.isActive,
  }));

  return <SlideManagerClient initialSlides={formattedSlides} />;
}