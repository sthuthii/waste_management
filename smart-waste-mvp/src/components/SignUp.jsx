import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // ✅ Added getDoc
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [workerID, setWorkerID] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
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
        const workerRef = doc(db, 'workers', workerID.trim());
        const workerSnap = await getDoc(workerRef);

        if (!workerSnap.exists()) {
          setError('❌ Worker ID not found in admin list.');
          return;
        }

        const { name, ward } = workerSnap.data();
        userData.workerID = workerID;
        userData.name = name;
        userData.ward = ward;
      }

      await setDoc(doc(db, 'users', uid), userData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('❌ Sign-up failed');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        padding: '2rem',
        maxWidth: '400px',
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2>📝 Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
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
            onChange={(e) => setWorkerID(e.target.value)}
            style={{ marginBottom: '1rem', width: '100%', padding: '0.5rem' }}
          />
        )}

        <button
          onClick={handleSignUp}
          style={{
            padding: '0.5rem 1rem',
            width: '100%',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Register
        </button>

        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: '0.5rem',
            padding: '0.5rem 1rem',
            width: '100%',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Already have an account? Login
        </button>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
};

export default SignUp;
