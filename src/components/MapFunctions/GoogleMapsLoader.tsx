import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import '../../styles/components/GoogleMapsStyles.scss'
// Define el contexto para almacenar la configuración de Google Maps
const GoogleMapsContext = createContext<any>(null);

interface GoogleMapsProviderProps {
  children: ReactNode;
}

// Define las librerías fuera del componente para evitar la recreación del array

const GoogleMapsProvider: React.FC<GoogleMapsProviderProps> = ({ children }) => {
  const ApiKeyGoogleMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ApiKeyGoogleMaps,
    libraries: ['places', 'marker'], // Usa la constante `libraries`
    version: 'weekly'
  });

  console.log(ApiKeyGoogleMaps);

  useEffect(() => {
    if (isLoaded) {
    //   const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
    //     // Configuración del marcador avanzado
    //   });
    }
  }, [isLoaded]);

  const value = useMemo(() => ({ isLoaded, loadError }), [isLoaded, loadError]);

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return (
    <GoogleMapsContext.Provider value={value}>
      {isLoaded ? children : <div>Loading...</div>}
    </GoogleMapsContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de Google Maps
const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export { GoogleMapsProvider, useGoogleMaps };
