import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id).select('-password').populate('department team');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Employee profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());
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
