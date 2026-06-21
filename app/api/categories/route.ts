// app/api/categories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getCategories, saveCategory } from '@/lib/db';
import { Category } from '@/lib/types';

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Missing parameters name or slug' }, { status: 400 });
    }

    const category: Category = {
      id: body.id || `cat_${Date.now()}`,
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      image: body.image || ''
    };

    const saved = await saveCategory(category);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
  }
}