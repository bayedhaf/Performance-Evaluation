import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';

export async function GET(request) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const role = searchParams.get('role');
    const department = searchParams.get('department');
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search');

    // Build filter query
    const filter = {};
    if (role) filter.role = role;

    // Convert department string to ObjectId if provided
    if (department) {
      const deptDoc = await Department.findOne({
        $or: [{ code: department }, { name: department }]
      });
      if (deptDoc) {
        filter.department = deptDoc._id;
      } else {
        filter.department = null;
      }
    }

    if (isActive !== null && isActive !== undefined && isActive !== '') {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalEmployees = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalEmployees / limit);

    // Get employees with pagination and population
    const employees = await User.find(filter)
      .select('-password')
      .populate('department', 'name code')
      .populate('team', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get summary statistics
    const stats = await User.aggregate([
      { $group: {
        _id: '$role',
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: ['$isActive', 1, 0] }
        }
      }},
      { $sort: { count: -1 } }
    ]);

    // Get department statistics
    const deptStats = await User.aggregate([
      { $lookup: {
        from: 'departments',
        localField: 'department',
        foreignField: '_id',
        as: 'deptInfo'
      }},
      { $unwind: '$deptInfo' },
      { $group: {
        _id: '$deptInfo.name',
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: ['$isActive', 1, 0] }
        }
      }},
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      employees: employees,
      pagination: {
        page,
        limit,
        totalEmployees,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      statistics: {
        roles: stats,
        departments: deptStats,
        total: totalEmployees
      }
    });

  } catch (error) {
    console.error('Employees fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { employeeIds, updates } = body;

    if (!employeeIds || !Array.isArray(employeeIds) || !updates) {
      return NextResponse.json({
        error: 'Employee IDs array and updates object are required'
      }, { status: 400 });
    }

    await connectDB();

    const allowedUpdates = ['role', 'permissions', 'isActive', 'department', 'team'];
    const updateKeys = Object.keys(updates);
    const invalidUpdates = updateKeys.filter(key => !allowedUpdates.includes(key));

    if (invalidUpdates.length > 0) {
      return NextResponse.json({
        error: `Invalid update fields: ${invalidUpdates.join(', ')}`
      }, { status: 400 });
    }

    // Update multiple employees
    const result = await User.updateMany(
      { _id: { $in: employeeIds } },
      { $set: updates }
    );

    return NextResponse.json({
      success: true,
      message: `Updated ${result.modifiedCount} employee(s) successfully`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Employees bulk update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { firstName, lastName, email, password, departmentCode, teamCode, ...rest } = body;

    // 1. Find the department
    const department = await Department.findOne({ code: departmentCode });
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 400 });
    }

    // 2. Find or create the team
    let team;
    if (teamCode) {
      team = await Team.findOne({ code: teamCode, department: department._id });
      if (!team) {
        team = await Team.create({
          name: teamCode,
          code: teamCode,
          department: department._id,
          isActive: true
        });
      }
    } else {
      // Auto-generate a team if none provided
      const generatedCode = `${department.code}-TEAM-${Date.now()}`;
      team = await Team.create({
        name: generatedCode,
        code: generatedCode,
        department: department._id,
        isActive: true
      });
    }

    // 3. Create the user and assign the team
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      department: department._id,
      team: team._id,
      ...rest
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Employee creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
