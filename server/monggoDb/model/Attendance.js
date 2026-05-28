import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Format: "2026-05-28"
    required: true,
  },
  day: {
    type: String, // "Monday", "Tuesday", etc.
  },
  month: {
    type: Number, // 1-12
    required: true,
  },
  year: {
    type: Number, // 2026
    required: true,
  },
  time: {
    type: String, // Format: "10:30:45"
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create index for faster queries by date and month
attendanceSchema.index({ date: 1, month: 1, year: 1 });
attendanceSchema.index({ userId: 1, month: 1, year: 1 });

export default mongoose.model('Attendance', attendanceSchema);
