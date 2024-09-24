import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import '../../styles/components/GoogleMapsStyles.scss';
import Loader from '../Loader/Loader';

const GOOGLE_MAPS_LIBRARIES: Array<'places' | 'geometry' | 'marker' | 'drawing' | 'visualization'> = ['places', 'marker'];


const GoogleMapsContext = createContext<any>(null);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const ApiKeyGoogleMaps = import.meta.env.VITE_API_GOOGLE_MAPS_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ApiKeyGoogleMaps,
    libraries: GOOGLE_MAPS_LIBRARIES,
    version: 'weekly'
  });

  // console.log(ApiKeyGoogleMaps);

  useEffect(() => {
    if (isLoaded) {
      // Código relacionado con la API de Google Maps
    }
  }, [isLoaded]);

  const value = useMemo(() => ({ isLoaded, loadError }), [isLoaded, loadError]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return (
    <GoogleMapsContext.Provider value={value}>
      {isLoaded ? children : <Loader></Loader>}
    </GoogleMapsContext.Provider>
  );
};

const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export { GoogleMapsProvider, useGoogleMaps };
