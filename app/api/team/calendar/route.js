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

    // Resolve team id for current user
    let teamId = session.user.team?._id || session.user.team;
    if (!teamId) {
      const me = await User.findById(session.user.id).select('team');
      teamId = me?.team;
    }
    if (!teamId) return NextResponse.json([]);

    // Tasks with due dates for the team
    const tasks = await Task.find({ team: teamId, dueDate: { $ne: null } })
      .select('title dueDate assignedTo')
      .populate('assignedTo', 'firstName lastName');

    // Evaluations for team members
    const teamMembers = await User.find({ team: teamId }).select('_id firstName lastName');
    const memberIds = teamMembers.map(m => m._id);
    const evals = await Evaluation.find({ evaluatee: { $in: memberIds }, isActive: true })
      .select('evaluationType createdAt reviewDate');

    const events = [
      ...tasks.map(t => ({
        id: `task-${t._id}`,
        name: t.title,
        date: (t.dueDate instanceof Date ? t.dueDate : new Date(t.dueDate)).toISOString().slice(0,10),
        type: 'Task'
      })),
      ...evals.map(e => ({
        id: `eval-${e._id}`,
        name: `${e.evaluationType?.toUpperCase()} Evaluation`,
        date: ((e.reviewDate || e.createdAt) instanceof Date ? (e.reviewDate || e.createdAt) : new Date(e.reviewDate || e.createdAt)).toISOString().slice(0,10),
        type: 'Evaluation'
      }))
    ].sort((a,b) => a.date.localeCompare(b.date));

    return NextResponse.json(events);
  } catch (error) {
    console.error('Team calendar error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


