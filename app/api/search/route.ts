import { type NextRequest, NextResponse } from 'next/server';
import { requests } from 'recombee-api-client';
import { client } from '@/utils/recombee';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const userId = searchParams.get('userId');

  try {
    const result = await client.send(
      new requests.SearchItems(userId ?? '', q ?? '', 20, {
        returnProperties: true,
        cascadeCreate: true,
      })
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Recombee search request failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 502 }
    );
  }
}
