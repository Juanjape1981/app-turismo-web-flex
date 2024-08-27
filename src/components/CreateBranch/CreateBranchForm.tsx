import React, { useState } from 'react';
import '../../styles/components/CreateBranchForm.scss';
import { compressAndConvertToBase64 } from '../../utils/imageUtils';

const CreateBranchForm = ({
  onSubmit,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  onAddressBlur,
}: {
  onSubmit: (data: any) => void;
  latitude: number | null;
  longitude: number | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
  onAddressBlur: (address: string) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    address: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      address: '',
      imageUrl: '',
    };

    if (!formData.name) {
      newErrors.name = 'El nombre es obligatorio.';
      isValid = false;
    }

    if (!formData.address) {
      newErrors.address = 'La dirección es obligatoria.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, latitude, longitude });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64Image = await compressAndConvertToBase64(file);
        setFormData(prevData => ({
          ...prevData,
          imageUrl: base64Image,
        }));
      } catch (error) {
        console.error('Error al convertir la imagen:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-branch-form">
      <div className="form-group">
        <label htmlFor="image">Logo</label>
        <div className='profile-imageEdit'>
          <label htmlFor="file-input">
            <div className='divUpdateimg'>
              <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24">
                <g fill="none" stroke="white" strokeLinecap="round" strokeWidth="1.5">
                  <path strokeLinejoin="round" d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26" />
                  <path strokeLinejoin="round" d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32" />
                  <path strokeMiterlimit="10" d="M18.707 15v5" />
                  <path strokeLinejoin="round" d="m21 17.105l-1.967-1.967a.458.458 0 0 0-.652 0l-1.967 1.967" />
                </g>
              </svg>
            </div>
            <img src={formData.imageUrl || "https://res.cloudinary.com/dbwmesg3e/image/upload/v1721157537/TurismoApp/no-product-image-400x400_1_ypw1vg_sw8ltj.png"} alt="User" />
          </label>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />
        </div>
        {errors.imageUrl && <p className="error">{errors.imageUrl}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="name">Nombre de sucursal</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Dirección</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={() => onAddressBlur(formData.address)}
          className="form-control"
        />
        {errors.address && <p className="error">{errors.address}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="latitude">Latitud</label>
        <input
          type="text"
          id="latitude"
          name="latitude"
          value={latitude ?? ''}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="longitude">Longitud</label>
        <input
          type="text"
          id="longitude"
          name="longitude"
          value={longitude ?? ''}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
          className="form-control"
        />
      </div>

      <button type="submit" className="submit-button">Crear Sucursal</button>
    </form>
  );
};

export default CreateBranchForm;
