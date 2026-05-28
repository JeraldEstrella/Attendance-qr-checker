import QrGenerator from '../../components/qr-form/Qr-generator';
import Scanner from '../../components/scanner/Scanner';
import './Dashboard.css';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const today = new Date();
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [monthlyHeights, setMonthlyHeights] = useState([
    [90, 72],
    [78, 62],
    [60, 50],
    [40, 32],
  ]);
  const [stats, setStats] = useState([
    {
      label: 'Present Today',
      value: '0',
      change: 'Loading...',
      isHighlight: true,
      type: 'up',
    },
    { label: 'Absent', value: '0', change: 'Loading...', type: 'down' },
    {
      label: 'Attendance Rate',
      value: '0%',
      change: 'Loading...',
      type: 'up',
    },
  ]);

  // Fetch data on component mount
  useEffect(() => {
    fetchTodayStats();
    fetchMonthlyStats();
  }, []);

  const fetchTodayStats = async () => {
    try {
      const response = await fetch(
        'http://localhost:3000/api/attendance/today'
      );
      const data = await response.json();

      if (data.success) {
        const presentCount = data.count;
        const totalMembers = 50;
        const absentCount = totalMembers - presentCount;
        const attendanceRate = Math.round((presentCount / totalMembers) * 100);

        setStats([
          {
            label: 'Present Today',
            value: presentCount.toString(),
            change: `↑ ${presentCount > 40 ? '3' : '1'} vs yesterday`,
            isHighlight: true,
            type: 'up',
          },
          {
            label: 'Absent',
            value: absentCount.toString(),
            change: `${absentCount > 5 ? '↑' : '↓'} ${Math.abs(absentCount - 5)} from avg`,
            type: absentCount > 5 ? 'down' : 'up',
          },
          {
            label: 'Attendance Rate',
            value: `${attendanceRate}%`,
            change: `${attendanceRate > 80 ? '↑' : '↓'} ${Math.abs(attendanceRate - 85)}% vs avg`,
            type: attendanceRate > 80 ? 'up' : 'down',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchMonthlyStats = async () => {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    const monthData = [];

    // Get last 4 months
    for (let i = 3; i >= 0; i--) {
      let month = currentMonth - i;
      let year = currentYear;

      // Handle month wrapping
      if (month <= 0) {
        month += 12;
        year -= 1;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/attendance/month/${month}/${year}`
        );
        const data = await response.json();

        if (data.success) {
          const presentCount = data.count;
          const totalMembers = 50;
          const absentCount = totalMembers - presentCount;
          monthData.push([presentCount, absentCount]);
        }
      } catch (error) {
        console.error(`Error fetching month ${month}/${year}:`, error);
        monthData.push([0, 0]);
      }
    }

    setMonthlyHeights(monthData);
  };

  const handleOverlayClick = (e) => {
    if (e.target.id === 'qrModal') setQrModalOpen(false);
    if (e.target.id === 'generateModal') setGenerateModalOpen(false);
  };

  return (
    <div className='dashboard' style={{ position: 'relative' }}>
      {/* Header */}
      <div className='dashboard-header'>
        <div>
          <p>
            {today.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className='header-icons'>
          <button
            className='icon-btn scan-btn'
            onClick={() => setQrModalOpen(true)}
            title='Scan QR Code'
          >
            <i className='ti ti-scan'></i>
            <span>Scan QR</span>
          </button>
          <button
            className='icon-btn gen-btn'
            onClick={() => setGenerateModalOpen(true)}
            title='Generate QR Code'
          >
            <i className='ti ti-qrcode'></i>
            <span>Generate QR</span>
          </button>
          <button
            className='icon-btn notif-btn'
            title='Refresh'
            onClick={() => {
              fetchTodayStats();
              fetchMonthlyStats();
            }}
          >
            <i className='ti ti-refresh'></i>
            <div className='badge'></div>
          </button>
          <button className='icon-btn' title='Search'>
            <i className='ti ti-search'></i>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='stats-grid'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`stat-card ${stat.isHighlight ? 'hl' : ''}`}
          >
            <label>{stat.label}</label>
            <h2>{stat.value}</h2>
            <p className={`stat-change ${stat.type}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className='charts-grid'>
        <div className='chart-card'>
          <div className='chart-header'>
            <h3>Attendance Overview</h3>
            <span className='date-range'>Last 4 months</span>
          </div>
          <div className='chart-area'>
            {['Jan', 'Feb', 'Mar', 'Apr'].map((month, idx) => (
              <div key={month} className='bar-group'>
                <div className='bars'>
                  <div
                    className='bar b1'
                    style={{ height: `${monthlyHeights[idx][0]}px` }}
                  ></div>
                  <div
                    className='bar b2'
                    style={{ height: `${monthlyHeights[idx][1]}px` }}
                  ></div>
                </div>
                <div className='bar-month'>{month}</div>
              </div>
            ))}
          </div>
          <div className='chart-legend'>
            <div className='legend-item'>
              <div
                className='legend-box'
                style={{ background: '#6366f1' }}
              ></div>
              Present
            </div>
            <div className='legend-item'>
              <div
                className='legend-box'
                style={{ background: '#8b5cf670' }}
              ></div>
              Absent
            </div>
          </div>
        </div>

        <div className='calendar-card'>
          <div className='cal-header'>
            <div>
              <div className='cal-month'>May 2026</div>
              <div className='cal-year'>Current month</div>
            </div>
            <div className='cal-nav'>
              <button className='cal-nav-btn'>
                <i className='ti ti-chevron-left'></i>
              </button>
              <button className='cal-nav-btn'>
                <i className='ti ti-chevron-right'></i>
              </button>
            </div>
          </div>
          <div className='cal-grid'>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className='cal-dow'>
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, idx) => {
              const day = idx - 3;
              return (
                <div
                  key={idx}
                  className={`cal-day ${day === 28 ? 'today' : ''} ${[8, 14].includes(day) ? 'has-event' : ''}`}
                >
                  {day > 0 && day <= 31 ? day : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scan QR Modal */}
      {qrModalOpen && (
        <div
          className={`modal-overlay ${qrModalOpen ? 'open' : ''}`}
          id='qrModal'
          onClick={handleOverlayClick}
        >
          <div className='modal'>
            <Scanner />
          </div>
        </div>
      )}

      {/* Generate QR Modal */}
      {generateModalOpen && (
        <div
          className='modal-overlay open'
          id='generateModal'
          onClick={handleOverlayClick}
        >
          <QrGenerator onClose={() => setGenerateModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
