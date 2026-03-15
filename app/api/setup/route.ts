import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Check if restaurant already exists
    const existing = await Restaurant.findOne();
    if (existing) {
      return NextResponse.json({ error: 'Restaurant already set up' }, { status: 400 });
    }

    const body = await request.json();
    const { name, slug, description, address, currency, currencySymbol, email, password, primaryColor, logo, coverImage } = body;

    if (!name || !slug || !email || !password) {
      return NextResponse.json({ error: 'Name, slug, email, and password are required' }, { status: 400 });
    }

    const adminPasswordHash = await bcrypt.hash(password, 12);

    const restaurant = await Restaurant.create({
      name,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: description || '',
      address: address || '',
      currency: currency || 'SAR',
      currencySymbol: currencySymbol || 'ر.س',
      primaryColor: primaryColor || '#D4A853',
      logo: logo || '',
      coverImage: coverImage || '',
      adminEmail: email,
      adminPasswordHash,
    });

    return NextResponse.json({ restaurant: { id: restaurant._id, slug: restaurant.slug, name: restaurant.name } }, { status: 201 });
  } catch (error: any) {
    console.error('Setup error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Slug or email already in use' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to set up restaurant' }, { status: 500 });
  }
}
