import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Table from '@/models/Table';
import { Types } from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const restaurantId = (session.user as any).restaurantId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [todayOrders, revenue, activeTables, totalTables] = await Promise.all([
      Order.countDocuments({
        restaurantId,
        createdAt: { $gte: startOfDay },
        status: { $ne: 'cancelled' },
      }),
      Order.aggregate([
        {
          $match: {
            restaurantId: { $eq: new Types.ObjectId(restaurantId) },
            createdAt: { $gte: startOfDay },
            status: { $ne: 'cancelled' },
          },
        },
        { $group: { _id: null, total: { $sum: '$subtotal' } } },
      ]),
      Order.distinct('tableId', {
        restaurantId,
        status: { $in: ['pending', 'confirmed', 'preparing'] },
      }),
      Table.countDocuments({ restaurantId, isActive: true }),
    ]);

    const totalRevenue = revenue[0]?.total || 0;
    const avgOrderValue = todayOrders > 0 ? totalRevenue / todayOrders : 0;

    return NextResponse.json({
      todayOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activeTables: activeTables.length,
      totalTables,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
