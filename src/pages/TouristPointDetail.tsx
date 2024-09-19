import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Card, Container, Grid } from '@mui/material';
import { Rating } from '@mui/material';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { deleteTouristPointById, fetchTouristPointById } from '../redux/actions/touristPointActions';
import { RootState } from '../redux/store/store';
import '../styles/pages/TouristPointDetail.scss';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';

const TouristPointDetail = () => {
    const ApiKeyGoogleMaps = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const touristPoint = useAppSelector((state: RootState) => state.touristPoints.selectedTouristPoint);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(touristPoint?.images[0]?.image_path);
console.log("punto turistico seleccionado", touristPoint);

  React.useEffect(() => {
    if (id) {
      dispatch(fetchTouristPointById(Number(id)));
    }
  }, [id, dispatch]);

  const handleDelete = () => {
    if (id) {
      dispatch(deleteTouristPointById(Number(id)));
      navigate('/tourist-points');
    }
  };

  const handleEdit = () => {
    navigate(`/edit-tourist-point/${id}`);
  };

  if (!touristPoint) return <div>Loading...</div>;

  return (
    <Container className="tourist-point-detail">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card className="detail-card">
            <img src={selectedImage} alt={touristPoint.title} className="detail-image" />
            <Typography variant="h4">{touristPoint.title}</Typography>
            <Rating name="read-only" value={touristPoint.average_rating} readOnly precision={0.5} />
            <Typography variant="body1">{touristPoint.description}</Typography>
            <div className="buttons-container">
              <Button
                className='btnEdit'
                startIcon={<FaEdit />}
                onClick={handleEdit}
              >
                Editar
              </Button>
              <Button
                className='btnDelete'
                startIcon={<FaTrashAlt />}
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            </div>
          </Card>
          <Grid container spacing={1} className="thumbnails-container">
            {touristPoint.images.slice(1).map((image) => (
              <Grid item key={image.id}>
                <img
                  src={image.image_path}
                  alt="Thumbnail"
                  className="thumbnail"
                  onClick={() => setSelectedImage(image.image_path)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className="map-card">
            <LoadScript googleMapsApiKey={ApiKeyGoogleMaps}>
              <GoogleMap
                center={{ lat: touristPoint.latitude, lng: touristPoint.longitude }}
                zoom={13}
                mapContainerStyle={{ height: '100%', width: '100%' }}
              >
                <Marker position={{ lat: touristPoint.latitude, lng: touristPoint.longitude }} />
              </GoogleMap>
            </LoadScript>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TouristPointDetail;