import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const restaurant = await Restaurant.findById((session.user as any).restaurantId).select('-adminPasswordHash');
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json({ restaurant });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Don't allow updating sensitive fields
    delete body.adminPasswordHash;
    delete body.adminEmail;
    delete body.slug;
    delete body._id;

    const restaurant = await Restaurant.findByIdAndUpdate(
      (session.user as any).restaurantId,
      { $set: body },
      { new: true }
    ).select('-adminPasswordHash');

    return NextResponse.json({ restaurant });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
