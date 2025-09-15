# Performance Evaluation System - Backend

This is the backend implementation for the Performance Evaluation System built with Next.js, MongoDB, and NextAuth.js.

## 🏗️ System Architecture

The system follows a role-based access control (RBAC) architecture with three main user roles:

### 👑 Admin
- **User Management**: Add, edit, delete users, assign roles and permissions
- **Department Management**: Create and manage organizational departments
- **Team Management**: Create and manage teams within departments
- **Result Approval**: Approve or reject evaluation results
- **System Access**: Full access to all system features

### 👥 Team Leader
- **Task Management**: Create tasks for team members (70% self-evaluation, 10% peer evaluation, 20% other tasks)
- **Team Oversight**: Manage team performance and evaluations
- **Dashboard**: Overview, calendar, and board views
- **Evaluation**: Conduct peer and self-evaluations

### 👤 Employee
- **Self-Evaluation**: Evaluate own task performance
- **Peer Evaluation**: Evaluate colleagues' work
- **Results Viewing**: Access evaluation results and download PDF reports
- **Profile Management**: Update personal information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Performance-Evaluation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/performance_evaluation
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   mongod
   
   # Seed the database with initial data
   node lib/seed.js
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Models

### User Model
- **Authentication**: Email, password (hashed with bcrypt)
- **Profile**: First name, last name, employee ID, position, contact info
- **Role Management**: Admin, Team Leader, Employee
- **Permissions**: Granular access control based on role
- **Relationships**: Department, Team associations

### Department Model
- **Organization**: Name, code, description
- **Management**: Manager assignment
- **Employees**: List of department members

### Team Model
- **Structure**: Name, code, description
- **Leadership**: Team leader assignment
- **Membership**: Team member management
- **Department**: Parent department association

### Task Model
- **Assignment**: Assigned to, assigned by, team, department
- **Details**: Title, description, priority, status, category
- **Evaluation**: Scoring criteria, weights, comments
- **Tracking**: Due dates, completion status, attachments

### Evaluation Model
- **Types**: Self, peer, supervisor evaluations
- **Criteria**: Weighted evaluation criteria with scores
- **Workflow**: Draft → Submitted → Reviewed → Approved/Rejected
- **Feedback**: Strengths, areas for improvement, recommendations

## 🔐 Authentication & Authorization

### NextAuth.js Integration
- **Credentials Provider**: Email/password authentication
- **JWT Strategy**: Secure session management
- **Role-based Access**: Route protection based on user roles
- **Middleware**: Automatic route protection and redirection

### Permission System
```javascript
const permissions = [
  'create_task',      // Create new tasks
  'edit_task',        // Modify existing tasks
  'delete_task',      // Remove tasks
  'evaluate_peer',    // Evaluate colleagues
  'evaluate_self',    // Self-evaluation
  'manage_users',     // User management
  'manage_departments', // Department management
  'approve_results',  // Approve evaluations
  'view_reports'      // Access reports
];
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### User Management
- `GET /api/users` - List users (admin only)
- `POST /api/users` - Create user (admin only)
- `GET /api/users/[id]` - Get user details
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Deactivate user (admin only)

### Department Management
- `GET /api/departments` - List departments
- `POST /api/departments` - Create department (admin only)

### Task Management
- `GET /api/tasks` - List tasks (filtered by role)
- `POST /api/tasks` - Create task (team leaders & admins)

### Evaluation Management
- `GET /api/evaluations` - List evaluations (filtered by role)
- `POST /api/evaluations` - Create evaluation
- `POST /api/evaluations/[id]/approve` - Approve/reject evaluation

### Reporting
- `POST /api/reports/generate-pdf` - Generate performance reports

## 🛡️ Security Features

### Data Protection
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: MongoDB ODM protection
- **XSS Protection**: Input sanitization

### Access Control
- **Role-based Authorization**: Route-level protection
- **Permission Checking**: Granular feature access
- **Session Management**: Secure JWT tokens
- **Route Protection**: Middleware-based security

### API Security
- **Rate Limiting**: Request throttling
- **CORS Configuration**: Cross-origin protection
- **Input Sanitization**: Request data validation
- **Error Handling**: Secure error responses

## 🔧 Configuration

### Environment Variables
```env
# Required
MONGODB_URI=mongodb://localhost:27017/performance_evaluation
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
JWT_SECRET=your-jwt-secret-here
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### MongoDB Configuration
- **Connection Pooling**: Optimized database connections
- **Indexing**: Performance optimization for queries
- **Data Validation**: Schema-level validation
- **Error Handling**: Graceful connection failures

## 📊 Data Flow

### User Authentication Flow
1. User submits credentials
2. NextAuth.js validates against database
3. JWT token generated with user role/permissions
4. User redirected based on role

### Task Creation Flow
1. Team leader creates task
2. Task assigned to employee
3. Employee completes self-evaluation
4. Peer evaluation conducted
5. Results submitted for approval
6. Admin/team leader approves/rejects

### Evaluation Workflow
1. **Draft**: Initial evaluation creation
2. **Submitted**: Evaluation submitted for review
3. **Reviewed**: Under review by supervisor
4. **Approved/Rejected**: Final status determination

## 🚀 Deployment

### Production Setup
1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-domain.com
   ```

2. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

3. **Database Migration**
   ```bash
   # Run seeder in production
   NODE_ENV=production node lib/seed.js
   ```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### API Testing
```bash
# Test user creation
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"Test123!","role":"employee"}'

# Test authentication
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin123!"}'
```

### Database Testing
```bash
# Connect to MongoDB
mongosh performance_evaluation

# Query users
db.users.find({ role: "admin" })

# Query tasks
db.tasks.find({ status: "pending" })
```

## 📈 Performance Optimization

### Database Optimization
- **Indexing**: Strategic index creation
- **Query Optimization**: Efficient aggregation pipelines
- **Connection Pooling**: Optimized MongoDB connections
- **Caching**: Redis integration (optional)

### API Optimization
- **Pagination**: Large dataset handling
- **Filtering**: Efficient query parameters
- **Response Caching**: HTTP caching headers
- **Compression**: Gzip response compression

## 🔍 Monitoring & Logging

### Error Tracking
- **Console Logging**: Development debugging
- **Error Boundaries**: React error handling
- **API Error Responses**: Consistent error format
- **Database Error Handling**: Graceful failures

### Performance Monitoring
- **Response Times**: API endpoint monitoring
- **Database Queries**: Query performance tracking
- **Memory Usage**: Application resource monitoring
- **User Activity**: Authentication and usage tracking

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### Code Standards
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type safety (optional)
- **JSDoc**: Documentation standards

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Mongoose Documentation](https://mongoosejs.com/docs)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [MongoDB Community](https://community.mongodb.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Review existing issues

---

**Note**: This backend system is designed to work seamlessly with the existing frontend components. Ensure all API endpoints match the frontend expectations and that the authentication flow integrates properly with the existing UI components.
