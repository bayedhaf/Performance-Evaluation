import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';

// GET user by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only view their own profile, admins can view any profile
    if (session.user.role !== 'admin' && session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findById(params.id)
      .populate('department', 'name code')
      .populate('team', 'name code')
      .select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Users can only update their own profile, admins can update any profile
    if (session.user.role !== 'admin' && session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      role,
      department,
      team,
      employeeId,
      position,
      phone,
      address,
      permissions,
      isActive
    } = body;

    // Check if user exists
    const existingUser = await User.findById(params.id);
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only admins can change role and permissions
    if (session.user.role !== 'admin') {
      delete body.role;
      delete body.permissions;
      delete body.isActive;
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: params.id } });
      if (emailExists) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
      }
    }

    // Check if employee ID is being changed and if it already exists
    if (employeeId && employeeId !== existingUser.employeeId) {
      const employeeIdExists = await User.findOne({ employeeId, _id: { $ne: params.id } });
      if (employeeIdExists) {
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

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      {
        ...body,
        email: body.email ? body.email.toLowerCase() : undefined,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('department', 'name code')
      .populate('team', 'name code')
      .select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE user (admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Check if user exists
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (session.user.id === params.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Soft delete - set isActive to false instead of removing
    await User.findByIdAndUpdate(params.id, { isActive: false });

    return NextResponse.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
