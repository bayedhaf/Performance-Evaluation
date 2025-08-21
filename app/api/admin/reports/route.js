import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';
import Task from '@/models/Task';
import Evaluation from '@/models/Evaluation';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'overview';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let reportData = {};

    switch (reportType) {
      case 'overview':
        reportData = await generateOverviewReport(dateFilter);
        break;
      case 'users':
        reportData = await generateUsersReport(dateFilter);
        break;
      case 'departments':
        reportData = await generateDepartmentsReport(dateFilter);
        break;
      case 'performance':
        reportData = await generatePerformanceReport(dateFilter);
        break;
      default:
        reportData = await generateOverviewReport(dateFilter);
    }

    return NextResponse.json({
      success: true,
      reportType,
      data: reportData,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Reports generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateOverviewReport(dateFilter) {
  const [
    totalUsers,
    activeUsers,
    totalDepartments,
    totalTeams,
    recentUsers,
    roleDistribution
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Department.countDocuments({ isActive: true }),
    Team.countDocuments({ isActive: true }),
    User.find(dateFilter).sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt'),
    User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);

  return {
    summary: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalDepartments,
      totalTeams,
      userActivityRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(2) : 0
    },
    recentUsers,
    roleDistribution
  };
}

async function generateUsersReport(dateFilter) {
  const users = await User.find(dateFilter)
    .select('firstName lastName email role position isActive createdAt lastLogin')
    .populate('department', 'name')
    .populate('team', 'name')
    .sort({ createdAt: -1 });

  const roleStats = await User.aggregate([
    { $match: dateFilter },
    { $group: { 
      _id: '$role', 
      count: { $sum: 1 },
      activeCount: { $sum: { $cond: ['$isActive', 1, 0] } }
    }},
    { $sort: { count: -1 } }
  ]);

  return {
    users,
    roleStats,
    totalUsers: users.length
  };
}

async function generateDepartmentsReport(dateFilter) {
  const departments = await Department.find({ isActive: true })
    .populate('employees', 'firstName lastName email role position')
    .sort({ name: 1 });

  const deptStats = departments.map(dept => ({
    id: dept._id,
    name: dept.name,
    code: dept.code,
    employeeCount: dept.employees.length,
    activeEmployees: dept.employees.filter(emp => emp.isActive).length,
    roleDistribution: dept.employees.reduce((acc, emp) => {
      acc[emp.role] = (acc[emp.role] || 0) + 1;
      return acc;
    }, {})
  }));

  return {
    departments: deptStats,
    totalDepartments: departments.length,
    totalEmployees: deptStats.reduce((sum, dept) => sum + dept.employeeCount, 0)
  };
}

async function generatePerformanceReport(dateFilter) {
  // This would typically include evaluation data, but since we don't have that yet,
  // we'll return basic user activity metrics
  const activeUsers = await User.countDocuments({ 
    ...dateFilter, 
    isActive: true,
    lastLogin: { $exists: true, $ne: null }
  });

  const recentLogins = await User.find({
    ...dateFilter,
    lastLogin: { $exists: true, $ne: null }
  })
  .sort({ lastLogin: -1 })
  .limit(10)
  .select('firstName lastName email lastLogin role');

  return {
    activeUsers,
    recentLogins,
    message: 'Performance metrics will be available once evaluation data is added to the system.'
  };
}
