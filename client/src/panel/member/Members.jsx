import React, { useState, useEffect } from 'react';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(
        'https://attendance-qr-checker.onrender.com/api/members'
      );
      const data = await response.json();
      if (data.success) {
        setMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const avatarColors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
    '#ef4444',
    '#14b8a6',
  ];

  const getColor = (name) =>
    avatarColors[
      name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) %
        avatarColors.length
    ];

  return (
    <div className='members-page'>
      {/* Top bar */}
      <div className='members-topbar'>
        <div className='members-topbar-left'>
          <h1 className='members-title'>Members</h1>
          <span className='members-total-badge'>{members.length} total</span>
        </div>
        <div className='members-topbar-right'>
          <div className='members-search-wrap'>
            <i className='ti ti-search members-search-icon'></i>
            <input
              className='members-search'
              type='text'
              placeholder='Search members...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className='members-refresh-btn'
            onClick={fetchMembers}
            title='Refresh'
          >
            <i className='ti ti-refresh'></i>
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className='members-card'>
        {loading ? (
          <div className='members-state'>
            <div className='members-spinner'></div>
            <p>Loading members...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className='members-table-wrap'>
            <table className='members-table'>
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Member</th>
                  <th>QR Code ID</th>
                  <th>Date Added</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((member, idx) => (
                  <tr key={member._id} className='members-row'>
                    <td className='members-idx'>{idx + 1}</td>
                    <td>
                      <div className='members-name-cell'>
                        <div
                          className='members-avatar'
                          style={{ background: getColor(member.fullName) }}
                        >
                          {getInitials(member.fullName)}
                        </div>
                        <div>
                          <div className='members-fullname'>
                            {member.fullName}
                          </div>
                          <div className='members-id-sub'>
                            ID: {member._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className='members-qr-code'>
                        {member.qrCode.slice(0, 14)}…
                      </code>
                    </td>
                    <td className='members-date'>
                      {new Date(member.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className='members-status-badge'>Active</span>
                    </td>
                    <td>
                      <div className='members-actions'>
                        <button className='action-btn edit-btn' title='Edit'>
                          <i className='ti ti-edit'></i>
                        </button>
                        <button
                          className='action-btn delete-btn'
                          title='Delete'
                        >
                          <i className='ti ti-trash'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='members-state'>
            <i className='ti ti-users members-empty-icon'></i>
            <p>
              {search ? 'No members match your search.' : 'No members found.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <div className='members-footer'>
          Showing {filtered.length} of {members.length} members
        </div>
      )}
    </div>
  );
};

export default Members;
