import { useState } from 'react';
import Swal from 'sweetalert2';
import '../../styles/components/CardPartner.scss';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { Partner } from '../../models/PartnerModels';
import { updateUser } from '../../redux/actions/userActions';
import {updatePartner} from '../../redux/actions/partnerActions'
import { RootState } from '../../redux/store/store';
import { compressAndConvertToBase64 } from '../../utils/imageUtils';
import { Card, CardContent } from '@mui/material';
import withReactContent from 'sweetalert2-react-content';

interface PartnerCardProps {
    partner: Partner;
  }
  
  const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector((state: RootState) => state.globalData.countries);
  const categories = useAppSelector((state: RootState) => state.globalData.categories);
console.log("imprimiendo el partner", partner);
const [imagePreview, setImagePreview] = useState(partner.user.image_url || '');
  const [formData, setFormData] = useState({
    first_name: partner.user.first_name || '',
    last_name: partner.user.last_name || '',
    email: partner.user.email || '',
    phone_number: partner.user.phone_number || '',
    address: partner.address || '',
    city: partner.user.city || '',
    contact_info: partner.contact_info || '',
    business_type: partner.business_type || '',
    category_ids: partner.categories?.map((category:any) => category.category_id) || [],
    country: partner.user.country || '',
    image_data:''
  });

  const [isEditing, setIsEditing] = useState(false);
  const originalData = { ...formData };

  const handleChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: checked
      }));
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (e:any) => {
    const categoryId = parseInt(e.target.value);
    setFormData(prevFormData => {
      const newCategoryIds = prevFormData.category_ids.includes(categoryId)
        ? prevFormData.category_ids.filter((id:any) => id !== categoryId)
        : [...prevFormData.category_ids, categoryId];
      return { ...prevFormData, category_ids: newCategoryIds };
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({ ...originalData });
    setImagePreview(partner.user.image_url);
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
        const { address, contact_info, business_type, category_ids, ...userForm } = formData;
      // console.log("formData en la creacion ",formData);
      // console.log("formulario del user",userForm);
      const userData ={
        user_id: partner.user.user_id,
        data: userForm
      }

      const updateUserAction = await dispatch(updateUser(userData)); 
      console.log("updateUserAction______________", updateUserAction);
      if (updateUserAction?.status == 200) {
        const partnerData = {
            address,
            contact_info,
            business_type,
            category_ids
          };
        // console.log("formulario de partner",partnerData);
        
        const updatePartnerAction = await dispatch(updatePartner(partner.user.user_id, partnerData));
        // console.log("userpartneraction______________", updatePartnerAction);
        
        if (updatePartnerAction.status == 200) {
          Swal.fire({
            title: '¡Datos actualizados exitosamente!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          setIsEditing(false);
        } else {
          throw new Error('Error al actualizar el Partner');
        }
      } else {
        throw new Error('Error al actualizar el usuario');
      }
    } catch (error:any) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
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
const MySwal = withReactContent(Swal);
const handlePasswordChange = () => {
  MySwal.fire({
    title: 'Cambiar Contraseña',
    html: `
      <input type="password" id="currentPassword" class="swal2-input" placeholder="Contraseña actual">
      <input type="password" id="newPassword" class="swal2-input" placeholder="Nueva contraseña">
      <input type="password" id="confirmNewPassword" class="swal2-input" placeholder="Confirmar nueva contraseña">
    `,
    showCancelButton: true,
    confirmButtonText: 'Cambiar',
    preConfirm: () => {
      const currentPassword = (Swal.getPopup()!.querySelector('#currentPassword') as HTMLInputElement).value;
      const newPassword = (Swal.getPopup()!.querySelector('#newPassword') as HTMLInputElement).value;
      const confirmNewPassword = (Swal.getPopup()!.querySelector('#confirmNewPassword') as HTMLInputElement).value;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        Swal.showValidationMessage('Por favor, completa todos los campos');
      } else if (newPassword !== confirmNewPassword) {
        Swal.showValidationMessage('Las nuevas contraseñas no coinciden');
      } else {
        return { currentPassword, newPassword };
      }
    }
  }).then(async (result:any) => {
    if (result.isConfirmed) {
      const { currentPassword, newPassword } = result.value!;
      // Lógica para manejar el cambio de contraseña
      const userData ={
        user_id: partner.user.user_id,
        data:{
            password: newPassword,
            current_password: currentPassword
        }
      }
      const response = await dispatch(updateUser(userData))
    //   console.log("respuesta de actualizacion", response);
    //   console.log('Contraseña actual:', currentPassword);
    //   console.log('Nueva contraseña:', newPassword);
      if (response?.status == 200) {
        Swal.fire({
          icon: "success",
          title: "¡Contraseña cambiada!",
          text: "Tu contraseña ha sido modificada exitosamente.",
        }).then(() => {
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cambiar la contraseña. Intenta nuevamente.",
        });
      }
    }
  });
};
  return (
    <div className="partner-card">
      <div className="three-columns">
        <div className="column-avatar">
        <Card>
                         <CardContent>
                             <div className='passwordIcon' title='Cambiar contraseña' onClick={handlePasswordChange}>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16">
                                    <g fill="currentColor">
                                       <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647l.646-.647a.5.5 0 0 1 .708 0l.646.647l.646-.647a.5.5 0 0 1 .708 0l.646.647l.793-.793l-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                                        <path d="M4 8a1 1 0 1 1-2 0a1 1 0 0 1 2 0" />
                                    </g>
                                </svg>
                             </div>
        <div className="profile-imageEdit">
            <label  htmlFor="file-input">
                  <div className='divUpdateimg'>
                  {isEditing &&  <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><g fill="none" stroke="white" strokeLinecap="round" strokeWidth="1.5"><path strokeLinejoin="round" d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"/><path strokeLinejoin="round" d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"/><path strokeMiterlimit="10" d="M18.707 15v5"/><path strokeLinejoin="round" d="m21 17.105l-1.967-1.967a.458.458 0 0 0-.652 0l-1.967 1.967"/></g>
                     </svg>}
                  </div>   
              <img src={imagePreview} alt="User" />
          </label>
           {isEditing && <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input"
              />}   
            <p>{partner.user.email}</p>
            </div>
                        </CardContent>
                 </Card>
          {/* <img src={partner.user.image_url} alt={`${partner.user.first_name} ${partner.user.last_name}`} /> */}


          <div className="btnsDiv">
        {isEditing ? (
          <>
            <button className="active" onClick={handleSubmit}>Guardar</button>
            <button className="cancel" onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <button className="active" onClick={handleEdit}>Editar</button>
        )}
      </div>
        </div>
        <div className="column">
          <input
            type="text"
            name="first_name"
            placeholder="Nombre"
            value={formData.first_name}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Apellido"
            value={formData.last_name}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {/* <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={true}
          /> */}
          <input
            type="text"
            name="phone_number"
            placeholder="Número de Teléfono"
            value={formData.phone_number}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Seleccione un país</option>
            {countries.map((country:any) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="city"
            placeholder="Ciudad"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <input
            type="text"
            name="contact_info"
            placeholder="Correo de la empresa"
            value={formData.contact_info}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <input
            type="text"
            name="business_type"
            placeholder="Tipo de Negocio"
            value={formData.business_type}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>
        <div className="column">
            <h4>Categorías</h4>
          <div className="checkbox-group">
            {categories.map((category:any) => (
              <label key={category.category_id}>
                <input
                  type="checkbox"
                  name="category_ids"
                  value={category.category_id}
                  checked={formData.category_ids.includes(category.category_id)}
                  onChange={handleCategoryChange}
                  disabled={!isEditing}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default PartnerCard;
