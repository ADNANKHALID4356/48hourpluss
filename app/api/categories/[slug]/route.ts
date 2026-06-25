// app/api/categories/[slug]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{ slug: string }> | { slug: string };
}

// GET: Fetch category details by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const category = await prisma.category.findUnique({
      where: { slug: resolvedParams.slug },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal system error' }, { status: 500 });
  }
}

// DELETE: Remove category from Supabase
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    
    // Note: In Postgres, if products still belong to this category, deletion will fail 
    // unless you delete or reassign those products first, preventing orphaned listings.
    await prisma.category.delete({
      where: { slug: resolvedParams.slug },
    });

    return NextResponse.json({ success: true, message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete category API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category. Ensure no products are currently assigned to it first.' }, 
      { status: 500 }
    );
  }
}