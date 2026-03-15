import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Table from '@/models/Table';
import Restaurant from '@/models/Restaurant';
import Notification from '@/models/Notification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const restaurantId = (session.user as any).restaurantId;
    const { searchParams } = request.nextUrl;

    const filter: any = { restaurantId };

    // Status filter (comma-separated)
    const status = searchParams.get('status');
    if (status) {
      filter.status = { $in: status.split(',') };
    }

    // Date range
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // Table number search
    const tableSearch = searchParams.get('table');
    if (tableSearch) filter.tableNumber = tableSearch;

    // Order number search
    const orderSearch = searchParams.get('orderNumber');
    if (orderSearch) filter.orderNumber = { $regex: orderSearch, $options: 'i' };

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const { slug, tableNumber, items, customerName, paymentMethod, notes } = body;

    if (!slug || !tableNumber || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const restaurant = await Restaurant.findOne({ slug });
    if (!restaurant) return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    if (!restaurant.isOpen) return NextResponse.json({ error: 'Restaurant is currently closed' }, { status: 400 });

    const table = await Table.findOne({ restaurantId: restaurant._id, tableNumber, isActive: true });
    if (!table) return NextResponse.json({ error: 'Invalid table' }, { status: 400 });

    // Generate order number
    const lastOrder = await Order.findOne({ restaurantId: restaurant._id }).sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastOrder?.orderNumber) {
      const match = lastOrder.orderNumber.match(/ORD-(\d+)/);
      if (match) nextNum = parseInt(match[1]) + 1;
    }
    const orderNumber = `ORD-${String(nextNum).padStart(4, '0')}`;

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      restaurantId: restaurant._id,
      orderNumber,
      tableId: table._id,
      tableNumber: table.tableNumber,
      tableLabel: table.label,
      customerName: customerName || null,
      items,
      subtotal,
      status: 'pending',
      paymentMethod: paymentMethod || 'cash',
      notes: notes || '',
    });

    // Create notification
    const itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
    await Notification.create({
      restaurantId: restaurant._id,
      type: 'new_order',
      title: `New Order — Table ${table.tableNumber}`,
      body: `${orderNumber} · ${itemCount} items · ${subtotal} ${restaurant.currencySymbol}`,
      orderId: order._id,
      tableNumber: table.tableNumber,
      isRead: false,
    });

    return NextResponse.json({
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        tableNumber: order.tableNumber,
      },
      estimatedWaitMinutes: restaurant.estimatedWaitMinutes,
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
