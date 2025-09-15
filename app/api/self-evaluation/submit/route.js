import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { typeOfWork, rank, year, tasks } = body;

    await connectDB();

    const evaluation = new Evaluation({
      evaluator: session.user.id,
      evaluatee: session.user.id,
      evaluationType: 'self',
      evaluationPeriod: {
        startDate: new Date(`${year}-01-01`),
        endDate: new Date(`${year}-12-31`)
      },
      criteria: (tasks || []).map((t) => ({
        criterion: t.task || 'Task',
        weight: Number(t.no || 0),
        score: Number(t.score || 0),
      })),
      status: 'submitted',
    });

    await evaluation.save();
    return NextResponse.json({ success: true, evaluationId: evaluation._id });
  } catch (error) {
    console.error('Self evaluation submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


