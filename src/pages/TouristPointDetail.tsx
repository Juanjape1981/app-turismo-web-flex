import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Card, Container, Grid, TextField } from '@mui/material';
import { Rating } from '@mui/material';
import { FaEdit, FaTrashAlt, FaSave, FaPlusCircle, FaTimesCircle } from 'react-icons/fa';
import { deleteTouristPointById, fetchTouristPointById, updateTouristPointById } from '../redux/actions/touristPointActions';
import { RootState } from '../redux/store/store';
import '../styles/pages/TouristPointDetail.scss';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { GoogleMapsProvider } from '../components/MapFunctions/GoogleMapsLoader';
import MapComponent from '../components/MapFunctions/MapComponent';
import { compressAndConvertToBase64 } from '../utils/imageUtils';
import Loader from '../components/Loader/Loader';

const TouristPointDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const touristPoint = useAppSelector((state: RootState) => state.touristPoints.selectedTouristPoint);
    console.log("punto turistico", touristPoint);
    
    const [selectedImage, setSelectedImage] = useState<string | undefined>(touristPoint?.images[0]?.image_path);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState(touristPoint?.title || '');
    const [description, setDescription] = useState(touristPoint?.description || '');
    const [images, setImages] = useState(touristPoint?.images || []); 
    const [deletedImages, setDeletedImages] = useState<number[]>([]); 
    //imagenes que se envian
    const [newImages, setNewImages] = useState<{ filename: string, data: string }[]>([]);  
    //imagenes que se ven
    const [previewImages, setPreviewImages] = useState<string[]>([]); 
    
    useEffect(() => {
        if (id) {
            dispatch(fetchTouristPointById(Number(id)));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (touristPoint) {
            setSelectedImage(touristPoint.images[0]?.image_path);
            setLocation({ lat: touristPoint.latitude, lng: touristPoint.longitude });
            setTitle(touristPoint.title);
            setDescription(touristPoint.description);
            setImages(touristPoint.images);
        }
    }, [touristPoint]);

    const handleDelete = () => {
        if (id) {
            dispatch(deleteTouristPointById(Number(id)));
            navigate('/tourist-points');
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        if (id && location) {
            
            const updatedTouristPoint = {
                title,
                description,
                latitude: location.lat,
                longitude: location.lng,
                images: newImages,
            };
            console.log("punto turistico actualizado",updatedTouristPoint);
            setPreviewImages([])
            dispatch(updateTouristPointById(id, updatedTouristPoint, deletedImages));
            dispatch(fetchTouristPointById(Number(id)));
            setEditMode(false);
        }
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setLocation({ lat, lng });
    };

    const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          const selectedFiles = Array.from(e.target.files);
          
          const imagesWithBase64 = await Promise.all(selectedFiles.map(async (file) => {
            const base64Data = await compressAndConvertToBase64(file);
            const base64WithoutPrefix = base64Data.split(',')[1];
            return {
              filename: file.name,
              data: base64WithoutPrefix,
            };
          }));
          
          setNewImages((prevImages) => [...prevImages, ...imagesWithBase64]);
          setPreviewImages((prevPreviews) => [...prevPreviews, ...imagesWithBase64.map(image => `data:image/jpeg;base64,${image.data}`)]);
        }
      };

    const handleRemoveImage = (image: any, index: number) => {
        if (image.id) {
            setDeletedImages((prev) => [...prev, image.id]);
            setImages((prevImages) => prevImages.filter((_, i) => i !== index));
        } else {
            const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
            setPreviewImages(updatedPreviewImages);
            setNewImages((prevNewImages) => prevNewImages.filter((_, i) => i !== index));
        }
    };
    const handleCancel = () => {
        setEditMode(false)
        setPreviewImages([])
        setNewImages([])
    }

    if (!touristPoint) return <Loader/>;

    return (
        <Container className="tourist-point-detail">
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card className="detail-card">
                        {editMode ? (
                            <>
                                <TextField
                                    label="Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                />
                                {/* Input para agregar nuevas imágenes */}
                                <Button component="label" className="btnMore" startIcon={<FaPlusCircle />}>
                                    Agregar Imágenes
                                    <input type="file" accept="image/*" multiple hidden onChange={handleAddImage} />
                                </Button>
                            </>
                        ) : (
                            <>
                                <img src={selectedImage} alt={touristPoint.title} className="detail-image" />
                                <div className='listimages'>
                                {images.map((image, index) => (
                                        <Grid item key={index}>
                                            <div className="thumbnail-wrapper-list">
                                                <img
                                                    src={image.image_path}
                                                    alt={`Thumbnail ${index}`}
                                                    className="thumbnail"
                                                    onClick={() => setSelectedImage(image.image_path)}
                                                />
                                                {editMode && (
                                                    <FaTimesCircle
                                                        className="remove-icon"
                                                        onClick={() => handleRemoveImage(image, index)}
                                                    />
                                                )}
                                            </div>
                                        </Grid>
                                    ))}
                                </div>
                           
                                <Typography variant="h4">{touristPoint.title}</Typography>
                                <Rating name="read-only" value={touristPoint.average_rating} readOnly precision={0.5} />
                                <Typography variant="body1">{touristPoint.description}</Typography>
                            </>
                        )}

                        <div className="buttons-container">
                            {editMode ? (
                                <>
                                    <Button
                                        className='btnSave'
                                        startIcon={<FaSave />}
                                        onClick={handleSave}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        className='btnCancel'
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
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
                                </>
                            )}
                        </div>
                    </Card>

                    {/* Galería de miniaturas */}

                   <Grid container spacing={1} className="thumbnails-container">
                     {editMode &&
                            (images.map((image, index) => (
                                <Grid item key={index}>
                                    <div className="thumbnail-wrapper">
                                        <img
                                            src={image.image_path}
                                            alt={`Thumbnail ${index}`}
                                            className="thumbnail"
                                            onClick={() => setSelectedImage(image.image_path)}
                                        />
                                        {editMode && (
                                            <button
                                            type="button"
                                            className="remove-icon"
                                            onClick={() => handleRemoveImage(image, index)}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 16 16"><path fill="#ce0000" fillRule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1zM9 2H6v1h3zM4 13h7V4H4zm2-8H5v7h1zm1 0h1v7H7zm2 0h1v7H9z" clipRule="evenodd"/></svg>
                                          </button>
                                            // <FaTimesCircle
                                            //     className="remove-icon"
                                            //     onClick={() => handleRemoveImage(image, index)}
                                            // />
                                        )}
                                    </div>
                                </Grid>
                            )))
                   }

                            {/* Renderizar nuevas imágenes en base64 */}
                            {previewImages.map((base64Image, index) => (
                                <Grid item key={`new-${index}`}>
                                    <div className="thumbnail-wrapper">
                                        <img
                                            src={base64Image}
                                            alt={`New Thumbnail ${index}`}
                                            className="thumbnail"
                                            onClick={() => setSelectedImage(base64Image)}
                                        />
                                        {editMode && (
                                            <button
                                            type="button"
                                            className="remove-icon"
                                            onClick={() => handleRemoveImage(base64Image, index)}
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 16 16"><path fill="#ce0000" fillRule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1zM9 2H6v1h3zM4 13h7V4H4zm2-8H5v7h1zm1 0h1v7H7zm2 0h1v7H9z" clipRule="evenodd"/></svg>
                                          </button>
                                            // <FaTimesCircle
                                            //     className="remove-icon"
                                            //     onClick={() => handleRemoveImage(base64Image, index)}
                                            // />
                                        )}
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                </Grid>

                {/* Mapa */}
                <Grid item xs={12} md={6}>
                    <Card className="map-card">
                        <GoogleMapsProvider>
                            <MapComponent
                                center={location || { lat: touristPoint.latitude, lng: touristPoint.longitude }}
                                onLocationChange={handleLocationChange}
                                zoom={13}
                                markerPosition={location || { lat: touristPoint.latitude, lng: touristPoint.longitude }}
                                editMode={editMode} 
                            />
                        </GoogleMapsProvider>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TouristPointDetail;
