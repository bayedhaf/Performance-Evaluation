import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import Evaluation from '@/models/Evaluation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    // Resolve team id
    let teamId = session.user.team?._id || session.user.team;
    if (!teamId) {
      const me = await User.findById(session.user.id).select('team');
      teamId = me?.team;
    }

    if (!teamId) return NextResponse.json({ stats: [] });

    const [memberCount, taskCount, evaluations] = await Promise.all([
      User.countDocuments({ team: teamId, isActive: true }),
      Task.countDocuments({ team: teamId }),
      Evaluation.aggregate([
        { $match: { isActive: true } },
        { $lookup: { from: 'users', localField: 'evaluatee', foreignField: '_id', as: 'evalUser' } },
        { $unwind: '$evalUser' },
        { $match: { 'evalUser.team': teamId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const evalCounts = evaluations.reduce((acc, e) => { acc[e._id] = e.count; return acc; }, {});

    const stats = [
      { icon: 'Users', title: 'Team Members', value: memberCount, color: 'bg-blue-100' },
      { icon: 'Tasks', title: 'Tasks', value: taskCount, color: 'bg-purple-100' },
      { icon: 'Evaluations', title: 'Submitted Evaluations', value: evalCounts.submitted || 0, color: 'bg-green-100' },
    ];

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Overview stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


