import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';

// GET all users (admin only)
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const department = searchParams.get('department');
    const team = searchParams.get('team');
    const isActive = searchParams.get('isActive');
    
    let query = {};
    
    if (role) query.role = role;
    if (department) query.department = department;
    if (team) query.team = team;
    if (isActive !== null) query.isActive = isActive === 'true';
    
    const users = await User.find(query)
      .populate('department', 'name code')
      .populate('team', 'name code')
      .select('-password')
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new user (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      team,
      employeeId,
      position,
      phone,
      address,
      permissions
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Check if employee ID already exists
    if (employeeId) {
      const existingEmployeeId = await User.findOne({ employeeId });
      if (existingEmployeeId) {
        return NextResponse.json({ error: 'Employee ID already exists' }, { status: 400 });
      }
    }

    // Validate department and team
    if (department) {
      const deptExists = await Department.findById(department);
      if (!deptExists) {
        return NextResponse.json({ error: 'Department not found' }, { status: 400 });
      }
    }

    if (team) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return NextResponse.json({ error: 'Team not found' }, { status: 400 });
      }
    }

    // Set default permissions based on role
    let defaultPermissions = [];
    if (role === 'admin') {
      defaultPermissions = ['manage_users', 'manage_departments', 'approve_results', 'view_reports'];
    } else if (role === 'team-leader') {
      defaultPermissions = ['create_task', 'edit_task', 'delete_task', 'evaluate_peer', 'evaluate_self', 'view_reports'];
    } else if (role === 'employee') {
      defaultPermissions = ['evaluate_self', 'evaluate_peer'];
    }

    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role,
      department,
      team,
      employeeId,
      position,
      phone,
      address,
      permissions: permissions || defaultPermissions
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
