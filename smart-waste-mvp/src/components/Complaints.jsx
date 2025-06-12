import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ComplaintsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const querySnapshot = await getDocs(collection(db, 'reports'));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReports(list);
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h2>📣 Citizen Complaints</h2>
      {reports.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        reports.map((report) => (
          <div key={report.id} style={{
            backgroundColor: '#f9f9f9',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px'
          }}>
            <p><strong>House ID:</strong> {report.houseID}</p>
            <p><strong>Message:</strong> {report.message}</p>
            {report.timestamp && (
              <p><strong>Date:</strong> {new Date(report.timestamp.seconds * 1000).toLocaleString()}</p>
            )}
            {report.location && (
              <p><strong>Location:</strong> Lat {report.location.lat}, Lng {report.location.lng}</p>
            )}
            {report.imageUrl && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Evidence:</strong><br />
                <img src={report.imageUrl} alt="complaint evidence" style={{ width: '100%', maxWidth: '300px' }} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ComplaintsPage;
