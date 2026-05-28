import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    unique: true,
    required: true,
  },
  date: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Member', memberSchema);
