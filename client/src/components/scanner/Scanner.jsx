import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import './Scanner.css';

export default function Scanner() {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current,
      (res) => {
        console.log('Scanned:', res.data);
        setResult(res.data);
        scanner.stop();
        sendToBackend(res.data);
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    scannerRef.current = scanner;
    scanner.start();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const sendToBackend = async (qrCode) => {
    if (!qrCode.trim()) {
      setMessage('Invalid QR code');
      if (scannerRef.current) scannerRef.current.start();
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        'https://attendance-qr-checker.onrender.com/api/attendance',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            qrCode: qrCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to record attendance');
      }

      const data = await response.json();
      console.log('Attendance recorded:', data);
      setMessage(`✓ Attendance recorded for: ${data.data.fullName}`);

      setTimeout(() => {
        setResult('');
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error sending to backend:', error);
      setMessage(`✗ Error: ${error.message}`);
      if (scannerRef.current) scannerRef.current.start();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='scanner-container'>
      <h2>QR Scanner</h2>

      <video ref={videoRef} style={{ width: '100%', maxWidth: '500px' }} />

      {result && (
        <div className='scanner-result'>
          <p>
            <strong>Scanned ID:</strong> {result}
          </p>
        </div>
      )}

      {message && (
        <p
          className={`scanner-message ${message.includes('✓') ? 'success' : 'error'}`}
        >
          {message}
        </p>
      )}

      {loading && <p className='scanner-loading'>Recording attendance...</p>}

      {result && !loading && (
        <button onClick={() => sendToBackend(result)}>Retry Send</button>
      )}
    </div>
  );
}
