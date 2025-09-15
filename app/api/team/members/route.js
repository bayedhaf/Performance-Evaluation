import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await connectDB();
    } catch (dbErr) {
      console.warn('DB unavailable for team members fetch:', dbErr?.message);
      return NextResponse.json({ users: [] });
    }

    let teamId = session.user.team?._id || session.user.team;
    if (!teamId && session.user.role === 'employee') {
      // Load from DB if not present in session
      const me = await User.findById(session.user.id).select('team');
      teamId = me?.team;
    }

    if (!teamId) {
      return NextResponse.json({ users: [] });
    }

    const members = await User.find({ team: teamId, isActive: true })
      .select('firstName lastName email profileImage position role')
      .sort({ firstName: 1, lastName: 1 });

    const users = members.map((u) => ({
      _id: u._id,
      fullName: `${u.firstName} ${u.lastName}`.trim(),
      email: u.email,
      profileImage: u.profileImage,
      position: u.position,
      role: u.role,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Team members fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}