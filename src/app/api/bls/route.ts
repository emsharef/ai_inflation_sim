import { NextRequest, NextResponse } from 'next/server';

const BLS_API_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(BLS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'BLS API request failed', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('BLS API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
