import React, { useState } from 'react';

const TestModal = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        style={{ padding: '10px 20px', background: 'blue', color: 'white' }}
      >
        TEST MODAL BUTTON
      </button>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h2>TEST MODAL WORKS!</h2>
            <p>If you see this, the modal component is working.</p>
            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', marginTop: '10px' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestModal;