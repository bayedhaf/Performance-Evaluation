import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  category: {
    type: String,
    enum: ['self_evaluation', 'peer_evaluation', 'other'],
    required: true
  },
  dueDate: {
    type: Date
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  maxScore: {
    type: Number,
    default: 100
  },
  evaluationCriteria: [{
    criterion: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      min: 0,
      max: 100,
      default: 10
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    comment: String
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total score based on evaluation criteria
taskSchema.virtual('totalScore').get(function() {
  if (!this.evaluationCriteria || this.evaluationCriteria.length === 0) {
    return this.score || 0;
  }
  
  let totalScore = 0;
  let totalWeight = 0;
  
  this.evaluationCriteria.forEach(criterion => {
    if (criterion.score !== undefined && criterion.score !== null) {
      totalScore += (criterion.score * criterion.weight) / 100;
      totalWeight += criterion.weight;
    }
  });
  
  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
});

// Ensure virtual fields are serialized
taskSchema.set('toJSON', {
  virtuals: true
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
