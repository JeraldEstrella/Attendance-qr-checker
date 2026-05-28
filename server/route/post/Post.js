import { Router } from 'express';
import Member from '../../monggoDb/model/Member.js';
import Attendance from '../../monggoDb/model/Attendance.js';

const postsRouter = Router();

// POST - Save new member
postsRouter.post('/save', async (req, res) => {
  try {
    const { fullName, qrCode, date } = req.body;

    if (!fullName || !qrCode) {
      return res.status(400).json({
        success: false,
        message: 'Full name and QR code are required',
      });
    }

    // Check if member with same name already exists
    const existingMemberByName = await Member.findOne({ fullName });
    if (existingMemberByName) {
      return res.status(400).json({
        success: false,
        message: 'Member with this name is already registered',
      });
    }

    // Check if member with same QR code already exists
    const existingMemberByQR = await Member.findOne({ qrCode });
    if (existingMemberByQR) {
      return res.status(400).json({
        success: false,
        message: 'QR code is already registered',
      });
    }

    const newMember = new Member({
      fullName,
      qrCode,
      date,
    });

    await newMember.save();

    res.status(201).json({
      success: true,
      message: 'Member saved successfully',
      data: newMember,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST - Record attendance (when QR is scanned)
postsRouter.post('/attendance', async (req, res) => {
  try {
    const { qrCode } = req.body;

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    const member = await Member.findOne({ qrCode });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    const existingAttendance = await Attendance.findOne({
      userId: member._id,
      date,
    });

    if (existingAttendance) {
      const lastScanTime = new Date(
        existingAttendance.createdAt || existingAttendance.timestamp
      );
      const timeDiffSeconds = (now - lastScanTime) / 1000;

      if (timeDiffSeconds < 5) {
        return res.status(400).json({
          success: false,
          message:
            'Duplicate scan detected. Please wait before scanning again.',
        });
      }
    }

    const newAttendance = new Attendance({
      userId: member._id,
      fullName: member.fullName,
      qrCode,
      date,
      day,
      month,
      year,
      time,
      status: 'present',
    });

    await newAttendance.save();

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: newAttendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate attendance record',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default postsRouter;
