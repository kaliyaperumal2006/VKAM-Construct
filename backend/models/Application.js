import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  referenceId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true
  },
  clientPhone: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  structureType: {
    type: String,
    required: true
  },
  packageType: {
    type: String,
    required: true,
    enum: ['Standard', 'Premium', 'Luxury']
  },
  areaSqFt: {
    type: Number,
    required: true,
    min: [100, 'Area must be at least 100 sq ft']
  },
  budgetMin: {
    type: Number,
    required: true
  },
  budgetMax: {
    type: Number,
    required: true
  },
  approximateCost: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Under Review', 'Approved', 'Declined'],
    default: 'Pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  preferences: {
    type: String,
    default: ''
  },
  assignedEngineer: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    specialization: { type: String, default: '' },
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    accepted: { type: Boolean, default: false }
  },
  progressLogs: [{
    date: {
      type: Date,
      default: Date.now
    },
    stage: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      default: ''
    }
  }],
  messages: [{
    sender: {
      type: String,
      enum: ['Engineer', 'Admin', 'Client'],
      default: 'Engineer'
    },
    message: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
