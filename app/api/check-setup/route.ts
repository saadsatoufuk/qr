import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { getTenant } from '@/lib/getTenant';

export async function GET(request: NextRequest) {
  try {
    const host = request.headers.get('host');
    const tenant = getTenant(host);

    if (!tenant) {
      return NextResponse.json({ setupComplete: false });
    }

    await dbConnect();
    const restaurant = await Restaurant.findOne({ slug: tenant }).lean();
    return NextResponse.json({ setupComplete: !!restaurant });
  } catch {
    return NextResponse.json({ setupComplete: false });
  }
}
