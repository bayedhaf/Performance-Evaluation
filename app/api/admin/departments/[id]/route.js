import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Department from '@/models/Department';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await connectDB();
    
    const department = await Department.findById(id)
      .populate('employees', 'firstName lastName email employeeId position role');

    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      department: department
    });

  } catch (error) {
    console.error('Department fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { name, code, description, isActive } = body;

    await connectDB();

    // Check if department exists
    const department = await Department.findById(id);
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Check if new name/code conflicts with existing departments
    if (name || code) {
      const existingDept = await Department.findOne({
        $and: [
          { _id: { $ne: id } },
          { $or: [{ name: name || department.name }, { code: code || department.code }] }
        ]
      });
      
      if (existingDept) {
        return NextResponse.json({ 
          error: 'Department with this name or code already exists' 
        }, { status: 400 });
      }
    }

    // Update department
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

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    await connectDB();

    // Check if department exists
    const department = await Department.findById(id);
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    // Check if department has employees
    const employeeCount = await User.countDocuments({ department: id });
    if (employeeCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete department. It has ${employeeCount} employee(s) assigned.` 
      }, { status: 400 });
    }

    // Soft delete - set isActive to false
    await Department.findByIdAndUpdate(id, { isActive: false });

    return NextResponse.json({
      success: true,
      message: 'Department deactivated successfully'
    });

  } catch (error) {
    console.error('Department deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
