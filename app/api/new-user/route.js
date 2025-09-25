import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';
import bcrypt from 'bcryptjs';
import { writeFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { getAuthOptions } = await import('@/app/api/auth/[...nextauth]/route');
    const session = await getServerSession(getAuthOptions());


    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const position = formData.get('position');
    const phone = formData.get('phone');
    const country = formData.get('country');
    const region = formData.get('region');

    let imageUrl = '/image/profile.png'; 
    const file = formData.get('profileImage');

    if (file && typeof file === 'object' && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(process.cwd(), 'public/uploads', fileName);
      await writeFile(filePath, buffer);

      imageUrl = `/uploads/${fileName}`; 
    }

    const gender = formData.get('gender');
    const dob = formData.get('dob');
    const level = formData.get('level');
    const experience = formData.get('experience');
    const field = formData.get('field');
    const instName = formData.get('instName');
    const emgName = formData.get('emgName');
    const emgRelation = formData.get('emgRelation');
    const emgContact = formData.get('emgContact');
    const emgJob = formData.get('emgJob');
    const department = formData.get('department');

    if (!fullName || !email || !password || !role || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    
    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.length > 0 ? rest.join(' ') : 'Unknown';

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const employeeCount = await User.countDocuments();
    const employeeId = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

    const hashedPassword = await bcrypt.hash(password, 12);

    let resolvedDepartment = null;
    let assignedTeam = null;
    
    if (department) {
      resolvedDepartment = await Department.findOne({ name: new RegExp(`^${department}$`, 'i') });
      
      if (resolvedDepartment) {
        let team = await Team.findOne({ 
          department: resolvedDepartment._id, 
          isActive: true 
        }).sort({ createdAt: 1 });
        
        if (!team) {
          const teamCode = `${resolvedDepartment.code}-TEAM-001`;
          team = await Team.create({
            name: `${resolvedDepartment.name} Team`,
            code: teamCode,
            description: `Default team for ${resolvedDepartment.name} department`,
            department: resolvedDepartment._id,
            isActive: true
          });
        }
        
        assignedTeam = team._id;
      }
    }

    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      profileImage: imageUrl, 
      role,
      position,
      phone,
      address: `${country || ''} ${region || ''}`.trim(),
      employeeId,
      department: resolvedDepartment?._id,
      team: assignedTeam,
      permissions: role === 'admin'
        ? ['manage_users', 'manage_departments', 'approve_results', 'view_reports']
        : role === 'team-leader'
        ? ['create_task', 'edit_task', 'evaluate_peer', 'evaluate_self', 'view_reports']
        : ['evaluate_self', 'evaluate_peer'],
      metadata: {
        gender,
        dob,
        level,
        experience,
        field,
        instName,
        emergencyContact: { name: emgName, relation: emgRelation, contact: emgContact, job: emgJob }
      }
    });

    await newUser.save();

    if (resolvedDepartment) {
      await Department.findByIdAndUpdate(resolvedDepartment._id, { $addToSet: { employees: newUser._id } });
    }
    
    if (assignedTeam) {
      await Team.findByIdAndUpdate(assignedTeam, { $addToSet: { members: newUser._id } });
      if (role === 'team-leader') {
        await Team.findByIdAndUpdate(assignedTeam, { leader: newUser._id });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        employeeId: newUser.employeeId,
        fullName: `${newUser.firstName} ${newUser.lastName}`,
        email: newUser.email,
        role: newUser.role,
        position: newUser.position,
        profileImage: newUser.profileImage
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
}
