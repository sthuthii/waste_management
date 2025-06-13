import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const HouseManager = () => {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      const querySnapshot = await getDocs(collection(db, 'houses'));
      const houseList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouses(houseList);
    };

    fetchHouses();
  }, []);

  const markUncollected = async (houseId) => {
    const houseRef = doc(db, 'houses', houseId);
    await updateDoc(houseRef, {
      collectedToday: false,
      collectedAt: null, // Optionally clear the timestamp
    });
    setHouses((prev) =>
      prev.map((h) =>
        h.id === houseId
          ? { ...h, collectedToday: false, collectedAt: null }
          : h
      )
    );
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
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
    <div style={{ padding: '2rem' }}>
      <h2>🏠 All Houses (Admin)</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Address</th>
            <th>Ward</th>
            <th>Assigned Worker</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {houses.map((house) => (
            <tr key={house.id}>
              <td>{house.address}</td>
              <td>{house.ward}</td>
              <td>{house.assignedTo}</td>
              <td>
                {house.collectedToday ? (
                  <>
                    ✅ Collected
                    <br />
                    <small>{formatDateTime(house.collectedAt)}</small>
                  </>
                ) : (
                  '❌ Not Collected'
                )}
              </td>
              <td>
                {house.collectedToday && (
                  <button onClick={() => markUncollected(house.id)}>
                    Reset to Not Collected
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

export default HouseManager;
