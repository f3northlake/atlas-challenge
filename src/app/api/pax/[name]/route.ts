import { NextRequest, NextResponse } from 'next/server';
import { getPaxSubmissions } from '@/lib/sheets';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const paxName = decodeURIComponent(name);
    const submissions = await getPaxSubmissions(paxName);
    return NextResponse.json({ submissions });
  } catch (err) {
    console.error('Pax submissions error:', err);
    return NextResponse.json({ error: 'Failed to load submissions' }, { status: 500 });
  }
}
