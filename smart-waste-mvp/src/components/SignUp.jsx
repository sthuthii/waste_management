import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [workerID, setWorkerID] = useState('');
  const [error, setError] = useState('');
  const [allWorkers, setAllWorkers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'workers'));
        const workerList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllWorkers(workerList);
      } catch (err) {
        console.error('Failed to fetch workers:', err);
      }
    };

    fetchWorkers();
  }, []);

  const handleSignUp = async () => {
    setError('');

    if (!email || !password) {
      setError('❌ Please enter all required fields');
      return;
    }

    if (role === 'worker' && !workerID.trim()) {
      setError('❌ Please enter your Worker ID');
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const userData = {
        email,
        role,
      };

      if (role === 'worker') {
        const cleanedID = workerID.trim().toLowerCase();
        const matchedWorker = allWorkers.find(
          (w) => w.id.toLowerCase() === cleanedID
        );

        if (!matchedWorker) {
          setError('❌ Worker ID not found in the system.');
          return;
        }

        userData.workerID = matchedWorker.id;
        userData.name = matchedWorker.name;
        userData.ward = matchedWorker.ward;
      }

      await setDoc(doc(db, 'users', uid), userData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('❌ Sign-up failed');
    }
  };

  const inputStyle = {
    marginBottom: '1rem',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  };

  const buttonStyle = {
    padding: '0.75rem 1rem',
    width: '100%',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: '0.3s ease',
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: '#1976D2',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(to right, #e3f2fd, #f9f9f9)',
        padding: 0,
        boxSizing: 'border-box',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          padding: '2.5rem',
          maxWidth: '420px',
          width: '100%',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>📝 Create an Account</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="citizen">Citizen</option>
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </select>

        {role === 'worker' && (
          <input
            type="text"
            placeholder="Enter Worker ID"
            value={workerID}
            onChange={(e) => setWorkerID(e.target.value.toLowerCase())}
            style={inputStyle}
          />
        )}

        <button onClick={handleSignUp} style={buttonStyle}>
          Register
        </button>

        <button onClick={() => navigate('/login')} style={secondaryButton}>
          Already have an account? Login
        </button>

        {error && (
          <p style={{ color: '#D32F2F', marginTop: '1rem', textAlign: 'center' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
