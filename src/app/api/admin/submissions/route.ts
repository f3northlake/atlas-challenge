export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getAllSubmissions } from '@/lib/sheets';

export async function GET() {
  try {
    const submissions = await getAllSubmissions();
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('Admin submissions error:', err);
    return NextResponse.json({ error: 'Failed to load submissions' }, { status: 500 });
  }
}
