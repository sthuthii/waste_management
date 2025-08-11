import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const WorkerDashboard = () => {
  const [houses, setHouses] = useState([]);
  const [workerData, setWorkerData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkerAndHouses();
  }, []);

  const fetchWorkerAndHouses = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      setWorkerData(data);

      const q = query(collection(db, 'houses'), where('assignedTo', '==', data.workerID));
      const querySnapshot = await getDocs(q);
      const houseList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouses(houseList);
    }
  };

  const handleCollection = async (houseId) => {
    try {
      const houseRef = doc(db, 'houses', houseId);
      const collectedAt = Timestamp.now();

      await updateDoc(houseRef, {
        collectedToday: true,
        collectedAt,
      });

      setHouses((prev) =>
        prev.map((h) =>
          h.id === houseId ? { ...h, collectedToday: true, collectedAt } : h
        )
      );
    } catch (error) {
      console.error('Error logging collection:', error);
    }
  };

  const resetCollection = async (houseId) => {
    try {
      const houseRef = doc(db, 'houses', houseId);
      await updateDoc(houseRef, {
        collectedToday: false,
        collectedAt: null,
      });

      setHouses((prev) =>
        prev.map((h) =>
          h.id === houseId ? { ...h, collectedToday: false, collectedAt: null } : h
        )
      );
    } catch (error) {
      console.error('Error resetting collection:', error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const formatDate = (timestamp) => {
    const date = timestamp?.toDate();
    if (!date) return '';
    return `${date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} at ${date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2>Worker Dashboard</h2>
        <div>
          <button
            onClick={fetchWorkerAndHouses}
            style={{
              marginRight: '1rem',
              background: '#07396aff',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: '#670707ff',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {workerData && (
        <div style={{
          marginBottom: '2rem',
          backgroundColor: '#ffffffff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 6px 6px rgba(0,0,0,0.1)'
        }}>
          <p><strong>Name:</strong> {workerData.name}</p>
          <p><strong>Worker ID:</strong> {workerData.workerID}</p>
          <p><strong>Ward:</strong> {workerData.ward}</p>
        </div>
      )}

      <h3 style={{ marginBottom: '1rem' }}>Assigned Houses</h3>

      <div style={{
        overflowX: 'auto',
        backgroundColor: '#ffffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0.8, 0.8, 0.8, 0.08)',
        padding: '1rem'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
          <thead style={{ backgroundColor: '#600202ff', color: 'white' }}>
            <tr>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Address</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {houses.map((house, index) => (
              <tr
                key={house.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#fafafa' : '#f0f0f0'
                }}
              >
                <td style={{ padding: '0.75rem' }}>{house.address}</td>
                <td style={{ padding: '0.75rem' }}>
                  {house.collectedToday ? (
                    <>
                      ✅ Collected
                      <br />
                      <small>{formatDate(house.collectedAt)}</small>
                    </>
                  ) : (
                    '❌ Not Collected'
                  )}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {house.collectedToday ? (
                    <button
                      onClick={() => resetCollection(house.id)}
                      style={{
                        background: '#6a0606ff',
                        color: '#fff',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Reset
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCollection(house.id)}
                      style={{
                        background: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Log Collection
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {houses.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '1rem' }}>
                  No houses assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerDashboard;
