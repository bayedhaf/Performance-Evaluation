import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const data = await req.json();
    const created = await Evaluation.create({ ...data, evaluator: session.user.id });
    return NextResponse.json({ success: true, evaluation: created });
  } catch (error) {
    console.error('Self-evaluation submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


