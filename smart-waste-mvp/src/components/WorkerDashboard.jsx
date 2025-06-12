import React, { useEffect, useState } from 'react';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const WorkerDashboard = () => {
  const [houseID, setHouseID] = useState('');
  const [status, setStatus] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [workerData, setWorkerData] = useState(null);
  const [timingSaved, setTimingSaved] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkerData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWorkerData({ ...docSnap.data(), id: user.uid });
      }
    };

    fetchWorkerData();
  }, []);

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
            workerID: workerData?.id || 'worker-001',
            timestamp: Timestamp.now(),
            location: { lat: latitude, lng: longitude },
            ward: workerData?.ward || 'unknown'
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

  const handleSaveTimings = async () => {
    if (!startTime || !endTime) {
      alert("Please enter both start and end time.");
      return;
    }

    try {
      await addDoc(collection(db, 'work_sessions'), {
        workerID: workerData?.id,
        name: workerData?.name,
        ward: workerData?.ward,
        startTime,
        endTime,
        createdAt: Timestamp.now()
      });

      setTimingSaved(true);
    } catch (error) {
      console.error("Error saving work timings:", error);
      alert("Failed to save timings.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>👷 Worker Dashboard</h2>
        <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '0.5rem' }}>
          Logout
        </button>
      </div>

      {workerData && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
          <p><strong>Name:</strong> {workerData.name}</p>
          <p><strong>ID:</strong> {workerData.id}</p>
          <p><strong>Ward:</strong> {workerData.ward}</p>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h3>🕒 Work Timings</h3>
        <label>Start Time: </label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <label>End Time: </label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button
          onClick={handleSaveTimings}
          style={{
            marginLeft: '1rem',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem'
          }}
        >
          Save Timings
        </button>
        {timingSaved && <p style={{ color: 'green', marginTop: '0.5rem' }}>✅ Timings saved</p>}
      </div>

      <h3>🚮 Log Collection</h3>
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
