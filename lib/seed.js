import connectDB from './mongodb.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Team from '../models/Team.js';

async function seedDatabase() {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Create departments
    const departments = [
      {
        name: 'Information Technology',
        code: 'IT',
        description: 'IT Department responsible for technology infrastructure and development'
      },
      {
        name: 'Human Resources',
        code: 'HR',
        description: 'HR Department responsible for employee management and policies'
      },
      {
        name: 'Finance',
        code: 'FIN',
        description: 'Finance Department responsible for financial planning and reporting'
      },
      {
        name: 'Marketing',
        code: 'MKT',
        description: 'Marketing Department responsible for brand and product promotion'
      },
      {
        name: 'Operations',
        code: 'OPS',
        description: 'Operations Department responsible for day-to-day business operations'
      }
    ];
    
    const createdDepartments = [];
    for (const dept of departments) {
      const existingDept = await Department.findOne({ code: dept.code });
      if (!existingDept) {
        const newDept = new Department(dept);
        await newDept.save();
        createdDepartments.push(newDept);
        console.log(`✅ Created department: ${dept.name}`);
      } else {
        createdDepartments.push(existingDept);
        console.log(`ℹ️  Department already exists: ${dept.name}`);
      }
    }
    
    // Create teams within departments
    const teams = [
      {
        name: 'Development Team',
        code: 'DEV',
        description: 'Software development team',
        department: createdDepartments[0]._id // IT Department
      },
      {
        name: 'QA Team',
        code: 'QA',
        description: 'Quality assurance team',
        department: createdDepartments[0]._id // IT Department
      },
      {
        name: 'Recruitment Team',
        code: 'REC',
        description: 'Employee recruitment team',
        department: createdDepartments[1]._id // HR Department
      },
      {
        name: 'Payroll Team',
        code: 'PAY',
        description: 'Payroll and benefits team',
        department: createdDepartments[1]._id // HR Department
      }
    ];
    
    const createdTeams = [];
    for (const team of teams) {
      const existingTeam = await Team.findOne({ code: team.code });
      if (!existingTeam) {
        const newTeam = new Team(team);
        await newTeam.save();
        createdTeams.push(newTeam);
        console.log(`✅ Created team: ${team.name}`);
      } else {
        createdTeams.push(existingTeam);
        console.log(`ℹ️  Team already exists: ${team.name}`);
      }
    }
    
    // Create admin user
    const adminUser = await User.findOne({ email: 'admin@company.com' });
    if (!adminUser) {
      const newAdmin = new User({
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@company.com',
        password: 'Admin123!',
        role: 'admin',
        employeeId: 'ADM001',
        position: 'System Administrator',
        permissions: ['manage_users', 'manage_departments', 'approve_results', 'view_reports'],
        isActive: true
      });
      
      await newAdmin.save();
      console.log('✅ Created admin user: admin@company.com');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
    
    // Create sample team leader
    const teamLeader = await User.findOne({ email: 'leader@company.com' });
    if (!teamLeader) {
      const newLeader = new User({
        firstName: 'John',
        lastName: 'Leader',
        email: 'leader@company.com',
        password: 'Leader123!',
        role: 'team-leader',
        department: createdDepartments[0]._id, // IT Department
        team: createdTeams[0]._id, // Development Team
        employeeId: 'TL001',
        position: 'Development Team Lead',
        permissions: ['create_task', 'edit_task', 'delete_task', 'evaluate_peer', 'evaluate_self', 'view_reports'],
        isActive: true
      });
      
      await newLeader.save();
      
      // Update team with leader
      await Team.findByIdAndUpdate(createdTeams[0]._id, { leader: newLeader._id });
      
      console.log('✅ Created team leader: leader@company.com');
    } else {
      console.log('ℹ️  Team leader already exists');
    }
    
    // Create sample employees
    const sampleEmployees = [
      {
        firstName: 'Alice',
        lastName: 'Developer',
        email: 'alice@company.com',
        password: 'Employee123!',
        role: 'employee',
        department: createdDepartments[0]._id, // IT Department
        team: createdTeams[0]._id, // Development Team
        employeeId: 'EMP001',
        position: 'Software Developer',
        permissions: ['evaluate_self', 'evaluate_peer'],
        isActive: true
      },
      {
        firstName: 'Bob',
        lastName: 'Tester',
        email: 'bob@company.com',
        password: 'Employee123!',
        role: 'employee',
        department: createdDepartments[0]._id, // IT Department
        team: createdTeams[1]._id, // QA Team
        employeeId: 'EMP002',
        position: 'QA Engineer',
        permissions: ['evaluate_self', 'evaluate_peer'],
        isActive: true
      },
      {
        firstName: 'Carol',
        lastName: 'Recruiter',
        email: 'carol@company.com',
        password: 'Employee123!',
        role: 'employee',
        department: createdDepartments[1]._id, // HR Department
        team: createdTeams[2]._id, // Recruitment Team
        employeeId: 'EMP003',
        position: 'Recruitment Specialist',
        permissions: ['evaluate_self', 'evaluate_peer'],
        isActive: true
      }
    ];
    
    for (const emp of sampleEmployees) {
      const existingEmp = await User.findOne({ email: emp.email });
      if (!existingEmp) {
        const newEmp = new User(emp);
        await newEmp.save();
        console.log(`✅ Created employee: ${emp.email}`);
      } else {
        console.log(`ℹ️  Employee already exists: ${emp.email}`);
      }
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Default login credentials:');
    console.log('Admin: admin@company.com / Admin123!');
    console.log('Team Leader: leader@company.com / Leader123!');
    console.log('Employee: alice@company.com / Employee123!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;
