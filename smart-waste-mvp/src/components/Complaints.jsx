import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const ComplaintsPage = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const querySnapshot = await getDocs(collection(db, 'reports'));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReports(list);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      await deleteDoc(doc(db, 'reports', id));
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>📣 Citizen Complaints</h2>

      {reports.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>No complaints found.</p>
      ) : (
        reports.map((report) => (
          <div
            key={report.id}
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}
          >
            <p><strong>🏠 House ID:</strong> {report.houseID}</p>
            <p><strong>📝 Message:</strong> {report.message}</p>
            {report.timestamp && (
              <p><strong>📅 Date:</strong> {new Date(report.timestamp.seconds * 1000).toLocaleString()}</p>
            )}
            {report.location && (
              <p><strong>📍 Location:</strong> Lat {report.location.lat}, Lng {report.location.lng}</p>
            )}
            {report.imageUrl && (
              <div style={{ marginTop: '0.75rem' }}>
                <strong>📷 Evidence:</strong><br />
                <img
                  src={report.imageUrl}
                  alt="complaint evidence"
                  style={{ width: '100%', maxWidth: '300px', borderRadius: '6px', marginTop: '0.5rem' }}
                />
              </div>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => handleDelete(report.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#D32F2F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
              <button
                onClick={() => alert('✅ Marked as handled!')} // placeholder action
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#388E3C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Mark as Checked
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ComplaintsPage;
