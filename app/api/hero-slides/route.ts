// app/api/hero-slides/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomUUID } from 'crypto';

// GET: Retrieve all active hero slides (used by homepage)
export async function GET() {
  try {
    const dbSlides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(dbSlides, { status: 200 });
  } catch (error) {
    console.error('Fetch slides API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve slides' }, { status: 500 });
  }
}

// POST: Create or update a hero slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: 'Missing required parameters: title and imageUrl' }, { status: 400 });
    }

    const slideId = body.id || randomUUID();

    const savedSlide = await prisma.heroSlide.upsert({
      where: { id: slideId },
      update: {
        title: body.title,
        subtitle: body.subtitle || null,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
      create: {
        id: slideId,
        title: body.title,
        subtitle: body.subtitle || null,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(savedSlide, { status: 201 });
  } catch (error) {
    console.error('Save slide API error:', error);
    return NextResponse.json({ error: 'Failed to save slide record' }, { status: 500 });
  }
}