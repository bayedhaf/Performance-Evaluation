/**
 * Migration script to assign existing users to teams based on their departments
 * Run this script to fix existing users who don't have teams assigned
 */

import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Team from '../models/Team.js';

async function migrateUsersToTeams() {
  try {
    console.log('🔄 Starting user-to-team migration...');
    
    await connectDB();
    
    // Find all users without teams
    const usersWithoutTeams = await User.find({ 
      team: { $exists: false },
      department: { $exists: true, $ne: null }
    }).populate('department');
    
    console.log(`📊 Found ${usersWithoutTeams.length} users without teams`);
    
    if (usersWithoutTeams.length === 0) {
      console.log('✅ All users already have teams assigned!');
      return;
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
    
    console.log(`📁 Found ${Object.keys(usersByDepartment).length} departments with users needing teams`);
    
    // Process each department
    for (const [deptId, deptData] of Object.entries(usersByDepartment)) {
      const { department, users } = deptData;
      
      console.log(`\n🏢 Processing department: ${department.name} (${users.length} users)`);
      
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
        console.log(`  ✅ Created new team: ${team.name} (${team.code})`);
      } else {
        console.log(`  📋 Using existing team: ${team.name} (${team.code})`);
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
        console.log(`  👑 Set team leader: ${teamLeader.fullName}`);
      }
      
      console.log(`  ✅ Assigned ${userIds.length} users to team`);
    }
    
    console.log('\n🎉 Migration completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users processed: ${usersWithoutTeams.length}`);
    console.log(`   - Departments processed: ${Object.keys(usersByDepartment).length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUsersToTeams()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export default migrateUsersToTeams;

