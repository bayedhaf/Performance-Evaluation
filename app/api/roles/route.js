import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all users with their roles and permissions
    const users = await User.find({}, 'firstName lastName email role position permissions isActive employeeId')
      .populate('department', 'name')
      .populate('team', 'name');

    // Group users by role
    const rolesData = users.reduce((acc, user) => {
      const role = user.role;
      if (!acc[role]) {
        acc[role] = {
          role: role,
          description: getRoleDescription(role),
          permissions: getDefaultPermissions(role),
          users: []
        };
      }
      acc[role].users.push({
        id: user._id,
        name: user.fullName,
        email: user.email,
        position: user.position,
        isActive: user.isActive,
        employeeId: user.employeeId,
        department: user.department?.name || 'Not Assigned',
        team: user.team?.name || 'Not Assigned'
      });
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      roles: Object.values(rolesData)
    });

  } catch (error) {
    console.error('Roles fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { role, description, permissions } = body;

    if (!role || !permissions) {
      return NextResponse.json({ error: 'Role and permissions are required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['admin', 'team-leader', 'employee'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Validate permissions
    const validPermissions = [
      'create_task', 'edit_task', 'delete_task', 'evaluate_peer', 'evaluate_self',
      'manage_users', 'manage_departments', 'approve_results', 'view_reports'
    ];

    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      return NextResponse.json({ 
        error: `Invalid permissions: ${invalidPermissions.join(', ')}` 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Role configuration validated. Note: Roles are predefined in the system.'
    });

  } catch (error) {
    console.error('Role creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function getRoleDescription(role) {
  const descriptions = {
    'admin': 'Full system access with user management capabilities',
    'team-leader': 'Team management with task creation and evaluation rights',
    'employee': 'Basic employee with self and peer evaluation rights'
  };
  return descriptions[role] || 'Custom role';
}

function getDefaultPermissions(role) {
  const permissions = {
    'admin': ['manage_users', 'manage_departments', 'approve_results', 'view_reports'],
    'team-leader': ['create_task', 'edit_task', 'evaluate_peer', 'evaluate_self', 'view_reports'],
    'employee': ['evaluate_self', 'evaluate_peer']
  };
  return permissions[role] || ['evaluate_self'];
}
