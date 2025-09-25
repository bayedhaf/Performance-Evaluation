import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(params.id).select('-password').populate('department team');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const body = await req.json();
    const updated = await User.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const deleted = await User.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
