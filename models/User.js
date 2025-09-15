import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName:
   { type: String, 
    required: true, trim: true },
  lastName: 
  { type: String, 
    required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'team-leader', 'employee'], default: 'employee' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  employeeId: { type: String, unique: true, sparse: true },
  position: { type: String, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  profileImage: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  permissions: [{
    type: String,
    enum: [
      'create_task', 'edit_task', 'delete_task',
      'evaluate_peer', 'evaluate_self',
      'manage_users', 'manage_departments',
      'approve_results', 'view_reports'
    ]
  }],
  metadata: {
    gender: String,
    dob: Date,
    level: String,
    experience: String,
    field: String,
    instName: String,
    emergencyContact: {
      name: String,
      relation: String,
      contact: String,
      job: String
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
