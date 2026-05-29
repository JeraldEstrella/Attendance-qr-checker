import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import './Scanner.css';

export default function Scanner() {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const hasScannedRef = useRef(false); // 👈 guard flag
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const scanner = new QrScanner(
      videoRef.current,
      (res) => {
        if (hasScannedRef.current) return; // 👈 block any duplicate fires
        hasScannedRef.current = true; // 👈 lock immediately

        console.log('Scanned:', res.data);
        scanner.stop();
        setResult(res.data);
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
      hasScannedRef.current = false; // 👈 unlock so user can retry
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ qrCode }),
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
        hasScannedRef.current = false; // 👈 unlock for next scan
        if (scannerRef.current) scannerRef.current.start();
      }, 2000);
    } catch (error) {
      console.error('Error sending to backend:', error);
      setMessage(`✗ Error: ${error.message}`);
      hasScannedRef.current = false; // 👈 unlock on error so user can retry
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
