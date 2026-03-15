import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

export async function GET() {
  try {
    await dbConnect();
    const restaurant = await Restaurant.findOne({}).lean();
    return NextResponse.json({ setupComplete: !!restaurant });
  } catch {
    return NextResponse.json({ setupComplete: false });
  }
}
