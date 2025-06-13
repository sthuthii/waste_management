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
        ...doc.data()
      }));
      setHouses(houseList);
    };

    fetchHouses();
  }, []);

  const markUncollected = async (houseId) => {
    const houseRef = doc(db, 'houses', houseId);
    await updateDoc(houseRef, {
      collectedToday: false
    });
    setHouses((prev) =>
      prev.map((h) => h.id === houseId ? { ...h, collectedToday: false } : h)
    );
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
              <td>{house.collectedToday ? '✅ Collected' : '❌ Not Collected'}</td>
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
