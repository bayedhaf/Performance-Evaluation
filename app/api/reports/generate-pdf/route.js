import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Evaluation from '@/models/Evaluation';
import Task from '@/models/Task';
import User from '@/models/User';

// POST generate PDF report
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { 
      reportType, 
      userId, 
      startDate, 
      endDate, 
      department, 
      team 
    } = body;

    let query = { isActive: true };
    let userQuery = { isActive: true };

    // Filter by date range
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Filter by department
    if (department) {
      userQuery.department = department;
    }

    // Filter by team
    if (team) {
      userQuery.team = team;
    }

    let reportData = {};

    switch (reportType) {
      case 'user_performance':
        if (!userId) {
          return NextResponse.json({ error: 'User ID required for user performance report' }, { status: 400 });
        }

        // Get user evaluations
        const userEvaluations = await Evaluation.find({
          ...query,
          evaluatee: userId
        })
        .populate('task', 'title description category')
        .populate('evaluator', 'firstName lastName email')
        .populate('evaluatee', 'firstName lastName email employeeId')
        .sort({ createdAt: -1 });

        // Get user tasks
        const userTasks = await Task.find({
          ...query,
          assignedTo: userId
        })
        .populate('assignedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

        reportData = {
          user: await User.findById(userId).select('-password'),
          evaluations: userEvaluations,
          tasks: userTasks,
          summary: {
            totalEvaluations: userEvaluations.length,
            totalTasks: userTasks.length,
            averageScore: userEvaluations.length > 0 
              ? userEvaluations.reduce((sum, evaluate) => sum + (evaluate.overallScore || 0), 0) / userEvaluations.length 
              : 0,
            completedTasks: userTasks.filter(task => task.status === 'completed').length
          }
        };
        break;

      case 'team_performance':
        if (!team) {
          return NextResponse.json({ error: 'Team required for team performance report' }, { status: 400 });
        }

        // Get team members
        const teamMembers = await User.find({ ...userQuery, team }).select('-password');
        const teamMemberIds = teamMembers.map(member => member._id);

        // Get team evaluations
        const teamEvaluations = await Evaluation.find({
          ...query,
          $or: [
            { evaluator: { $in: teamMemberIds } },
            { evaluatee: { $in: teamMemberIds } }
          ]
        })
        .populate('task', 'title description category')
        .populate('evaluator', 'firstName lastName email')
        .populate('evaluatee', 'firstName lastName email employeeId')
        .sort({ createdAt: -1 });

        // Get team tasks
        const teamTasks = await Task.find({
          ...query,
          team
        })
        .populate('assignedTo', 'firstName lastName email employeeId')
        .populate('assignedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

        reportData = {
          team: await Team.findById(team).populate('leader', 'firstName lastName email'),
          members: teamMembers,
          evaluations: teamEvaluations,
          tasks: teamTasks,
          summary: {
            totalMembers: teamMembers.length,
            totalEvaluations: teamEvaluations.length,
            totalTasks: teamTasks.length,
            averageScore: teamEvaluations.length > 0 
              ? teamEvaluations.reduce((sum, enaluate) => sum + (enaluate.overallScore || 0), 0) / teamEvaluations.length 
              : 0,
            completedTasks: teamTasks.filter(task => task.status === 'completed').length
          }
        };
        break;

      case 'department_performance':
        if (!department) {
          return NextResponse.json({ error: 'Department required for department performance report' }, { status: 400 });
        }

        // Get department users
        const deptUsers = await User.find({ ...userQuery, department }).select('-password');
        const deptUserIds = deptUsers.map(user => user._id);

        // Get department evaluations
        const deptEvaluations = await Evaluation.find({
          ...query,
          $or: [
            { evaluator: { $in: deptUserIds } },
            { evaluatee: { $in: deptUserIds } }
          ]
        })
        .populate('task', 'title description category')
        .populate('evaluator', 'firstName lastName email')
        .populate('evaluatee', 'firstName lastName email employeeId')
        .sort({ createdAt: -1 });

        // Get department tasks
        const deptTasks = await Task.find({
          ...query,
          department
        })
        .populate('assignedTo', 'firstName lastName email employeeId')
        .populate('assignedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

        reportData = {
          department: await Department.findById(department).populate('manager', 'firstName lastName email'),
          users: deptUsers,
          evaluations: deptEvaluations,
          tasks: deptTasks,
          summary: {
            totalUsers: deptUsers.length,
            totalEvaluations: deptEvaluations.length,
            totalTasks: deptTasks.length,
            averageScore: deptEvaluations.length > 0 
              ? deptEvaluations.reduce((sum, enaluate) => sum + (enaluate.overallScore || 0), 0) / deptEvaluations.length 
              : 0,
            completedTasks: deptTasks.filter(task => task.status === 'completed').length
          }
        };
        break;

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    // For now, return the data - PDF generation would be implemented here
    // In a real implementation, you would use a library like jsPDF or puppeteer
    return NextResponse.json({
      message: 'Report data generated successfully',
      reportType,
      data: reportData,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
