import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  setDoc,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';

const AdminWorkerManager = () => {
  const [workerID, setWorkerID] = useState('');
  const [name, setName] = useState('');
  const [ward, setWard] = useState('');
  const [status, setStatus] = useState('');
  const [workers, setWorkers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [filterWard, setFilterWard] = useState('');

  const fetchWorkers = async () => {
    const querySnapshot = await getDocs(collection(db, 'workers'));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setWorkers(list);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSubmit = async () => {
    if (!workerID || !name || !ward) {
      setStatus('❌ Please fill all fields');
      return;
    }

    try {
      await setDoc(doc(db, 'workers', workerID), { name, ward });
      setStatus(isEditing ? '✅ Worker updated' : '✅ Worker added');
      setWorkerID('');
      setName('');
      setWard('');
      setIsEditing(false);
      fetchWorkers(); // refresh list
    } catch (error) {
      console.error(error);
      setStatus('❌ Operation failed');
    }
  };

  const handleEdit = (worker) => {
    setWorkerID(worker.id);
    setName(worker.name);
    setWard(worker.ward);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this worker?")) {
      await deleteDoc(doc(db, 'workers', id));
      setStatus('✅ Worker deleted');
      fetchWorkers(); // refresh
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2>👩‍⚕️ Admin – Manage Workers</h2>

      <input
        type="text"
        placeholder="Worker ID"
        value={workerID}
        onChange={(e) => setWorkerID(e.target.value)}
        disabled={isEditing}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <input
        type="text"
        placeholder="Worker Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <input
        type="text"
        placeholder="Ward"
        value={ward}
        onChange={(e) => setWard(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '0.5rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {isEditing ? 'Update Worker' : 'Add Worker'}
      </button>

      {status && <p style={{ marginTop: '1rem', color: status.startsWith('✅') ? 'green' : 'red' }}>{status}</p>}

      <h3 style={{ marginTop: '2rem' }}>📋 Worker List</h3>
      <input
        type="text"
        placeholder="Filter by Ward"
        value={filterWard}
        onChange={(e) => setFilterWard(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      {workers
        .filter((worker) =>
          worker.ward.toLowerCase().includes(filterWard.toLowerCase())
        )
        .map((worker) => (
          <div
            key={worker.id}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '1rem',
              marginBottom: '1rem',
              borderRadius: '6px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <p><strong>ID:</strong> {worker.id}</p>
              <p><strong>Name:</strong> {worker.name}</p>
              <p><strong>Ward:</strong> {worker.ward}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(worker)}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.3rem 0.6rem',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(worker.id)}
                style={{
                  padding: '0.3rem 0.6rem',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      {workers.filter((w) => w.ward.toLowerCase().includes(filterWard.toLowerCase())).length === 0 && (
        <p>No workers found for this ward.</p>
      )}
    </div>
  );
};

export default AdminWorkerManager;
