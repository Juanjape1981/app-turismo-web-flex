import { useEffect, useState } from 'react';
import { createUser, assignRoleToUser } from '../../redux/actions/userActions';
import Swal from 'sweetalert2';
import '../../styles/components/_RegisterPartnerModal.scss';
import { useAppDispatch } from '../../redux/store/hooks';
import { createPartner } from '../../redux/actions/partnerActions';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store/store';
import { fetchAllPromotions } from '../../redux/actions/promotionActions';
import { fetchCountries } from '../../redux/actions/globalDataActions';
import MarketStall from '../../assets/icons/MarketStall.svg';
import Loader from '../Loader/Loader';


interface RegisterPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterPartnerModal: React.FC<RegisterPartnerModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();

  // Acceder a los países y categorías desde el estado global
  const countries = useSelector((state: RootState) => state.globalData.countries);
  const categories = useSelector((state: RootState) => state.globalData.categories);
  const roles = useSelector((state: RootState) => state.user.roles);
  const [loading, setLoading] = useState(false);
  
  
console.log("categorias",categories);

  useEffect(() => {
    dispatch(fetchAllPromotions());
    dispatch(fetchCountries());
    
  }, [dispatch]);

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
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
    // Partner data
    address: '',
    contact_info: '',
    business_type: '',
    category_ids: [] as number[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    
    const categoryId = parseInt(e.target.value);
    setFormData((prevFormData) => {
      const newCategoryIds = prevFormData.category_ids.includes(categoryId)
        ? prevFormData.category_ids.filter(id => id !== categoryId)
        : [...prevFormData.category_ids, categoryId];
      return { ...prevFormData, category_ids: newCategoryIds };
    });
  };

  const handleSubmit = async () => {
    setLoading(true)
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setLoading(false)
      return;
    }
    try {
      const { address, contact_info, business_type, category_ids,confirmPassword, ...userForm } = formData;
      console.log("formData en la creacion ",formData);

      const createdUserAction = await dispatch(createUser(userForm));
      console.log("created user en payload",createdUserAction);
      
      const rolAssociated = roles?.find(rol=> rol.role_name == "associated")
      console.log("rol buscado",rolAssociated);
      if (createdUserAction && rolAssociated) {
        const data = {
          role_ids: [rolAssociated.role_id],
          user_id: createdUserAction.user_id
        }
        const assignRoleAction = await dispatch(assignRoleToUser(data));
        console.log(assignRoleAction);
        
        if (assignRoleAction) {
          const partnerData = {
            address,
            contact_info,
            business_type,
            category_ids,
            user_id: createdUserAction.user_id
          };
          console.log("partnerData en la creacion ",partnerData);
          const createPartnerAction = await dispatch(createPartner(partnerData));
          setLoading(false)
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
      setLoading(false)
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
       {loading && <Loader />}
  <div className="modal-content">
    <div className='divHeader'>
      <img src={MarketStall} className="iconos" />
    <h2>Registrar Asociado</h2>
    <hr />
    </div>
    
    <div className='cont_form-section'>
      {/* <h3>Información del asociado</h3> */}
    <div className="form-section">
      <div className="form-columns">
        <div className="column">
          <input
            type="text"
            name="first_name"
            placeholder="Nombre"
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Apellido"
            value={formData.last_name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
              type="date"
              name="birth_date"
              placeholder="Fecha de nacimiento"
              // value={formData.birth_date}
              onChange={handleChange}
              // onFocus={(e) => (e.target.type = 'date')} 
              // onBlur={(e) => (e.target.type = 'text')} 
            />
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Seleccione un país</option>
            {countries.map((country: any) => (
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
          />
        </div>
        <div className="column">
          
          
          <input
            type="text"
            name="phone_number"
            placeholder="Número de Teléfono"
            value={formData.phone_number}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Dirección"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        
      </div>
      {/* <label>
        <input
          type="checkbox"
          name="subscribed_to_newsletter"
          checked={formData.subscribed_to_newsletter}
          onChange={handleChange}
        />
        Suscribirse al boletín
      </label> */}
    {/* </div>

    <div className="form-section"> */}
      {/* <h3>Información del Partner</h3> */}
      <div className="form-columns">
        <div className="column">
          
          <input
            type="text"
            name="business_type"
            placeholder="Tipo de Negocio"
            value={formData.business_type}
            onChange={handleChange}
          />
        </div>
        <input
            type="email"
            name="contact_info"
            placeholder="Correo de la empresa"
            value={formData.contact_info}
            onChange={handleChange}
          />
         <div className='passwordDiv'>
  <input
    type="password"
    name="password"
    placeholder="Contraseña"
    value={formData.password}
    onChange={handleChange}
  />
  <input
    type="password"
    name="confirmPassword"
    placeholder="Confirmar Contraseña"
    value={formData.confirmPassword}
    onChange={handleChange}
  />
</div>
    </div>
      </div>
        
        <div className="form-section3">
 <div className="column">
          <div className="checkbox-group">
            <h4>Categorías</h4>
            {categories.map((category: any) => (
              <label key={category.category_id}>
                <input
                  type="checkbox"
                  name="category_ids"
                  value={category.category_id}
                  checked={formData.category_ids.includes(category.category_id)}
                  onChange={handleCategoryChange}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
        </div>
       </div>
       <div className='btnsDiv'>
          <button onClick={handleSubmit}>Registrar Asociado</button>
          <button onClick={onClose}>Cancelar</button>
       </div>
  </div>
</div>
)
};

export default RegisterPartnerModal;
