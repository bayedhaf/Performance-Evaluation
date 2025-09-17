import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: false 
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluatee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluationType: {
    type: String,
    enum: ['self', 'peer', 'supervisor'],
    required: true
  },
  evaluationPeriod: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  criteria: [{
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
      max: 100,
      required: true
    },
    comment: String,
    evidence: String
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  strengths: [String],
  areasForImprovement: [String],
  recommendations: [String],
  status: {
    type: String,
    enum: ['draft', 'submitted', 'reviewed', 'approved', 'rejected'],
    default: 'draft'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: Date,
  reviewComments: String,
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

// Calculate overall score based on criteria
evaluationSchema.pre('save', function(next) {
  if (this.criteria && this.criteria.length > 0) {
    let totalScore = 0;
    let totalWeight = 0;
    
    this.criteria.forEach(criterion => {
      if (criterion.score !== undefined && criterion.score !== null) {
        totalScore += (criterion.score * criterion.weight) / 100;
        totalWeight += criterion.weight;
      }
    });
    
    this.overallScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
  }
  next();
});

const Evaluation = mongoose.models.Evaluation || mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;
