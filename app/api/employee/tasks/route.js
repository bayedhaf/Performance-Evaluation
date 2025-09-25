import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const tasks = await Task.find({ assignedTo: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Employee tasks fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
