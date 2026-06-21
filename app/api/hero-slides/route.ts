// app/api/hero-slides/route.ts

import { NextResponse } from 'next/server';
import { getHeroSlides } from '@/lib/db';

export async function GET() {
  try {
    const slides = await getHeroSlides();
    return NextResponse.json(slides, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve slides' }, { status: 500 });
  }
}