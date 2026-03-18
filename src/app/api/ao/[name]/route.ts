import { NextRequest, NextResponse } from 'next/server';
import { getAOData } from '@/lib/sheets';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const aoName = decodeURIComponent(name);
    const pax = await getAOData(aoName);
    return NextResponse.json({ pax });
  } catch (err) {
    console.error('AO data error:', err);
    return NextResponse.json({ error: 'Failed to load AO data' }, { status: 500 });
  }
}
