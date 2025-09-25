import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Assign team to users without a team based on department
    const users = await User.find({ team: { $exists: false }, department: { $exists: true } }).select('_id department');
    const updates = [];

    for (const u of users) {
      let team = await Team.findOne({ department: u.department, isActive: true }).sort({ createdAt: 1 });
      if (!team) {
        team = await Team.create({ name: 'Default Team', code: `DEPT-${u.department}-TEAM-001`, department: u.department, isActive: true });
      }
      updates.push(User.findByIdAndUpdate(u._id, { team: team._id }));
    }

    await Promise.all(updates);
    return NextResponse.json({ success: true, updatedCount: updates.length });
  } catch (error) {
    console.error('Migrate teams error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

