import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import Department from '@/models/Department';
import User from '@/models/User';

// GET all departments
export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    
    let query = {};
    if (isActive !== null) query.isActive = isActive === 'true';
    
    const departments = await Department.find(query)
      .populate('manager', 'firstName lastName email')
      .populate('employees', 'firstName lastName email employeeId')
      .sort({ name: 1 });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST create new department (admin only)
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { name, code, description, manager } = body;

    // Check if department with same name or code already exists
    const existingDept = await Department.findOne({
      $or: [{ name }, { code: code.toUpperCase() }]
    });
    
    if (existingDept) {
      return NextResponse.json({ 
        error: 'Department with this name or code already exists' 
      }, { status: 400 });
    }

    // Validate manager if provided
    if (manager) {
      const managerExists = await User.findById(manager);
      if (!managerExists) {
        return NextResponse.json({ error: 'Manager not found' }, { status: 400 });
      }
    }

    const department = new Department({
      name,
      code: code.toUpperCase(),
      description,
      manager
    });

    await department.save();

    const populatedDept = await Department.findById(department._id)
      .populate('manager', 'firstName lastName email');

    return NextResponse.json(populatedDept, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
