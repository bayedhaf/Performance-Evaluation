import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req, { params }) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { isActive } = body;

    const updated = await User.findByIdAndUpdate(params.id, { isActive }, { new: true });
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('User status update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
