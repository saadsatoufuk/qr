import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { getTenant } from '@/lib/getTenant';

export async function POST(request: NextRequest) {
  try {
    const host = request.headers.get('host');
    const tenant = getTenant(host);

    if (!tenant) {
      return NextResponse.json({ error: 'Could not detect tenant' }, { status: 400 });
    }

    await dbConnect();

    // Check if restaurant already exists for THIS tenant
    const existing = await Restaurant.findOne({ slug: tenant });
    if (existing) {
      return NextResponse.json({ error: 'Restaurant already set up' }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, address, currency, currencySymbol, email, password, primaryColor, logo, coverImage } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const adminPasswordHash = await bcrypt.hash(password, 12);

    const restaurant = await Restaurant.create({
      name,
      slug: tenant, // Force slug to match subdomain
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

