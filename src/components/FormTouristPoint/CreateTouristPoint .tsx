import React, { useState } from 'react';
import '../../styles/components/CreateTouristPoint.scss';
import { GoogleMapsProvider } from '../MapFunctions/GoogleMapsLoader';
import MapComponent from '../MapFunctions/MapComponent';
import uploadIcon from '../../assets/images/uploadImage.png'
import { compressAndConvertToBase64 } from '../../utils/imageUtils';
import { useAppDispatch } from '../../redux/store/hooks';
import { createTouristPoint } from '../../redux/actions/touristPointActions';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateTouristPointForm = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const [formData, setFormData] = useState({
                                                title: '',
                                                description: '',
                                                location: '',
                                            });
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imagesData, setImagesData] = useState<{ filename: string, data: string }[]>([]);

console.log("ubicacion en el formulario",location);
  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const handleLocationChange = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // Convertir imágenes a base64 y almacenarlas
      const imagesWithBase64 = await Promise.all(selectedFiles.map(async (file) => {
        const base64Data = await compressAndConvertToBase64(file);
        const base64WithoutPrefix = base64Data.split(',')[1];
        return {
          filename: file.name,
          data: base64WithoutPrefix,
        };
      }));
      
      setImagesData((prevImages) => [...prevImages, ...imagesWithBase64]);
      setPreviewImages((prevPreviews) => [...prevPreviews, ...imagesWithBase64.map(image => `data:image/jpeg;base64,${image.data}`)]);
    }
  };
  const handleRemoveImage = (index: number) => {
    // Remover la imagen por su índice tanto de previewImages como de imagesData
    const updatedPreviewImages = previewImages.filter((_, i) => i !== index);
    const updatedImagesData = imagesData.filter((_, i) => i !== index);

    setPreviewImages(updatedPreviewImages);
    setImagesData(updatedImagesData);
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const newTouristPoint = {
      ...formData,
      latitude: location.lat,
      longitude: location.lng,
      images: imagesData,
    };
    try {
        // console.log('Punto Turístico Creado:', newTouristPoint);
        const response:any = await dispatch(createTouristPoint(newTouristPoint));
        if (response?.status === 201) {
          Toast.fire({
            icon: 'success',
            title: 'Punto Turístico creado exitosamente!',
          });
          navigate('/puntos_turisticos');
        } else {
          throw new Error('Error en la creación del punto turístico');
        }
      } catch (error) {
        Toast.fire({
          icon: 'error',
          title: 'Hubo un error al crear el punto turístico.',
        });
      }
  };
  const isSubmitDisabled = !formData.title || !formData.location || location.lat === 0 || location.lng === 0;
  return (
    <div className='create-tourist-point'>
      <h1>Crear Punto Turístico</h1>
      <div className="form-map-container">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Título:</label>
            <input
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <label>Descripción:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />

            <label>Ubicación:</label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              required
              placeholder="Cobquecura, Ñuble, Chile"
            />
          <div className="coordinates">
        <p><strong>Latitud:</strong> {location.lat}</p>
        <p><strong>Longitud:</strong> {location.lng}</p>
      </div>
            <button type="submit" disabled={isSubmitDisabled}>Crear Punto Turístico</button>
          </form>
        </div>
        <div className="map-container-text">
            <h4>Hacer click en el mapa o arrastrar el marcador hasta la ubicación correspondiente.</h4>
        <div className="map-container">
          <GoogleMapsProvider>
            <MapComponent onLocationChange={handleLocationChange} />
          </GoogleMapsProvider>
        </div>
        </div>
      </div>
      <div className="images-container">
        
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <div className="image-previews">
          <label htmlFor="image-upload" className="upload-icon">
            <img src={uploadIcon} alt="Subir imágenes" />
          </label>
          {previewImages.length? previewImages.map((image, index) => (
             <div key={index} className="image-preview-container">
             <img className='imagesLoad' src={image} alt={`Preview ${index}`} />
             <button
               type="button"
               className="remove-image-button"
               onClick={() => handleRemoveImage(index)}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 16 16"><path fill="#ce0000" fillRule="evenodd" d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1zM9 2H6v1h3zM4 13h7V4H4zm2-8H5v7h1zm1 0h1v7H7zm2 0h1v7H9z" clipRule="evenodd"/></svg>
             </button>
           </div>
          )): <label htmlFor="image-upload" className='uploadtext'>Sube las imágenes de tu punto de interés</label>}
        </div>
      </div>
    </div>
  );
};

export default CreateTouristPointForm;
