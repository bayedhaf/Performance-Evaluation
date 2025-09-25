import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Department from '@/models/Department';
import User from '@/models/User';

export async function GET() {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const departments = await Department.find({ isActive: true })
      .populate('employees', 'firstName lastName email employeeId position');

    return NextResponse.json({
      success: true,
      departments: departments
    });

  } catch (error) {
    console.error('Departments fetch error:', error);
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

    const body = await request.json();
    const { name, code, description } = body;

    if (!name || !code) {
      return NextResponse.json({ 
        error: 'Department name and code are required' 
      }, { status: 400 });
    }

    await connectDB();

    // Check if department already exists
    const existingDept = await Department.findOne({ 
      $or: [{ name: name }, { code: code }] 
    });
    
    if (existingDept) {
      return NextResponse.json({ 
        error: 'Department with this name or code already exists' 
      }, { status: 400 });
    }

    // Create new department
    const newDepartment = new Department({
      name,
      code,
      description: description || '',
      isActive: true
    });

    await newDepartment.save();

    return NextResponse.json({
      success: true,
      message: 'Department created successfully',
      department: newDepartment
    });

  } catch (error) {
    console.error('Department creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
