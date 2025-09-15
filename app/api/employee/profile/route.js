import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch the current user's profile with department and team info
    const user = await User.findById(session.user.id)
      .populate('department', 'name')
      .populate('team', 'name')
      .select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform user data to match frontend expectations
    const profileData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || '',
      position: user.position || '',
      department: user.department?.name || '',
      team: user.team?.name || '',
      employeeId: user.employeeId || '',
      profileImage: user.profileImage || '/image/astuLogo.png',
      gender: user.gender || '',
      dob: user.dob || '',
      country: user.country || '',
      region: user.region || '',
      level: user.level || '',
      experience: user.experience || '',
      field: user.field || '',
      instName: user.instName || '',
      emgName: user.emgName || '',
      emgRelation: user.emgRelation || '',
      emgContact: user.emgContact || '',
      emgJob: user.emgJob || '',
      isActive: user.isActive,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({ success: true, user: profileData });
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const updateData = {};

    // Extract form data
    const fields = [
      'fullName', 'gender', 'dob', 'email', 'phone', 'country', 'region',
      'position', 'level', 'experience', 'field', 'department', 'instName',
      'emgName', 'emgRelation', 'emgContact', 'emgJob'
    ];

    fields.forEach(field => {
      const value = formData.get(field);
      if (value) {
        updateData[field] = value.toString();
      }
    });

    // Handle password update if provided
    const password = formData.get('password');
    if (password) {
      const bcrypt = await import('bcryptjs');
      updateData.password = await bcrypt.hash(password.toString(), 12);
    }

    // Handle profile image upload if provided
    const photo = formData.get('photo');
    if (photo && photo instanceof File) {
      // For now, we'll store the filename. In production, you'd upload to cloud storage
      updateData.profileImage = `/uploads/${photo.name}`;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating employee profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
