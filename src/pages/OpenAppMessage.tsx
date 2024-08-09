// import { Link } from 'react-router-dom';
import '../styles/pages/OpenAppMessage.scss';

const OpenAppMessage = () => {
  return (
    <div className="open-app-message">
      <img src="https://res.cloudinary.com/dbwmesg3e/image/upload/v1723216870/TurismoApp/construction_mqdn3y.png" alt="Abre tu aplicación" className="app-image" />
      <h1>¡Contraseña Restablecida!</h1>
      <p>Tu contraseña ha sido restablecida con éxito. Abre tu aplicación para continuar.</p>
      {/* <Link to="/" className="back-home-button">Volver al inicio</Link> */}
    </div>
  );
};

export default OpenAppMessage;