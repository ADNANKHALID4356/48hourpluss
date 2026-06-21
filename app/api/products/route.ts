// app/api/products/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/db';

interface RouteParams {
  params: Promise<{ slug: string }> | { slug: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const product = await getProductBySlug(resolvedParams.slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
  }
}