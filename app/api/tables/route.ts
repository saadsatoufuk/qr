import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Table from '@/models/Table';
import { generateQRCode } from '@/lib/qrcode';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const tables = await Table.find({ 
      restaurantId: (session.user as any).restaurantId 
    }).sort({ tableNumber: 1 });

    return NextResponse.json({ tables });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();
    const restaurantId = (session.user as any).restaurantId;
    const slug = (session.user as any).restaurantSlug;

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;
    const qrTargetUrl = `${baseUrl}/menu/${slug}?table=${body.tableNumber}`;
    const qrCodeDataUrl = await generateQRCode(qrTargetUrl);

    const table = await Table.create({
      restaurantId,
      tableNumber: body.tableNumber,
      label: body.label || '',
      capacity: body.capacity || 4,
      qrCodeDataUrl,
      qrTargetUrl,
    });

    return NextResponse.json({ table }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Table number already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create table' }, { status: 500 });
  }
}
