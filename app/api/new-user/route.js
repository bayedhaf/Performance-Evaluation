import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    // Extract form data
    const fullName = formData.get('fullName');
    const gender = formData.get('gender');
    const dob = formData.get('dob');
    const email = formData.get('email');
    const password = formData.get('password');
    const phone = formData.get('phone');
    const country = formData.get('country');
    const region = formData.get('region');
    const position = formData.get('position');
    const role = formData.get('role');
    const level = formData.get('level');
    const experience = formData.get('experience');
    const field = formData.get('field');
    const department = formData.get('department');
    const instName = formData.get('instName');
    const emgName = formData.get('emgName');
    const emgRelation = formData.get('emgRelation');
    const emgContact = formData.get('emgContact');
    const emgJob = formData.get('emgJob');

    // Validate required fields
    if (!fullName || !email || !password || !role || !position) {
      return NextResponse.json({ 
        error: 'Missing required fields: fullName, email, password, role, position' 
      }, { status: 400 });
    }

    // Parse fullName into firstName and lastName
    const nameParts = fullName.trim().split(' ');
    let firstName = '';
    let lastName = '';
    
    if (nameParts.length === 1) {
      // Only one name provided, use it as firstName
      firstName = nameParts[0];
      lastName = 'Unknown'; // Provide a default lastName to satisfy validation
    } else if (nameParts.length === 2) {
      // Two names provided
      firstName = nameParts[0];
      lastName = nameParts[1];
    } else {
      // More than two names provided
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' '); // Join remaining names as lastName
    }

    await connectDB();

    // Resolve department if provided (by id, code, or name)
    let resolvedDepartment = null;
    if (department && typeof department === 'string') {
      const deptQuery = [];
      // Try by ObjectId
      if (department.match(/^[0-9a-fA-F]{24}$/)) {
        deptQuery.push({ _id: department });
      }
      // Try by code (uppercase)
      deptQuery.push({ code: department.toUpperCase() });
      // Try by name (case-insensitive)
      deptQuery.push({ name: new RegExp(`^${department}$`, 'i') });

      resolvedDepartment = await Department.findOne({ $or: deptQuery });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Generate employee ID
    const employeeCount = await User.countDocuments();
    const employeeId = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set default permissions based on role
    let permissions = [];
    switch (role) {
      case 'admin':
        permissions = ['manage_users', 'manage_departments', 'approve_results', 'view_reports'];
        break;
      case 'team-leader':
        permissions = ['create_task', 'edit_task', 'evaluate_peer', 'evaluate_self', 'view_reports'];
        break;
      case 'employee':
        permissions = ['evaluate_self', 'evaluate_peer'];
        break;
      default:
        permissions = ['evaluate_self'];
    }

    // Create new user
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
      position: position,
      phone: phone || '',
      address: `${country || ''} ${region || ''}`.trim(),
      employeeId: employeeId,
      isActive: true,
      permissions: permissions,
      department: resolvedDepartment?._id,
      // Additional fields can be stored in a separate collection or as metadata
      metadata: {
        gender,
        dob,
        level,
        experience,
        field,
        instName,
        emergencyContact: {
          name: emgName,
          relation: emgRelation,
          contact: emgContact,
          job: emgJob
        }
      }
    });

    await newUser.save();

    // If department resolved, add user to department employees list
    if (resolvedDepartment) {
      await Department.findByIdAndUpdate(resolvedDepartment._id, {
        $addToSet: { employees: newUser._id }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        employeeId: newUser.employeeId,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        position: newUser.position
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ 
        error: 'Validation failed',
        details: validationErrors
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error.message
    }, { status: 500 });
  }
}
