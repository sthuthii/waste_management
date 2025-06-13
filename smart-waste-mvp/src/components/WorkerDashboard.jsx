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

 // Inside WorkerDashboard component
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
          h.id === houseId
            ? { ...h, collectedToday: true, collectedAt }
            : h
        )
      );
    } catch (error) {
      console.error('Error logging collection:', error);
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

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h2>👷 Worker Dashboard</h2>
  <div>
    <button
      onClick={fetchWorkerAndHouses}
      style={{ marginRight: '1rem', background: '#2196F3', color: 'white', padding: '0.5rem', border: 'none' }}
    >
      🔄 Refresh
    </button>
    <button
      onClick={handleLogout}
      style={{ background: 'red', color: 'white', border: 'none', padding: '0.5rem' }}
    >
      Logout
    </button>
  </div>
</div>


      {workerData && (
        <div style={{ marginBottom: '1rem' }}>
          <p>
            <strong>Name:</strong> {workerData.name}
          </p>
          <p>
            <strong>Worker ID:</strong> {workerData.workerID}
          </p>
          <p>
            <strong>Ward:</strong> {workerData.ward}
          </p>
        </div>
      )}

      <h3>🏠 Assigned Houses</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Address</th>
            <th>Status</th>
            <th>Log</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => (
            <tr key={house.id}>
              <td>{house.address}</td>
              <td>
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
              <td>
  {house.collectedToday ? (
    <button onClick={() => resetCollection(house.id)}>
      Reset
    </button>
  ) : (
    <button onClick={() => handleCollection(house.id)}>
      Log Collection
    </button>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkerDashboard;
