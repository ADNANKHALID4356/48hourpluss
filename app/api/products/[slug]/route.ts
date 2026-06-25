// app/api/products/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{ slug: string }> | { slug: string };
}

// GET: Fetch product by slug
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

// DELETE: Remove product and cascaded relations from Supabase
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    
    // Deletes product; Prisma will cascade delete matching reviews, images, and ingredients
    await prisma.product.delete({
      where: { slug: resolvedParams.slug },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete product API error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}