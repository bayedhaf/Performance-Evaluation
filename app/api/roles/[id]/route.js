import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectDB();
    const body = await req.json();
    const updated = await User.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('Role update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await connectDB();

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === session.user.id) {
      return NextResponse.json({
        error: 'Cannot delete your own account'
      }, { status: 400 });
    }

    // Soft delete - set isActive to false instead of actually deleting
    await User.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Add GET handler in the correct place
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    await connectDB();

    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}