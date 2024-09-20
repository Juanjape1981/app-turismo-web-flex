import { useState } from 'react';
import CreateBranchForm from '../components/CreateBranch/CreateBranchForm';
import MapComponent from '../components/MapFunctions/MapComponent';
import '../styles/pages/_createBranch.scss'

const CreateBranchPage = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleCreateBranch = (data: any) => {
    if (latitude !== null && longitude !== null) {
      data.latitude = latitude;
      data.longitude = longitude;
      console.log('Sucursal creada:', data);
      // Aquí iría la llamada a la API para enviar los datos
    }
  };
  const handleAddressBlur = (address: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        setLatitude(location.lat());
        setLongitude(location.lng());
      } else {
        console.error('Geocode fue fallido por la siguiente razón: ' + status);
      }
    });
  };
  return (
    <div className='allContainerMap'>
      <h1>Crear Sucursal</h1>
      <div className='containerMap-form'>
      <CreateBranchForm
          onSubmit={handleCreateBranch}
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          onAddressBlur={handleAddressBlur}
        />
        <MapComponent center={undefined} zoom={undefined} markerPosition={undefined} editMode={true} onLocationChange={(lat:any, lng:any) => {
        setLatitude(lat);
        setLongitude(lng);
      }} />
      </div>
      
    </div>
  );
};

export default CreateBranchPage;
