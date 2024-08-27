import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import '../styles/pages/UserProfile.scss';
import { formatDateTo_DD_MM_AAAA, formatDateTo_YYYY_MM_DD } from '../utils/dateUtils';
import { useSelector } from 'react-redux';
import { fetchCountries } from '../redux/actions/globalDataActions';
import { updateUser } from '../redux/actions/userActions';
import Swal from 'sweetalert2';
import { compressAndConvertToBase64 } from '../utils/imageUtils';

const UserProfile = () => {
  const { userData } = useAppSelector((state: RootState) => state.user);
  const countries = useAppSelector((state: RootState) => state.globalData.countries);
  const user = userData as any;
   console.log(user.birth_date);
   const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user.image_url || '');
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    country: user.country,
    city: user.city,
    birth_date: formatDateTo_YYYY_MM_DD(user.birth_date) ,
    phone_number: user.phone_number || '',
    gender: user.gender,
    image_data: '',
  });

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(user.image_url);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const base64String = await compressAndConvertToBase64(file); // Comprimir y convertir a base64
            const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, "");
            setFormData({ ...formData, image_data: base64Data });
            setImagePreview(base64String);
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo procesar la imagen',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
};
  const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    color: "#0F0C06",
    width: "400px",
    didOpen: (toast:any) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  const handleSave = async () => {
    // Implementar la llamada al backend para actualizar los datos del usuario.
    // Por ejemplo:
    const userData = {user_id: user.user_id, data: formData}

    const response = await dispatch(updateUser(userData))
console.log(response);
if (response?.status == 200) {
  Toast.fire({
    icon: "success",
    title: `Información modificada correctamente`,
  })
}else{
  Swal.fire({
    icon: "error",
    title: "Error",
    text: `Usuario o contraseña incorrectos`,
    width: "22rem",
    padding: "0.5rem",
  })
}
    // if (response.ok) {
    //   setIsEditing(false);
    //   // Manejar la actualización exitosa, tal vez recargar los datos del usuario
    // } else {
    //   // Manejar el error
    // }
  };
console.log("todos los paises", countries);

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        {isEditing ? (
          <div className="profile-data">
            <div className="profile-imageEdit">
            <label  htmlFor="file-input">
                  <div className='divUpdateimg'>
                     <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><g fill="none" stroke="white" strokeLinecap="round" strokeWidth="1.5"><path strokeLinejoin="round" d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"/><path strokeLinejoin="round" d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"/><path strokeMiterlimit="10" d="M18.707 15v5"/><path strokeLinejoin="round" d="m21 17.105l-1.967-1.967a.458.458 0 0 0-.652 0l-1.967 1.967"/></g>
                     </svg>
                  </div>   
              <img src={imagePreview} alt="User" />
          </label>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />
            </div>
            <div className="profile-infoEdit">
            <div className='columnData'> 
              <p><strong>Nombre:</strong>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </p>
              <p><strong>Apellido:</strong>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </p>
              <p><strong>Email:</strong>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </p>
              <p><strong>Fecha de Nacimiento:</strong>
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                />
              </p>
              </div>
              <div className='columnData'> 
              <p><strong>País:</strong>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  >
                    {countries.map((country: any) => (
                      <option  key={country.id} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </p>
              <p><strong>Ciudad:</strong>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </p>
              
              <p><strong>Teléfono:</strong>
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                />
              </p>
              <p><strong>Género:</strong>
                <input
                  type="text"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                />
              </p>
              </div>
            </div>
            <div className="edit-buttons">
              <button className="save-button" onClick={handleSave}>Guardar</button>
              <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="profile-data">
            <div className='imgInfo'>
            <div className='contImageP'>
            <div className="profile-image">
              <img
                src={imagePreview || "https://res.cloudinary.com/dbwmesg3e/image/upload/v1721157537/TurismoApp/no-product-image-400x400_1_ypw1vg_sw8ltj.png"}
                alt="User"
              />
            </div>
            </div>
            <div className="profile-info">
              {/* <div className='columnData'> */}
                <p><strong>Nombre:</strong> {user.first_name}</p>
                <p><strong>Apellido:</strong> {user.last_name}</p>
                <p><strong>Fecha de Nacimiento:</strong> { formatDateTo_DD_MM_AAAA(user.birth_date) }</p>
                <p><strong>Email:</strong> {user.email}</p>
              {/* </div>
              <div className='columnData'> */}
                <p><strong>País:</strong> {user.country}</p>
                <p><strong>Ciudad:</strong> {user.city}</p>
                <p><strong>Teléfono:</strong> {user.phone_number || 'N/A'}</p>
                <p><strong>Género:</strong> {user.gender}</p>
              {/* </div> */}
            </div>
            </div>
            <button className="edit-button" onClick={handleEdit}>Editar Perfil</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

