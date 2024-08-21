import { useEffect, useState } from 'react';
import { createUser,assignRoleToUser } from '../../redux/actions/userActions';
import Swal from 'sweetalert2';
import '../../styles/components/_RegisterPartnerModal.scss';
import { useAppDispatch } from '../../redux/store/hooks';
import { createPartner } from '../../redux/actions/partnerActions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { fetchAllPromotions } from '../../redux/actions/promotionActions';
import { fetchCountries } from '../../redux/actions/globalDataActions';
import MarketStall from '../../assets/icons/MarketStall.svg'

interface RegisterPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterPartnerModal: React.FC<RegisterPartnerModalProps> = ({ isOpen, onClose }) => {
    const dispatch = useAppDispatch();
  
    // Acceder a los países y categorías desde el estado global
    const countries = useSelector((state: RootState) => state.globalData.countries);
    const categories = useSelector((state: RootState) => state.globalData.categories);
  
    useEffect(() => {
        dispatch(fetchAllPromotions());
        dispatch(fetchCountries());
    }, [dispatch]);
    const [userForm, setUserForm] = useState({
      password: '',
      first_name: '',
      last_name: '',
      country: '',
      email: '',
      status_id: 1,
      city: '',
      birth_date: '',
      phone_number: '',
      gender: 'male',
      subscribed_to_newsletter: false,
    //   image_url: ''
    });
  console.log("formulario de crear usuario",userForm);
  
    const [partnerForm, setPartnerForm] = useState({
      address: '',
      contact_info: '',
      business_type: '',
      category_ids: [] as number[]
    });
    console.log("formulario de crear asociado",partnerForm);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  
    const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setUserForm({
        ...userForm,
        [e.target.name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
      });
    };
  
    const handlePartnerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (name === 'category_ids') {
        const categoryId = parseInt(value);
        const newCategoryIds = partnerForm.category_ids.includes(categoryId)
          ? partnerForm.category_ids.filter(id => id !== categoryId)
          : [...partnerForm.category_ids, categoryId];
        setPartnerForm({
          ...partnerForm,
          category_ids: newCategoryIds
        });
      } else {
        setPartnerForm({
          ...partnerForm,
          [name]: value
        });
      }
    };
  
    const handleRegisterUser = async () => {
        try {
          const createdUserAction = await dispatch(createUser(userForm));
          const createdUser = createdUserAction.payload; 
      
          if (createdUserAction && createdUser) {
            setCurrentUserId(createdUser.user_id);
      
            // Asignar el rol de asociado
            const assignRoleAction = await dispatch(assignRoleToUser({
              role_ids: [2],
              user_id: createdUser.user_id
            }));
      
            if (assignRoleAction) {
              // Crear el Partner
              const partnerData = {
                ...partnerForm,
                user_id: createdUser.user_id
              };
      
              const createPartnerAction = await dispatch(createPartner(partnerData));
      
              if (createPartnerAction) {
                Swal.fire({
                  title: '¡Usuario creado exitosamente!',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                onClose();
              } else {
                throw new Error('Error al crear el Partner');
              }
            } else {
              throw new Error('Error al asignar el rol al usuario');
            }
          } else {
            throw new Error('Error al crear el usuario');
          }
        } catch (error: any) {
          Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      };
      
  
    return (
      <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-content">
          <img src={MarketStall} className='iconos' />
          <h2>Registrar Asociado</h2>
          <div className="form-section">
            <h3>Información del Usuario</h3>
            <input
              type="text"
              name="first_name"
              placeholder="Nombre"
              value={userForm.first_name}
              onChange={handleUserFormChange}
            />
            <input
              type="text"
              name="last_name"
              placeholder="Apellido"
              value={userForm.last_name}
              onChange={handleUserFormChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={userForm.password}
              onChange={handleUserFormChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userForm.email}
              onChange={handleUserFormChange}
            />
            <select
              name="country"
              value={userForm.country}
              onChange={handleUserFormChange}
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
              value={userForm.city}
              onChange={handleUserFormChange}
            />
            <input
              type="date"
              name="birth_date"
              value={userForm.birth_date}
              onChange={handleUserFormChange}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Número de Teléfono"
              value={userForm.phone_number}
              onChange={handleUserFormChange}
            />
            <select name="gender" value={userForm.gender} onChange={handleUserFormChange}>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
            {/* <input
              type="url"
              name="image_url"
              placeholder="URL de la Imagen"
              value={userForm.image_url}
              onChange={handleUserFormChange}
            /> */}
            <label>
              <input
                type="checkbox"
                name="subscribed_to_newsletter"
                checked={userForm.subscribed_to_newsletter}
                onChange={handleUserFormChange}
              />
              Suscribirse al boletín
            </label>
          </div>
  
          {currentUserId && (
            <div className="form-section">
              <h3>Información del Partner</h3>
              <input
                type="text"
                name="address"
                placeholder="Dirección"
                value={partnerForm.address}
                onChange={handlePartnerFormChange}
              />
              <input
                type="email"
                name="contact_info"
                placeholder="Correo de Contacto"
                value={partnerForm.contact_info}
                onChange={handlePartnerFormChange}
              />
              <input
                type="text"
                name="business_type"
                placeholder="Tipo de Negocio"
                value={partnerForm.business_type}
                onChange={handlePartnerFormChange}
              />
              <div className="checkbox-group">
                <h4>Categorías</h4>
                {categories.map((category:any) => (
                  <label key={category.id}>
                    <input
                      type="checkbox"
                      name="category_ids"
                      value={category.id}
                      checked={partnerForm.category_ids.includes(category.id)}
                      onChange={handlePartnerFormChange}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <button onClick={handleRegisterUser}>Registrar Asociado</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    );
  };
  
  export default RegisterPartnerModal;