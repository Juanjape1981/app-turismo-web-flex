import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/UserProfile.scss';

const UserProfile = () => {
  const { userData } = useAppSelector((state: RootState) => state.user);
  const user = userData as any;
  const navigate = useNavigate();
console.log(user);

  const handleEdit = () => {
    // navigate('/edit-profile');
  };

  return (
    <div className="user-profile-container">

      <div className="profile-card">
        <div className='profile-data'>
        <div className="profile-image">
        <h1>Perfil del Usuario</h1>
          <img 
            src={user.image_url || "https://res.cloudinary.com/dbwmesg3e/image/upload/v1721157537/TurismoApp/no-product-image-400x400_1_ypw1vg_sw8ltj.png"} 
            alt="User" 
          />
        </div>
        <div className="profile-info">
          <p><strong>Nombre:</strong> {user.first_name}</p>
          <p><strong>Apellido:</strong> {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>País:</strong> {user.country}</p>
          <p><strong>Ciudad:</strong> {user.city}</p>
          <p><strong>Fecha de Nacimiento:</strong> {user.fecha_nacimiento}</p>
          <p><strong>Teléfono:</strong> {user.phone_number || 'N/A'}</p>
          <p><strong>Género:</strong> {user.gender}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <p><strong>Estado:</strong> {user.status.name}</p>
          {/* <p><strong>Suscrito a Newsletter:</strong> {user.suscrito_newsletter ? 'Sí' : 'No'}</p> */}
        </div>
        </div>
        <div>
        <button className="edit-button" onClick={handleEdit}>Editar Perfil</button>  
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
