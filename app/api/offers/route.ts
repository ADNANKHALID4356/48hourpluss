// app/api/offers/route.ts

import { NextResponse } from 'next/server';
import { getOffers } from '@/lib/db';

export async function GET() {
  try {
    const offers = await getOffers();
    return NextResponse.json(offers, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}