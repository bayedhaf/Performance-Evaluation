import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import Team from '@/models/Team';

// GET tasks based on user role and permissions
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const assignedTo = searchParams.get('assignedTo');
    const team = searchParams.get('team');
    const department = searchParams.get('department');
    
    let query = { isActive: true };
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (team) query.team = team;
    if (department) query.department = department;
    
    // Filter tasks based on user role
    if (session.user.role === 'employee') {
      // Employees can only see tasks assigned to them
      query.assignedTo = session.user.id;
    } else if (session.user.role === 'team-leader') {
      // Team leaders can see tasks in their team
      if (session.user.team) {
        query.team = session.user.team._id || session.user.team;
      }
    }
    // Admins can see all tasks
    
    const tasks = await Task.find(query)
      .populate('assignedTo', 'firstName lastName email employeeId')
      .populate('assignedBy', 'firstName lastName email')
      .populate('team', 'name code')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new task
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only team leaders and admins can create tasks
    if (!['admin', 'team-leader'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    await connectDB();
    
    const body = await request.json();
    const {
      title,
      description,
      assignedTo,
      team,
      department,
      priority,
      category,
      dueDate,
      evaluationCriteria,
      shareWithTeam
    } = body;

    // Validate assigned user
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return NextResponse.json({ error: 'Assigned user not found' }, { status: 400 });
    }

    // Team leaders can only assign tasks to their team members
    if (session.user.role === 'team-leader') {
      if (session.user.team && assignedUser.team?.toString() !== session.user.team._id?.toString()) {
        return NextResponse.json({ error: 'Can only assign tasks to team members' }, { status: 403 });
      }
    }

    // Validate team and department
    if (team) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return NextResponse.json({ error: 'Team not found' }, { status: 400 });
      }
    }

    // Create task for the assigned user
    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: session.user.id,
      team: team || assignedUser.team,
      department: department || assignedUser.department,
      priority,
      category,
      dueDate,
      evaluationCriteria
    });

    await task.save();

    // If this is a team task and shareWithTeam is true, create copies for all team members
    if (shareWithTeam && (team || assignedUser.team)) {
      const teamId = team || assignedUser.team;
      const teamMembers = await User.find({ 
        team: teamId, 
        isActive: true,
        _id: { $ne: assignedTo } // Exclude the originally assigned user
      });

      // Create tasks for all other team members
      const teamTasks = teamMembers.map(member => ({
        title: `${title} (Team Task)`,
        description: `${description} - Shared with team members`,
        assignedTo: member._id,
        assignedBy: session.user.id,
        team: teamId,
        department: department || assignedUser.department,
        priority,
        category,
        dueDate,
        evaluationCriteria,
        isTeamTask: true,
        originalTaskId: task._id
      }));

      if (teamTasks.length > 0) {
        await Task.insertMany(teamTasks);
      }
    }

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'firstName lastName email employeeId')
      .populate('assignedBy', 'firstName lastName email')
      .populate('team', 'name code')
      .populate('department', 'name code');

    return NextResponse.json(populatedTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
