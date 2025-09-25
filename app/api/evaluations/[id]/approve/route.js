import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['admin', 'team-leader'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();
    
    const body = await request.json();
    const { status, reviewComments } = body;

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Find the evaluation
    const evaluation = await Evaluation.findById(params.id);
    if (!evaluation) {
      return NextResponse.json({ error: 'Evaluation not found' }, { status: 404 });
    }

    // Team leaders can only approve evaluations in their team
    if (session.user.role === 'team-leader') {
      // Check if evaluation is for a team member
      const teamMembers = await User.find({ 
        team: session.user.team._id || session.user.team 
      }).select('_id');
      
      const teamMemberIds = teamMembers.map(member => member._id.toString());
      
      if (!teamMemberIds.includes(evaluation.evaluatee.toString())) {
        return NextResponse.json({ error: 'Can only approve evaluations in your team' }, { status: 403 });
      }
    }

    // Update evaluation status
    evaluation.status = status;
    evaluation.reviewedBy = session.user.id;
    evaluation.reviewDate = new Date();
    evaluation.reviewComments = reviewComments;

    await evaluation.save();

    const populatedEvaluation = await Evaluation.findById(evaluation._id)
      .populate('task', 'title description category')
      .populate('evaluator', 'firstName lastName email employeeId')
      .populate('evaluatee', 'firstName lastName email employeeId')
      .populate('reviewedBy', 'firstName lastName email');

    return NextResponse.json(populatedEvaluation);
  } catch (error) {
    console.error('Error approving evaluation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}