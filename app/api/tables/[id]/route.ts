import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Table from '@/models/Table';
import { generateQRCode } from '@/lib/qrcode';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await request.json();
    const restaurantId = (session.user as any).restaurantId;
    const slug = (session.user as any).restaurantSlug;

    // Regenerate QR if table number changed
    if (body.tableNumber) {
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
      const baseUrl = `${protocol}://${host}`;
      const qrTargetUrl = `${baseUrl}/menu/${slug}?table=${body.tableNumber}`;
      body.qrCodeDataUrl = await generateQRCode(qrTargetUrl);
      body.qrTargetUrl = qrTargetUrl;
    }

    const table = await Table.findOneAndUpdate(
      { _id: params.id, restaurantId },
      { $set: body },
      { new: true }
    );

    if (!table) return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    return NextResponse.json({ table });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update table' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    await Table.findOneAndDelete({ 
      _id: params.id, 
      restaurantId: (session.user as any).restaurantId 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete table' }, { status: 500 });
  }
}
