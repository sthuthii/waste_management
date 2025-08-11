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
      ...doc.data(),
    }));
    setWorkers(list);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleSubmit = async () => {
    if (!workerID || !name || !ward) {
      setStatus('Please fill all fields');
      return;
    }

    try {
      await setDoc(doc(db, 'workers', workerID), { name, ward });
      setStatus(isEditing ? '✅ Worker updated' : '✅ Worker added');
      setWorkerID('');
      setName('');
      setWard('');
      setIsEditing(false);
      fetchWorkers();
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
    if (window.confirm('Are you sure you want to delete this worker?')) {
      await deleteDoc(doc(db, 'workers', id));
      setStatus('✅ Worker deleted');
      fetchWorkers();
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#02560bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const sectionCard = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '2rem',
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto', padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}> Manage Sanitation Workers</h2>

      <div style={sectionCard}>
        <h3 style={{ marginBottom: '1rem', color: '#444' }}>{isEditing ? ' Edit Worker' : 'Add New Worker'}</h3>

        <input
          type="text"
          placeholder="Worker ID"
          value={workerID}
          onChange={(e) => setWorkerID(e.target.value)}
          disabled={isEditing}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Worker Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Ward"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={buttonStyle}>
          {isEditing ? 'Update Worker' : 'Add Worker'}
        </button>

        {status && (
          <p style={{ marginTop: '1rem', color: status.startsWith('✅') ? '#043907ff' : '#480303ff' }}>
            {status}
          </p>
        )}
      </div>

      <div style={sectionCard}>
        <h3 style={{ marginBottom: '1rem', color: '#444' }}>Worker List</h3>

        <input
          type="text"
          placeholder="Filter by Ward"
          value={filterWard}
          onChange={(e) => setFilterWard(e.target.value)}
          style={inputStyle}
        />

        {workers
          .filter((worker) => worker.ward.toLowerCase().includes(filterWard.toLowerCase()))
          .map((worker) => (
            <div
              key={worker.id}
              style={{
                backgroundColor: '#f1f1f1',
                padding: '1rem',
                marginBottom: '1rem',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ flex: 1 }}>
                <p><strong>ID:</strong> {worker.id}</p>
                <p><strong>Name:</strong> {worker.name}</p>
                <p><strong>Ward:</strong> {worker.ward}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(worker)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#00254bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(worker.id)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#600404ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

        {workers.filter((w) => w.ward.toLowerCase().includes(filterWard.toLowerCase())).length === 0 && (
          <p style={{ color: '#666' }}>No workers found for this ward.</p>
        )}
      </div>
    </div>
  );
};

export default AdminWorkerManager;
