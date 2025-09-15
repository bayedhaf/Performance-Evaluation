import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import User from '@/models/User';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    // Support two shapes:
    // A) { typeOfWork, rank, year, tasks: [{ no, task, score }] }
    // B) { employee: {...}, tasks: [{ name, weight, rank }], totalRank, totalScore, date }

    let year = body.year || new Date().getFullYear();
    let evaluateeId = body.evaluateeId;
    let criteria = [];
    let evaluationType = 'peer';

    if (Array.isArray(body.tasks) && body.tasks.length && body.tasks[0]?.task !== undefined) {
      // Shape A
      criteria = body.tasks.map((t) => ({
        criterion: t.task || 'Task',
        weight: Number(t.no || 0),
        score: Number(t.score || 0),
      }));
      evaluateeId = evaluateeId || body.employeeId; // optional
    } else if (Array.isArray(body.tasks) && body.tasks.length) {
      // Shape B
      criteria = body.tasks.map((t) => ({
        criterion: t.name || 'Task',
        weight: Number(t.weight || 0),
        score: Number(t.rank || 0),
      }));
      evaluateeId = evaluateeId || body.employee?._id || body.employee?.id;
    }

    await connectDB();

    if (!Array.isArray(body.tasks) || body.tasks.length === 0) {
      return NextResponse.json({ error: 'No tasks provided' }, { status: 400 });
    }

    // Calculate overall score from provided tasks as simple sum of provided scores
    const submittedTasks = Array.isArray(body.tasks) ? body.tasks : [];
    const totalScore = submittedTasks.reduce((acc, t) => acc + Number((t.score ?? t.rank) || 0), 0);

    const me = await User.findById(session.user.id).select('_id team');
    if (!me) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // If evaluateeId provided, ensure same team for peer evaluation
    if (evaluateeId) {
      const evaluatee = await User.findById(evaluateeId).select('_id team');
      if (!evaluatee) return NextResponse.json({ error: 'Evaluatee not found' }, { status: 400 });
      if (me.team && evaluatee.team && me.team.toString() !== evaluatee.team.toString()) {
        return NextResponse.json({ error: 'Can only evaluate peers in the same team' }, { status: 403 });
      }
    }

    const evaluation = new Evaluation({
      evaluator: session.user.id,
      evaluatee: evaluateeId || session.user.id,
      evaluationType,
      evaluationPeriod: {
        startDate: new Date(`${year}-01-01`),
        endDate: new Date(`${year}-12-31`)
      },
      criteria,
      strengths: [],
      areasForImprovement: [],
      recommendations: [],
      status: 'submitted',
    });

    await evaluation.save();
    return NextResponse.json({ success: true, evaluationId: evaluation._id });
  } catch (error) {
    console.error('Peer evaluation submit error:', error);
    if (error?.name === 'ValidationError') {
      const details = Object.values(error.errors || {}).map(e => e.message);
      return NextResponse.json({ error: 'Validation failed', details }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


