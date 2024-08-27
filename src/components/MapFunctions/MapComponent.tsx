// MapComponent.tsx
import { useCallback, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { useGoogleMaps } from './GoogleMapsLoader';
import '../../styles/components/MapComponent.scss';

const containerStyle = {
  width: '50%',
  height: 'auto'
};

const MapComponent = ({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) => {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [position, setPosition] = useState({ lat: -34.397, lng: 150.644 });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      onLocationChange(lat, lng);
    }
  }, [onLocationChange]);

  useEffect(() => {
    if (map) {
      if (marker) {
        marker.position = position;
      } else {
        const newMarker = new google.maps.marker.AdvancedMarkerElement({
          position,
          map,
        });
        setMarker(newMarker);
      }
    }
  }, [map, position, marker]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={10}
      onLoad={onMapLoad}
      onClick={onMapClick}
    />
  ) : <></>;
};

export default MapComponent;
