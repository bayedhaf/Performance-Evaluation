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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id)
      .select('-password')
      .populate('department team');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        department: user.department,
        team: user.team,
        employeeId: user.employeeId,
        position: user.position,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        permissions: user.permissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


