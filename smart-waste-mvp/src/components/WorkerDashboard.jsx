import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const WorkerDashboard = () => {
  const [houses, setHouses] = useState([]);
  const [workerData, setWorkerData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkerAndHouses = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Step 1: Get worker info from users collection
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setWorkerData(data);

        // Step 2: Get houses assigned to this worker
        const q = query(collection(db, 'houses'), where('assignedTo', '==', data.workerID));
        const querySnapshot = await getDocs(q);
        const houseList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setHouses(houseList);
      }
    };

    fetchWorkerAndHouses();
  }, []);

  const handleCollection = async (houseId) => {
    try {
      const houseRef = doc(db, 'houses', houseId);
      await updateDoc(houseRef, {
        collectedToday: true
      });
      setHouses(prev =>
        prev.map(h => h.id === houseId ? { ...h, collectedToday: true } : h)
      );
    } catch (error) {
      console.error('Error logging collection:', error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>👷 Worker Dashboard</h2>
        <button onClick={handleLogout} style={{ background: 'red', color: 'white', border: 'none', padding: '0.5rem' }}>
          Logout
        </button>
      </div>

      {workerData && (
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>Name:</strong> {workerData.name}</p>
          <p><strong>Worker ID:</strong> {workerData.workerID}</p>
          <p><strong>Ward:</strong> {workerData.ward}</p>
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
              <td>{house.collectedToday ? '✅ Collected' : '❌ Not Collected'}</td>
              <td>
                {!house.collectedToday && (
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
