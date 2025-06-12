import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [roleMatch, setRoleMatch] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userRole = docSnap.data().role;
          if (allowedRoles.includes(userRole)) {
            setRoleMatch(true);
          }
        }
      }
      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!roleMatch) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
