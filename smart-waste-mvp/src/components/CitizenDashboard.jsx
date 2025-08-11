import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CitizenDashboard = () => {
  const [houseID, setHouseID] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!houseID.trim()) {
      setStatus('❌ Please enter your House ID.');
      return;
    }

    setStatus('📤 Uploading...');

    try {
      let imageUrl = '';

      if (image) {
        const imageRef = ref(storage, `reports/${houseID}_${Date.now()}.jpg`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'reports'), {
        houseID,
        message: message.trim(),
        imageUrl,
        timestamp: Timestamp.now(),
        resolved: false,
      });

      setStatus('✅ Report submitted successfully.');
      setHouseID('');
      setMessage('');
      setImage(null);
    } catch (error) {
      console.error('Error submitting report:', error);
      setStatus('❌ Submission failed.');
    }
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#4e0505ff' }}>
        Citizen Dashboard
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#555' }}>House Information</h4>
        <input
          type="text"
          placeholder="Enter House ID"
          value={houseID}
          onChange={(e) => setHouseID(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#555' }}>Complaint Details</h4>
        <textarea
          placeholder="Enter your message (e.g., My garbage was not picked up today)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem', color: '#555' }}>📷 Upload Image (Optional)</h4>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ width: '100%' }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#580101ff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
      >
        🚮 Report Missed Pickup
      </button>

      {status && (
        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: status.startsWith('✅')
              ? 'green'
              : status.startsWith('📤')
              ? '#555'
              : 'red',
            fontWeight: 'bold',
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default CitizenDashboard;
