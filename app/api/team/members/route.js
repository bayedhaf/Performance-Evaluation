import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const teamId = session.user.team?._id || session.user.team;
    const members = await User.find({ team: teamId, isActive: true }).select('firstName lastName email position');
    return NextResponse.json(members);
  } catch (error) {
    console.error('Team members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}