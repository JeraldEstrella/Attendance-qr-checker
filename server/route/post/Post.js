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

    const existingMemberByName = await Member.findOne({ fullName });
    if (existingMemberByName) {
      return res.status(400).json({
        success: false,
        message: 'Member with this name is already registered',
      });
    }

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
    const time = now.toISOString().split('T')[1].slice(0, 8);
    const month = now.getUTCMonth() + 1;
    const year = now.getUTCFullYear();
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
      return res.status(409).json({
        success: false,
        message: `Attendance already recorded for ${member.fullName} today (${date})`,
      });
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
      return res.status(409).json({
        success: false,
        message: 'Attendance already recorded for today',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE - Delete a member
postsRouter.delete('/members/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.json({
      success: true,
      message: 'Member deleted successfully',
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default postsRouter;
