import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch all evaluations for the current user
    const evaluations = await Evaluation.find({
      evaluatee: session.user.id,
      status: { $in: ['submitted', 'reviewed', 'approved'] }
    }).populate('evaluator', 'firstName lastName')
      .populate('evaluatee', 'firstName lastName')
      .sort({ createdAt: -1 });

    if (evaluations.length === 0) {
      return NextResponse.json({
        message: 'No evaluation results found',
        evaluation: null
      });
    }

    // Get the most recent evaluation
    const latestEvaluation = evaluations[0];
    
    // Calculate total score from all evaluation types
    const selfEvaluation = evaluations.find(e => e.evaluationType === 'self');
    const peerEvaluations = evaluations.filter(e => e.evaluationType === 'peer');
    const supervisorEvaluations = evaluations.filter(e => e.evaluationType === 'supervisor');

    const selfScore = selfEvaluation?.overallScore || 0;
    const peerScore = peerEvaluations.length > 0 
      ? peerEvaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / peerEvaluations.length 
      : 0;
    const supervisorScore = supervisorEvaluations.length > 0 
      ? supervisorEvaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) / supervisorEvaluations.length 
      : 0;

    // Calculate weighted total (assuming 70% supervisor, 15% peer, 15% self)
    const totalScore = Math.round(
      (supervisorScore * 0.7) + (peerScore * 0.15) + (selfScore * 0.15)
    );

    const result = {
      name: `${session.user.firstName} ${session.user.lastName}`,
      work: selfEvaluation?.criteria?.[0]?.criterion || 'General Performance',
      job: session.user.position || 'Employee',
      year: new Date().getFullYear(),
      leader: supervisorEvaluations[0]?.evaluator?.firstName 
        ? `${supervisorEvaluations[0].evaluator.firstName} ${supervisorEvaluations[0].evaluator.lastName}`
        : 'Team Leader',
      leaderSign: 'Approved',
      leaderDate: latestEvaluation?.createdAt?.toLocaleDateString() || new Date().toLocaleDateString(),
      leaderMark: supervisorScore,
      selfMark: selfScore,
      peerMark: peerScore,
      otherMark: 0, // Placeholder for other evaluation types
      summary: `Overall performance evaluation for ${new Date().getFullYear()}. Total score: ${totalScore}%`,
      approver: 'Department Head',
      approverSign: 'Approved',
      approverDate: latestEvaluation?.updatedAt?.toLocaleDateString() || new Date().toLocaleDateString(),
      totalScore: totalScore
    };

    return NextResponse.json({ success: true, evaluation: result });
  } catch (error) {
    console.error('Error fetching evaluation results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
