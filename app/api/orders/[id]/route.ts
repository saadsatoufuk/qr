import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Notification from '@/models/Notification';
import Restaurant from '@/models/Restaurant';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const order = await Order.findById(params.id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

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

    const order = await Order.findOneAndUpdate(
      { _id: params.id, restaurantId },
      { $set: body },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Create notification for cancellation
    if (body.status === 'cancelled') {
      const restaurant = await Restaurant.findById(restaurantId);
      await Notification.create({
        restaurantId,
        type: 'order_cancelled',
        title: `Order Cancelled — Table ${order.tableNumber}`,
        body: `${order.orderNumber} has been cancelled`,
        orderId: order._id,
        tableNumber: order.tableNumber,
        isRead: false,
      });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
