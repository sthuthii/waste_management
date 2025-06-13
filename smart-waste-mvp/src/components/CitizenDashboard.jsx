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
      setStatus("❌ Please enter your House ID.");
      return;
    }

    setStatus("📤 Uploading...");

    try {
      let imageUrl = '';

      // Upload image if present
      if (image) {
        const imageRef = ref(storage, `reports/${houseID}_${Date.now()}.jpg`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Store report in Firestore
      await addDoc(collection(db, 'reports'), {
        houseID,
        message: message.trim(),
        imageUrl,
        timestamp: Timestamp.now(),
        resolved: false,
      });

      setStatus("✅ Report submitted successfully.");
      setHouseID('');
      setMessage('');
      setImage(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      setStatus("❌ Submission failed.");
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>🙋 Citizen Dashboard</h2>

      <input
        type="text"
        placeholder="Enter House ID"
        value={houseID}
        onChange={(e) => setHouseID(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />

      <textarea
        placeholder="Enter your message (e.g., My garbage was not picked up today)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', resize: 'vertical' }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginBottom: '1rem' }}
      />

      <button
        onClick={handleSubmit}
        style={{ padding: '0.5rem 1rem', background: '#2196F3', color: 'white', border: 'none' }}
      >
        Report Missed Pickup
      </button>

      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default CitizenDashboard;
