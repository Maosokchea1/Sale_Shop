import React, { useState, useEffect } from 'react';
import { XMarkIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

const KHQRPaymentModal = ({ isOpen, onClose, paymentUrl, amount, orderNumber, transactionId }) => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, success, failed

  useEffect(() => {
    if (isOpen) {
      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Check payment status every 5 seconds
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);
      
      return () => {
        clearInterval(timer);
        clearInterval(interval);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, transactionId]);

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/payments/verify/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPaymentStatus('success');
        setTimeout(() => {
          onClose();
          window.location.href = '/orders';
        }, 2000);
      }
    } catch (error) {
      console.error('Error checking payment:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    if (paymentUrl) {
      navigator.clipboard.writeText(paymentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-lg">🏦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">KHQR Payment</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-green-600 text-2xl mb-1">✓</div>
              <p className="text-green-800 font-semibold">Payment Successful!</p>
              <p className="text-green-600 text-sm">Redirecting to orders...</p>
            </div>
          )}

          {/* Timer */}
          <div className="mb-4 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Time remaining: <span className="font-mono font-bold ml-1">{formatTime(countdown)}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary-600">${amount?.toFixed(2)}</p>
            <p className="text-xs text-gray-400 mt-1">Order #{orderNumber}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-xl shadow-lg border">
              {paymentUrl ? (
                <img 
                  src={`https://chart.googleapis.com/chart?chs=220x220&cht=qr&chl=${encodeURIComponent(paymentUrl)}&choe=UTF-8`}
                  alt="QR Code"
                  className="w-48 h-48"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x200?text=QR+Code';
                  }}
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse text-gray-400">Loading QR...</div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-sm mb-2">How to pay:</h4>
            <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
              <li>Open your banking app (ABA, ACLEDA, Wing, etc.)</li>
              <li>Scan the QR code above</li>
              <li>Enter amount: <span className="font-bold">${amount?.toFixed(2)}</span></li>
              <li>Confirm payment</li>
              <li>Payment will be verified automatically</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.open(paymentUrl, '_blank')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Open Banking App
            </button>
            
            <button
              onClick={handleCopyLink}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <CheckIcon className="h-5 w-5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-5 w-5" />
                  Copy Payment Link
                </>
              )}
            </button>
          </div>

          {/* Note */}
          <p className="text-center text-xs text-gray-400 mt-4">
            After payment, please wait a moment for verification. You will be redirected automatically.
          </p>

          {/* Transaction ID */}
          {transactionId && (
            <p className="text-center text-xs text-gray-300 mt-2" title={transactionId}>
              Ref: {transactionId.substring(0, 12)}...
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default KHQRPaymentModal;