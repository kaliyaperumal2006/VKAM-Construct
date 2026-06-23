import mongoose from 'mongoose';

const materialDetailSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    default: ''
  },
  approxCost: {
    type: Number,
    default: 0
  }
});

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Standard', 'Premium', 'Luxury']
  },
  priceMultiplier: {
    type: Number,
    required: true,
    default: 1.0
  },
  materials: [materialDetailSchema]
});

const structureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  basePricePerSqFt: {
    type: Number,
    required: true
  },
  packages: [packageSchema]
}, {
  timestamps: true
});

const Structure = mongoose.model('Structure', structureSchema);
export default Structure;
