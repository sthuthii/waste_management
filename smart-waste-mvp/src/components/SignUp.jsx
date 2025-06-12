import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Store user role in Firestore
      await setDoc(doc(db, 'users', uid), {
        email,
        role
      });

      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('❌ Sign-up failed');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
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
      <button onClick={handleSignUp} style={{ padding: '0.5rem 1rem' }}>
        Register
      </button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default SignUp;
