import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 12.9141,
  lng: 74.8560,
};

const AdminMapView = () => {
  const [collections, setCollections] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchCollections = async () => {
      const querySnapshot = await getDocs(collection(db, 'collections'));
      const data = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((item) => item.location);
      setCollections(data);
    };

    fetchCollections();
  }, []);

  return (
    <div>
      <h2>📍 Admin Dashboard – Waste Collection Map</h2>

      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {collections.map((log, index) => (
            <Marker
              key={index}
              position={{
                lat: log.location.lat,
                lng: log.location.lng,
              }}
              label={log.houseID}
            />
          ))}
        </GoogleMap>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default AdminMapView;
