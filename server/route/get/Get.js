import { Router } from 'express';
import Attendance from '../../monggoDb/model/Attendance.js';
import Member from '../../monggoDb/model/Member.js';

const getRouter = Router();

// GET - All attendance records
getRouter.get('/attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('userId', 'fullName qrCode')
      .sort({ timestamp: -1 });

    res.json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET - Today's attendance (CURRENT DAY)
getRouter.get('/attendance/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // "2026-05-28"

    const attendance = await Attendance.find({ date: today })
      .populate('userId', 'fullName qrCode email') // Populate user info
      .sort({ time: 1 });

    res.json({
      success: true,
      count: attendance.length,
      date: today,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET - Attendance for specific date
getRouter.get('/attendance/date/:date', async (req, res) => {
  try {
    const { date } = req.params;

    const attendance = await Attendance.find({ date })
      .populate('userId', 'fullName qrCode')
      .sort({ time: 1 });

    res.json({
      success: true,
      count: attendance.length,
      date,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET - Attendance for specific month/year
getRouter.get('/attendance/month/:month/:year', async (req, res) => {
  try {
    const { month, year } = req.params;

    const attendance = await Attendance.find({
      month: parseInt(month),
      year: parseInt(year),
    })
      .populate('userId', 'fullName qrCode')
      .sort({ date: 1 });

    res.json({
      success: true,
      month,
      year,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET - Attendance for specific user in a month
getRouter.get(
  '/attendance/user/:userId/month/:month/:year',
  async (req, res) => {
    try {
      const { userId, month, year } = req.params;

      const attendance = await Attendance.find({
        userId,
        month: parseInt(month),
        year: parseInt(year),
      })
        .populate('userId', 'fullName qrCode email')
        .sort({ date: 1 });

      res.json({
        success: true,
        userId,
        month,
        year,
        count: attendance.length,
        data: attendance,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// GET - All members
getRouter.get('/members', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default getRouter;
