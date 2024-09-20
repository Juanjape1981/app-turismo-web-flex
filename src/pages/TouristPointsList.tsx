import React, { useState } from 'react';
import { Button, Card, Typography, Grid, Pagination } from '@mui/material';
import { Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchAllTouristPoints } from '../redux/actions/touristPointActions';
import '../styles/pages/TouristPointsList.scss';
import { TouristPoint } from '../models/TouristPoint';
import { RootState } from '../redux/store/store';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';

const TouristPointsList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const touristPoints = useAppSelector((state: RootState) => state.touristPoints.allTouristPoints).filter(touristPoint => { return touristPoint.status.name === 'active'});;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
console.log("todos los puntos turisticos",touristPoints);

  React.useEffect(() => {
    dispatch(fetchAllTouristPoints());
  }, [dispatch]);

  const handlePageChange = ( page: number) => {
    setCurrentPage(page);
  };

  // Paginación
  const paginatedTouristPoints = touristPoints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="tourist-points-list">
      <div className="button-container">
        <Button variant="contained" className="add-button"onClick={() => navigate('/create-tourist-point')}>
          Crear Punto Turístico
        </Button>
      </div>
      <Grid container spacing={2} justifyContent="center">
        {paginatedTouristPoints.map((point: TouristPoint) => (
          <Grid item xs={12} sm={6} md={4} key={point.id}>
            <Card className="tourist-point-card" onClick={() => navigate(`/tourist-points/${point.id}`)}>
              <img src={point.images[0]?.image_path} alt={point.title} className="card-image" />
              <div className="card-content">
                <div className='nameRating'>
                    <Typography variant="h6">{point.title}</Typography>
                    <Rating name="read-only" value={point.average_rating} readOnly precision={0.5} />    
                </div>
                
                <Typography variant="body2">
                  {point.description.slice(0, 100)}...
                </Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      {touristPoints.length > itemsPerPage && (
        <Pagination
          count={Math.ceil(touristPoints.length / itemsPerPage)}
          page={currentPage}
          onChange={(_, page) => handlePageChange(page)}
          className="pagination"
        />
      )}
    </div>
  );
};

export default TouristPointsList;
