import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const WorkerDashboard = () => {
  const [houseID, setHouseID] = useState('');
  const [status, setStatus] = useState('');

  const handleCollection = async () => {
    if (!houseID.trim()) {
      setStatus("❌ Please enter a valid House ID");
      return;
    }

    setStatus("📍 Fetching location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await addDoc(collection(db, 'collections'), {
            houseID,
            workerID: 'worker-001', // replace with auth logic later
            timestamp: Timestamp.now(),
            location: {
              lat: latitude,
              lng: longitude
            }
          });

          setStatus(`✅ Collection logged for House ${houseID}`);
          setHouseID('');
        } catch (error) {
          console.error("Error logging collection:", error);
          setStatus("❌ Failed to log collection");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setStatus("❌ Location permission denied or not available.");
      }
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>👷 Worker Dashboard</h2>
      <input
        type="text"
        placeholder="Enter House ID"
        value={houseID}
        onChange={(e) => setHouseID(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
      />
      <button
        onClick={handleCollection}
        style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none' }}
      >
        Log Collection
      </button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default WorkerDashboard;
