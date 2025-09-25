import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Department from '@/models/Department';
import User from '@/models/User';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET department by ID
export async function GET(req, { params }) {
  try {
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });

    await connectDB();

    const department = await Department.findById(id).populate(
      'employees', 'firstName lastName email employeeId position role'
    );

    if (!department) return NextResponse.json({ error: 'Department not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      department: {
        id: department._id,
        name: department.name,
        code: department.code,
        description: department.description,
        isActive: department.isActive,
        employeeCount: department.employees.length,
        employees: department.employees
      }
    });

  } catch (error) {
    console.error('Department fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT department by ID
export async function PUT(req, { params }) {
  try {
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });

    const body = await req.json();
    const { name, code, description, isActive } = body;

    await connectDB();

    const department = await Department.findById(id);
    if (!department) return NextResponse.json({ error: 'Department not found' }, { status: 404 });

    // Check for name/code conflicts
    if (name || code) {
      const existingDept = await Department.findOne({
        _id: { $ne: id },
        $or: [{ name: name || department.name }, { code: code || department.code }]
      });
      if (existingDept) {
        return NextResponse.json({ error: 'Department with this name or code already exists' }, { status: 400 });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (code) updateData.code = code;
    if (description !== undefined) updateData.description = description;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Department updated successfully', 
      department: updatedDepartment 
    });

  } catch (error) {
    console.error('Department update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE department by ID
export async function DELETE(req, { params }) {
  try {
    const { authOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params?.id;
    if (!id) return NextResponse.json({ error: 'Department ID is required' }, { status: 400 });

    await connectDB();

    const department = await Department.findById(id);
    if (!department) return NextResponse.json({ error: 'Department not found' }, { status: 404 });

    const employeeCount = await User.countDocuments({ department: id });
    if (employeeCount > 0) {
      return NextResponse.json({
        error: `Cannot delete department. It has ${employeeCount} employee(s) assigned.`
      }, { status: 400 });
    }

    // Soft delete
    await Department.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({ success: true, message: 'Department deactivated successfully' });

  } catch (error) {
    console.error('Department deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}