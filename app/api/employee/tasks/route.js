import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch tasks assigned to the current user for self-evaluation
    const tasks = await Task.find({
      assignedTo: session.user.id,
      category: 'self_evaluation',
      status: { $in: ['pending', 'in_progress'] }
    }).populate('assignedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Transform tasks to match the frontend expected format
    const transformedTasks = tasks.map(task => ({
      id: task._id,
      name: task.title,
      weight: task.maxScore || 100,
      description: task.description,
      dueDate: task.dueDate,
      assignedBy: task.assignedBy ? `${task.assignedBy.firstName} ${task.assignedBy.lastName}` : 'Team Leader',
      evaluationCriteria: task.evaluationCriteria || []
    }));

    return NextResponse.json({ success: true, tasks: transformedTasks });
  } catch (error) {
    console.error('Error fetching employee tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
