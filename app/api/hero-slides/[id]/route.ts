// app/api/hero-slides/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }> | { id: string };
}

// DELETE: Remove a specific slide by ID from Supabase
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    
    await prisma.heroSlide.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete slide API error:', error);
    return NextResponse.json({ error: 'Failed to delete slide record' }, { status: 500 });
  }
}