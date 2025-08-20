import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import Task from '@/models/Task';
import User from '@/models/User';

// GET evaluations based on user role and permissions
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const evaluationType = searchParams.get('evaluationType');
    const status = searchParams.get('status');
    const evaluatee = searchParams.get('evaluatee');
    const task = searchParams.get('task');
    
    let query = { isActive: true };
    
    if (evaluationType) query.evaluationType = evaluationType;
    if (status) query.status = status;
    if (evaluatee) query.evaluatee = evaluatee;
    if (task) query.task = task;
    
    // Filter evaluations based on user role
    if (session.user.role === 'employee') {
      // Employees can see evaluations they created or evaluations of them
      query.$or = [
        { evaluator: session.user.id },
        { evaluatee: session.user.id }
      ];
    } else if (session.user.role === 'team-leader') {
      // Team leaders can see evaluations in their team
      if (session.user.team) {
        // Get team members
        const teamMembers = await User.find({ 
          team: session.user.team._id || session.user.team 
        }).select('_id');
        
        const teamMemberIds = teamMembers.map(member => member._id);
        
        query.$or = [
          { evaluator: { $in: teamMemberIds } },
          { evaluatee: { $in: teamMemberIds } }
        ];
      }
    }
    // Admins can see all evaluations
    
    const evaluations = await Evaluation.find(query)
      .populate('task', 'title description category')
      .populate('evaluator', 'firstName lastName email employeeId')
      .populate('evaluatee', 'firstName lastName email employeeId')
      .populate('reviewedBy', 'firstName lastName email')
      .sort({ createdAt: -1 });

    return NextResponse.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new evaluation
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const {
      task,
      evaluatee,
      evaluationType,
      evaluationPeriod,
      criteria,
      strengths,
      areasForImprovement,
      recommendations
    } = body;

    // Validate task
    const taskExists = await Task.findById(task);
    if (!taskExists) {
      return NextResponse.json({ error: 'Task not found' }, { status: 400 });
    }

    // Validate evaluatee
    const evaluateeExists = await User.findById(evaluatee);
    if (!evaluateeExists) {
      return NextResponse.json({ error: 'Evaluatee not found' }, { status: 400 });
    }

    // Check if evaluation already exists for this task and evaluator
    const existingEvaluation = await Evaluation.findOne({
      task,
      evaluator: session.user.id,
      evaluationType,
      isActive: true
    });

    if (existingEvaluation) {
      return NextResponse.json({ 
        error: 'Evaluation already exists for this task' 
      }, { status: 400 });
    }

    // Validate evaluation permissions
    if (evaluationType === 'self') {
      if (session.user.id !== evaluatee) {
        return NextResponse.json({ 
          error: 'Can only evaluate yourself for self-evaluation' 
        }, { status: 403 });
      }
    } else if (evaluationType === 'peer') {
      // Check if evaluator and evaluatee are in the same team
      if (session.user.team && evaluateeExists.team) {
        if (session.user.team.toString() !== evaluateeExists.team.toString()) {
          return NextResponse.json({ 
            error: 'Can only evaluate peers in the same team' 
          }, { status: 403 });
        }
      }
    }

    const evaluation = new Evaluation({
      task,
      evaluator: session.user.id,
      evaluatee,
      evaluationType,
      evaluationPeriod,
      criteria,
      strengths,
      areasForImprovement,
      recommendations
    });

    await evaluation.save();

    const populatedEvaluation = await Evaluation.findById(evaluation._id)
      .populate('task', 'title description category')
      .populate('evaluator', 'firstName lastName email employeeId')
      .populate('evaluatee', 'firstName lastName email employeeId');

    return NextResponse.json(populatedEvaluation, { status: 201 });
  } catch (error) {
    console.error('Error creating evaluation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
