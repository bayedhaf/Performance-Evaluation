import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Department from '@/models/Department';
import Team from '@/models/Team';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admin can run migration
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Find all users without teams
    const usersWithoutTeams = await User.find({ 
      team: { $exists: false },
      department: { $exists: true, $ne: null }
    }).populate('department');
    
    if (usersWithoutTeams.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All users already have teams assigned!',
        processed: 0
      });
    }
    
    // Group users by department
    const usersByDepartment = {};
    usersWithoutTeams.forEach(user => {
      const deptId = user.department._id.toString();
      if (!usersByDepartment[deptId]) {
        usersByDepartment[deptId] = {
          department: user.department,
          users: []
        };
      }
      usersByDepartment[deptId].users.push(user);
    });
    
    let totalProcessed = 0;
    const results = [];
    
    // Process each department
    for (const [deptId, deptData] of Object.entries(usersByDepartment)) {
      const { department, users } = deptData;
      
      // Check if there's already a team for this department
      let team = await Team.findOne({ 
        department: department._id, 
        isActive: true 
      }).sort({ createdAt: 1 });
      
      // Create team if it doesn't exist
      if (!team) {
        const teamCode = `${department.code}-TEAM-001`;
        team = await Team.create({
          name: `${department.name} Team`,
          code: teamCode,
          description: `Default team for ${department.name} department`,
          department: department._id,
          isActive: true
        });
      }
      
      // Assign users to the team
      const userIds = users.map(user => user._id);
      const teamLeader = users.find(user => user.role === 'team-leader');
      
      // Update users with team assignment
      await User.updateMany(
        { _id: { $in: userIds } },
        { $set: { team: team._id } }
      );
      
      // Add users to team members list
      await Team.findByIdAndUpdate(
        team._id,
        { $addToSet: { members: { $each: userIds } } }
      );
      
      // Set team leader if found
      if (teamLeader) {
        await Team.findByIdAndUpdate(team._id, { leader: teamLeader._id });
      }
      
      totalProcessed += userIds.length;
      results.push({
        department: department.name,
        team: team.name,
        usersProcessed: userIds.length,
        teamLeader: teamLeader ? teamLeader.fullName : null
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `Migration completed successfully!`,
      processed: totalProcessed,
      departments: Object.keys(usersByDepartment).length,
      results
    });
    
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({ 
      error: 'Migration failed', 
      details: error.message 
    }, { status: 500 });
  }
}

