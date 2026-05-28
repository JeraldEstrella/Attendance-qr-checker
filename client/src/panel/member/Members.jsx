import React, { useState, useEffect } from 'react';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className='members-container'>
      <div className='members-card'>
        <div className='members-header'>
          <h3>All Members</h3>
          <span className='member-count'>{members.length}</span>
        </div>

        {loading ? (
          <p className='no-data'>Loading members...</p>
        ) : members.length > 0 ? (
          <div className='members-list'>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>QR Code</th>
                  <th>Date Added</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member._id}>
                    <td>{member.fullName}</td>
                    <td>{member.qrCode.slice(0, 8)}...</td>
                    <td>{new Date(member.date).toLocaleDateString()}</td>
                    <td>
                      <button className='action-btn edit-btn'>
                        <i className='ti ti-edit'></i>
                      </button>
                      <button className='action-btn delete-btn'>
                        <i className='ti ti-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className='no-data'>No members found</p>
        )}
      </div>
    </div>
  );
};

export default Members;
