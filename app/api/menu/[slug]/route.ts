import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Category from '@/models/Category';
import Item from '@/models/Item';
import Table from '@/models/Table';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();
    
    const restaurant = await Restaurant.findOne({ slug: params.slug }).select('-adminPasswordHash -adminEmail');
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    const categories = await Category.find({ 
      restaurantId: restaurant._id, 
      isVisible: true 
    }).sort({ sortOrder: 1 });

    const items = await Item.find({ 
      restaurantId: restaurant._id 
    }).sort({ sortOrder: 1 });

    // Get table info if table param provided
    const tableNumber = request.nextUrl.searchParams.get('table');
    let table = null;
    if (tableNumber) {
      table = await Table.findOne({ 
        restaurantId: restaurant._id, 
        tableNumber, 
        isActive: true 
      });
    }

    return NextResponse.json({ 
      restaurant, 
      categories, 
      items,
      table: table ? { _id: table._id, tableNumber: table.tableNumber, label: table.label } : null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
