import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const HouseManager = () => {
  const [houses, setHouses] = useState([]);
  const [filterWard, setFilterWard] = useState('');

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
      collectedAt: null,
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

  const filteredHouses = houses.filter((house) =>
    house.ward.toLowerCase().includes(filterWard.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>All Houses</h2>

      <input
        type="text"
        placeholder="Filter by Ward"
        value={filterWard}
        onChange={(e) => setFilterWard(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          marginBottom: '1.5rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          fontSize: '1rem',
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden' }}>
        <thead style={{ backgroundColor: '#610101ff', color: 'white' }}>
          <tr>
            <th style={{ padding: '1rem' }}>Address</th>
            <th style={{ padding: '1rem' }}>Ward</th>
            <th style={{ padding: '1rem' }}>Assigned Worker</th>
            <th style={{ padding: '1rem' }}>Status</th>
            <th style={{ padding: '1rem' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredHouses.length > 0 ? (
            filteredHouses.map((house) => (
              <tr key={house.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{house.address}</td>
                <td style={{ padding: '1rem' }}>{house.ward}</td>
                <td style={{ padding: '1rem' }}>{house.assignedTo || '—'}</td>
                <td style={{ padding: '1rem' }}>
                  {house.collectedToday ? (
                    <>
                      ✅ Collected
                      <br />
                      <small style={{ color: '#555' }}>{formatDateTime(house.collectedAt)}</small>
                    </>
                  ) : (
                    <span style={{ color: '#D32F2F' }}>Not Collected</span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  {house.collectedToday && (
                    <button
                      onClick={() => markUncollected(house.id)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        backgroundColor: '#89630bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Reset
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: '#777' }}>
                No houses found for this ward.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HouseManager;
