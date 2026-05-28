import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './Qr-generator.css';

const QrGenerator = ({ onClose }) => {
  const qrRef = useRef(null);
  const [generated, setGenerated] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSaveMember = async () => {
    if (!form.name.trim() || !qrValue) {
      alert('Please generate a QR code first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.name,
          qrCode: qrValue,
          date: form.date,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save member');
      }

      const data = await response.json();
      console.log('Member saved:', data);
      alert('Member saved successfully!');
      handleReset();
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Error saving member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setGenerated(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return;

    // Unique ID for QR (recommended instead of name/date)
    const id = `MEM-${Date.now()}`;

    setQrValue(id);
    setGenerated(true);
  };

  const handleReset = () => {
    setForm({
      name: '',
      date: new Date().toISOString().split('T')[0],
    });

    setGenerated(false);
    setQrValue('');
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    // Convert canvas to PNG and download
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `qr-code-${qrValue}.png`;
    link.click();
  };

  return (
    <div className='qrgen-card'>
      {/* Close */}
      <button className='close-btn' onClick={onClose}>
        <i className='ti ti-x'></i>
      </button>

      {/* Header */}
      <div className='qrgen-header'>
        <div className='qrgen-icon'>
          <i className='ti ti-qrcode'></i>
        </div>
        <div>
          <div className='qrgen-title'>Generate QR Code</div>
          <div className='qrgen-subtitle'>
            Fill in the details to create an attendance QR
          </div>
        </div>
      </div>

      {/* Form */}
      <form className='qrgen-form' onSubmit={handleSubmit}>
        <div className='qrgen-field'>
          <label>Full Name</label>
          <input
            type='text'
            name='name'
            placeholder='e.g. Juan dela Cruz'
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className='qrgen-field'>
          <label>Date</label>
          <input
            type='date'
            name='date'
            value={form.date}
            onChange={handleChange}
          />
        </div>

        {form.name && (
          <button
            type='submit'
            className='qrgen-btn'
            disabled={!form.name.trim()}
          >
            <i className='ti ti-qrcode'></i>
            Generate QR Code
          </button>
        )}
      </form>

      {/* QR PREVIEW */}
      {generated && (
        <div className='qrgen-preview'>
          {/* Only QR Code - This gets printed */}
          <div ref={qrRef}>
            <div className='qrgen-qr-box'>
              <QRCodeCanvas value={qrValue} size={220} includeMargin={true} />
            </div>
          </div>

          <div className='qrgen-info no-print'>
            <small>ID: {qrValue}</small>
          </div>

          <div className='qrgen-actions no-print'>
            <button
              className='qrgen-save-btn'
              onClick={handleSaveMember}
              disabled={loading}
            >
              <i className='ti ti-check'></i>
              {loading ? 'Saving...' : 'Save Member'}
            </button>

            <button className='qrgen-dl-btn' onClick={handleDownload}>
              <i className='ti ti-printer'></i> Print
            </button>

            <button className='qrgen-reset-btn' onClick={handleReset}>
              <i className='ti ti-refresh'></i> Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrGenerator;
